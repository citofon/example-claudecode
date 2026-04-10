import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { icons, LucideIcon } from 'lucide-react';

function DynamicIcon({ name }: { name?: LucideIcon | string | null }) {
    if (!name || typeof name !== 'string') return null;
    const pascal = name
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('') as keyof typeof icons;
    const Icon = icons[pascal] as LucideIcon | undefined;
    return Icon ? <Icon className="h-4 w-4" /> : null;
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.url)}>
                            <Link href={item.url} prefetch>
                                <DynamicIcon name={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
