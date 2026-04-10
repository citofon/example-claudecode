import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission, type Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface PermisoGrupo {
    modulo: string;
    permisos: Permission[];
}

interface Props {
    rol?: Role;
    permisos: PermisoGrupo[];
}

export default function RolForm({ rol, permisos }: Props) {
    const isEdit = !!rol;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Roles', href: '/roles' },
        { title: isEdit ? 'Editar rol' : 'Nuevo rol', href: '#' },
    ];

    const permisosIniciales = rol?.permissions?.map((p) => p.name) ?? [];

    const { data, setData, post, put, processing, errors } = useForm({
        name: rol?.name ?? '',
        permisos: permisosIniciales as string[],
    });

    function togglePermiso(nombre: string, checked: boolean) {
        setData('permisos', checked ? [...data.permisos, nombre] : data.permisos.filter((p) => p !== nombre));
    }

    function toggleModulo(grupo: PermisoGrupo, checked: boolean) {
        const nombres = grupo.permisos.map((p) => p.name);
        if (checked) {
            const nuevos = nombres.filter((n) => !data.permisos.includes(n));
            setData('permisos', [...data.permisos, ...nuevos]);
        } else {
            setData('permisos', data.permisos.filter((p) => !nombres.includes(p)));
        }
    }

    function moduloCompleto(grupo: PermisoGrupo): boolean {
        return grupo.permisos.every((p) => data.permisos.includes(p.name));
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/roles/${rol!.id}`);
        } else {
            post('/roles');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar rol' : 'Nuevo rol'} />

            <div className="max-w-3xl p-6">
                <h1 className="mb-6 text-2xl font-semibold">{isEdit ? 'Editar rol' : 'Nuevo rol'}</h1>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name">Nombre del rol</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="max-w-sm"
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Label>Permisos</Label>

                        {permisos.map((grupo) => (
                            <div key={grupo.modulo} className="rounded-lg border p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <Checkbox
                                        id={`modulo-${grupo.modulo}`}
                                        checked={moduloCompleto(grupo)}
                                        onCheckedChange={(checked) => toggleModulo(grupo, !!checked)}
                                    />
                                    <label
                                        htmlFor={`modulo-${grupo.modulo}`}
                                        className="cursor-pointer text-sm font-semibold capitalize"
                                    >
                                        {grupo.modulo}
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pl-6 sm:grid-cols-3">
                                    {grupo.permisos.map((permiso) => {
                                        const partes = permiso.name.split('.');
                                        const etiqueta = `${partes[1]}.${partes[2]}`;
                                        return (
                                            <div key={permiso.name} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={permiso.name}
                                                    checked={data.permisos.includes(permiso.name)}
                                                    onCheckedChange={(checked) => togglePermiso(permiso.name, !!checked)}
                                                />
                                                <label
                                                    htmlFor={permiso.name}
                                                    className="text-muted-foreground cursor-pointer text-xs"
                                                >
                                                    {etiqueta}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Guardar cambios' : 'Crear rol'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/roles">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
