<?php

namespace App\Http\Controllers\Modules\Usuarios;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usuarios\StoreUsuarioRequest;
use App\Http\Requests\Usuarios\UpdateUsuarioRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UsuarioController extends Controller
{
    public function index(): Response
    {
        $usuarios = User::with('roles')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('modules/usuarios/index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('modules/usuarios/form', [
            'roles' => Role::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreUsuarioRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => $validated['password'],
            'cargo'    => $validated['cargo'] ?? null,
            'telefono' => $validated['telefono'] ?? null,
        ]);

        if (!empty($validated['rol'])) {
            $user->assignRole($validated['rol']);
        }

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('modules/usuarios/form', [
            'usuario' => $user->load('roles'),
            'roles'   => Role::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateUsuarioRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        $data = [
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'cargo'    => $validated['cargo'] ?? null,
            'telefono' => $validated['telefono'] ?? null,
            'activo'   => $validated['activo'] ?? $user->activo,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $user->update($data);

        $user->syncRoles($validated['rol'] ? [$validated['rol']] : []);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }
}
