import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Props {
    roles: Role[];
}

const ROLES_SISTEMA = ['super-admin', 'admin'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Usuarios', href: '/usuarios' },
    { title: 'Roles', href: '/roles' },
];

export default function RolesIndex({ roles }: Props) {
    function eliminar(id: number, nombre: string) {
        if (confirm(`¿Eliminar el rol "${nombre}"?`)) {
            router.delete(`/roles/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Roles</h1>
                    <Button asChild>
                        <Link href="/roles/create">Nuevo rol</Link>
                    </Button>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Usuarios</TableHead>
                                <TableHead>Permisos</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-muted-foreground py-8 text-center">
                                        No hay roles registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                            {roles.map((rol) => (
                                <TableRow key={rol.id}>
                                    <TableCell className="font-medium">
                                        {rol.name}
                                        {ROLES_SISTEMA.includes(rol.name) && (
                                            <Badge variant="outline" className="ml-2 text-xs">
                                                sistema
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{rol.users_count ?? 0}</TableCell>
                                    <TableCell>{rol.permissions_count ?? 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/roles/${rol.id}/edit`}>Editar</Link>
                                            </Button>
                                            {!ROLES_SISTEMA.includes(rol.name) && (
                                                <Button variant="destructive" size="sm" onClick={() => eliminar(rol.id, rol.name)}>
                                                    Eliminar
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
