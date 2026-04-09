<?php

namespace App\Http\Controllers\Modules\Usuarios;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolController extends Controller
{
    public function index(): Response
    {
        $roles = Role::withCount(['users', 'permissions'])
            ->orderBy('name')
            ->get();

        return Inertia::render('modules/usuarios/roles/index', [
            'roles' => $roles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('modules/usuarios/roles/form', [
            'permisos' => $this->permisosAgrupados(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permisos'  => ['array'],
            'permisos.*'=> ['string', 'exists:permissions,name'],
        ]);

        $rol = Role::create(['name' => $validated['name']]);
        $rol->syncPermissions($validated['permisos'] ?? []);

        return redirect()->route('roles.index')
            ->with('success', 'Rol creado correctamente.');
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('modules/usuarios/roles/form', [
            'rol'     => $role->load('permissions'),
            'permisos'=> $this->permisosAgrupados(),
        ]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name'      => ['required', 'string', 'max:255', "unique:roles,name,{$role->id}"],
            'permisos'  => ['array'],
            'permisos.*'=> ['string', 'exists:permissions,name'],
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permisos'] ?? []);

        return redirect()->route('roles.index')
            ->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')
                ->with('error', "No se puede eliminar el rol '{$role->name}' porque tiene usuarios asignados.");
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Rol eliminado correctamente.');
    }

    private function permisosAgrupados(): array
    {
        return Permission::all()
            ->groupBy(fn($p) => explode('.', $p->name)[0])
            ->map(fn($permisos, $modulo) => [
                'modulo'   => $modulo,
                'permisos' => $permisos->map(fn($p) => [
                    'id'   => $p->id,
                    'name' => $p->name,
                ])->values(),
            ])
            ->values()
            ->toArray();
    }
}
