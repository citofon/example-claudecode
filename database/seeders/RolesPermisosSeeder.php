<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesPermisosSeeder extends Seeder
{
    const MODULOS = [
        'usuarios'     => ['usuarios', 'roles', 'permisos'],
        'rrhh'         => ['empleados', 'contratos', 'asistencia', 'vacaciones'],
        'cumplimiento' => ['certificados', 'auditorias', 'documentos'],
        'planificacion'=> ['proyectos', 'tareas', 'recursos'],
        'logistica'    => ['transporte', 'rutas', 'proveedores'],
        'activos'      => ['equipos', 'mantenimiento', 'inventario'],
        'bodega'       => ['stock', 'movimientos', 'pedidos'],
        'finanzas'     => ['presupuesto', 'facturas', 'reportes'],
        'conciliacion' => ['cuentas', 'diferencias', 'cierres'],
        'ia'           => ['alertas', 'predicciones', 'configuracion'],
    ];

    const ACCIONES = ['ver', 'crear', 'editar', 'eliminar', 'exportar'];

    public function run(): void
    {
        // Limpiar caché de permisos
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear todos los permisos
        $todosLosPermisos = [];

        foreach (self::MODULOS as $modulo => $recursos) {
            foreach ($recursos as $recurso) {
                foreach (self::ACCIONES as $accion) {
                    $nombre = "{$modulo}.{$recurso}.{$accion}";
                    Permission::findOrCreate($nombre);
                    $todosLosPermisos[] = $nombre;
                }
            }
        }

        // super-admin: todos los permisos
        $superAdmin = Role::findOrCreate('super-admin');
        $superAdmin->syncPermissions($todosLosPermisos);

        // admin: todos excepto ia.configuracion.*
        $admin = Role::findOrCreate('admin');
        $permisosAdmin = array_filter($todosLosPermisos, fn($p) => !str_starts_with($p, 'ia.configuracion.'));
        $admin->syncPermissions(array_values($permisosAdmin));

        // rrhh-manager: todos los permisos de rrhh
        $rrhhManager = Role::findOrCreate('rrhh-manager');
        $rrhhManager->syncPermissions(
            Permission::where('name', 'like', 'rrhh.%')->pluck('name')->toArray()
        );

        // finanzas-manager: finanzas + conciliacion
        $finanzasManager = Role::findOrCreate('finanzas-manager');
        $finanzasManager->syncPermissions(
            Permission::where('name', 'like', 'finanzas.%')
                ->orWhere('name', 'like', 'conciliacion.%')
                ->pluck('name')
                ->toArray()
        );

        // bodega-operador: bodega + activos.inventario
        $bodegaOperador = Role::findOrCreate('bodega-operador');
        $bodegaOperador->syncPermissions(
            Permission::where('name', 'like', 'bodega.%')
                ->orWhere('name', 'like', 'activos.inventario.%')
                ->pluck('name')
                ->toArray()
        );

        // visualizador: solo *.*.ver en todos los módulos
        $visualizador = Role::findOrCreate('visualizador');
        $visualizador->syncPermissions(
            Permission::where('name', 'like', '%.ver')->pluck('name')->toArray()
        );
    }
}
