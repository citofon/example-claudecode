<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Spatie\Permission\Models\Permission;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'navigation' => $this->buildNavigation($request->user()),
        ]);
    }

    private function buildNavigation(?User $user): array
    {
        if (! $user) {
            return [];
        }

        $items = [
            ['title' => 'Dashboard', 'icon' => 'layout-grid', 'url' => route('dashboard')],
        ];

        $modulos = [
            ['permiso' => 'usuarios',      'title' => 'Usuarios',      'icon' => 'users',        'url' => '/usuarios'],
            ['permiso' => 'rrhh',          'title' => 'RRHH',          'icon' => 'hard-hat',     'url' => '/rrhh'],
            ['permiso' => 'cumplimiento',  'title' => 'Cumplimiento',  'icon' => 'shield-check', 'url' => '/cumplimiento'],
            ['permiso' => 'planificacion', 'title' => 'Planificación', 'icon' => 'calendar',     'url' => '/planificacion'],
            ['permiso' => 'logistica',     'title' => 'Logística',     'icon' => 'truck',        'url' => '/logistica'],
            ['permiso' => 'activos',       'title' => 'Activos',       'icon' => 'package',      'url' => '/activos'],
            ['permiso' => 'bodega',        'title' => 'Bodega',        'icon' => 'box',          'url' => '/bodega'],
            ['permiso' => 'finanzas',      'title' => 'Finanzas',      'icon' => 'dollar-sign',  'url' => '/finanzas'],
            ['permiso' => 'conciliacion',  'title' => 'Conciliación',  'icon' => 'file-check',   'url' => '/conciliacion'],
            ['permiso' => 'ia',            'title' => 'IA Asistiva',   'icon' => 'bot',          'url' => '/ia'],
        ];

        foreach ($modulos as $m) {
            $permisosDelModulo = Permission::where('name', 'like', $m['permiso'].'.%')
                ->pluck('name')
                ->toArray();

            if (! empty($permisosDelModulo) && $user->hasAnyPermission($permisosDelModulo)) {
                $items[] = [
                    'title' => $m['title'],
                    'icon' => $m['icon'],
                    'url' => $m['url'],
                ];
            }
        }

        return $items;
    }
}
