<?php

use App\Http\Controllers\Modules\Usuarios\RolController;
use App\Http\Controllers\Modules\Usuarios\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {

    // Usuarios
    Route::middleware('permission:usuarios.usuarios.ver')->group(function () {
        Route::get('usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
        Route::get('usuarios/{user}/edit', [UsuarioController::class, 'edit'])->name('usuarios.edit');
    });

    Route::get('usuarios/create', [UsuarioController::class, 'create'])
        ->middleware('permission:usuarios.usuarios.crear')
        ->name('usuarios.create');

    Route::post('usuarios', [UsuarioController::class, 'store'])
        ->middleware('permission:usuarios.usuarios.crear')
        ->name('usuarios.store');

    Route::put('usuarios/{user}', [UsuarioController::class, 'update'])
        ->middleware('permission:usuarios.usuarios.editar')
        ->name('usuarios.update');

    Route::delete('usuarios/{user}', [UsuarioController::class, 'destroy'])
        ->middleware('permission:usuarios.usuarios.eliminar')
        ->name('usuarios.destroy');

    // Roles
    Route::middleware('permission:usuarios.roles.ver')->group(function () {
        Route::get('roles', [RolController::class, 'index'])->name('roles.index');
        Route::get('roles/{role}/edit', [RolController::class, 'edit'])->name('roles.edit');
    });

    Route::get('roles/create', [RolController::class, 'create'])
        ->middleware('permission:usuarios.roles.crear')
        ->name('roles.create');

    Route::post('roles', [RolController::class, 'store'])
        ->middleware('permission:usuarios.roles.crear')
        ->name('roles.store');

    Route::put('roles/{role}', [RolController::class, 'update'])
        ->middleware('permission:usuarios.roles.editar')
        ->name('roles.update');

    Route::delete('roles/{role}', [RolController::class, 'destroy'])
        ->middleware('permission:usuarios.roles.eliminar')
        ->name('roles.destroy');
});
