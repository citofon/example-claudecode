import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role, type SharedData, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    usuarios: {
        data: User[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Usuarios', href: '/usuarios' },
];

export default function UsuariosIndex({ usuarios }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<User | null>(null);

    function confirmarEliminar() {
        if (!usuarioAEliminar) return;
        router.delete(`/usuarios/${usuarioAEliminar.id}`, {
            onFinish: () => setUsuarioAEliminar(null),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Usuarios</h1>
                    <Button asChild>
                        <Link href="/usuarios/create">Nuevo usuario</Link>
                    </Button>
                </div>

                <div className="rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usuarios.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                                        No hay usuarios registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                            {usuarios.data.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.cargo ?? '—'}</TableCell>
                                    <TableCell>
                                        {u.roles && u.roles.length > 0 ? (
                                            <Badge variant="secondary">{(u.roles[0] as Role).name}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">Sin rol</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={u.activo ? 'default' : 'destructive'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/usuarios/${u.id}/edit`}>Editar</Link>
                                            </Button>
                                            {u.id !== auth.user.id && (
                                                <Button variant="destructive" size="sm" onClick={() => setUsuarioAEliminar(u)}>
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

                {/* Paginación */}
                {(usuarios.prev_page_url || usuarios.next_page_url) && (
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" disabled={!usuarios.prev_page_url} asChild={!!usuarios.prev_page_url}>
                            {usuarios.prev_page_url ? <Link href={usuarios.prev_page_url}>Anterior</Link> : <span>Anterior</span>}
                        </Button>
                        <Button variant="outline" size="sm" disabled={!usuarios.next_page_url} asChild={!!usuarios.next_page_url}>
                            {usuarios.next_page_url ? <Link href={usuarios.next_page_url}>Siguiente</Link> : <span>Siguiente</span>}
                        </Button>
                    </div>
                )}
            </div>

            {/* Dialog de confirmación */}
            <Dialog open={!!usuarioAEliminar} onOpenChange={(open) => !open && setUsuarioAEliminar(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar usuario?</DialogTitle>
                        <DialogDescription>
                            Estás por eliminar a <span className="text-foreground font-semibold">{usuarioAEliminar?.name}</span>. Esta acción se puede
                            revertir.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUsuarioAEliminar(null)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmarEliminar}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
