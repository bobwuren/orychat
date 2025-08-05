"use client"

import {type Icon} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"


import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    // Utiliser le hook usePathname de Next.js pour obtenir le chemin actuel de manière cohérente
    const pathname = usePathname();
    
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => {
                        // Vérifier si cet élément correspond au chemin actuel
                        const isActive = pathname ? pathname.includes(item.url) : false;
                        
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton 
                                    asChild 
                                    tooltip={item.title}
                                    className={isActive ? "!bg-primary !text-primary-foreground hover:!bg-primary/90 hover:!text-primary-foreground" : ""}
                                    data-active={isActive}
                                >
                                    <Link href={item.url} className="flex items-center gap-2 w-full">
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
