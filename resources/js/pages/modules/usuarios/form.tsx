import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role, type User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    usuario?: User;
    roles: Role[];
}

export default function UsuarioForm({ usuario, roles }: Props) {
    const isEdit = !!usuario;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Usuarios', href: '/usuarios' },
        { title: isEdit ? 'Editar usuario' : 'Nuevo usuario', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: usuario?.name ?? '',
        email: usuario?.email ?? '',
        password: '',
        cargo: usuario?.cargo ?? '',
        telefono: usuario?.telefono ?? '',
        activo: usuario?.activo ?? true,
        rol: usuario?.roles?.[0]?.name ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/usuarios/${usuario!.id}`);
        } else {
            post('/usuarios');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Editar usuario' : 'Nuevo usuario'} />

            <div className="max-w-xl p-6">
                <h1 className="mb-6 text-2xl font-semibold">{isEdit ? 'Editar usuario' : 'Nuevo usuario'}</h1>

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoComplete="off"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="off"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="password">
                            Contraseña {isEdit && <span className="text-muted-foreground text-sm">(dejar vacío para no cambiar)</span>}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input
                            id="cargo"
                            value={data.cargo}
                            onChange={(e) => setData('cargo', e.target.value)}
                        />
                        <InputError message={errors.cargo} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                            id="telefono"
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}
                        />
                        <InputError message={errors.telefono} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="rol">Rol</Label>
                        <Select value={data.rol} onValueChange={(v) => setData('rol', v)}>
                            <SelectTrigger id="rol">
                                <SelectValue placeholder="Sin rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r.id} value={r.name}>
                                        {r.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.rol} />
                    </div>

                    {isEdit && (
                        <div className="flex items-center gap-2">
                            <input
                                id="activo"
                                type="checkbox"
                                checked={data.activo}
                                onChange={(e) => setData('activo', e.target.checked)}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="activo">Usuario activo</Label>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {isEdit ? 'Guardar cambios' : 'Crear usuario'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/usuarios">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
