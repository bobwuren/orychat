"use client"

import * as React from "react"
import {
    IconDatabase,
    IconFileAi,
    IconFolder,
    IconSchool,
    IconInnerShadowTop,
    IconListDetails,
    IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"

import {NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/services/usersAdminService"
import { User } from "@/types/entities"

const data = {
    user: {
        name: "Admin",
        avatar: "/avatars/admin.jpg",
    },
    navMain: [
        {
            title: "Utilisateurs",
            url: "/users",
            icon: IconUsers,
        },
        {
            title: "Recommandations",
            url: "/recommendations",
            icon: IconFileAi,
        },
        {
            title: "Séries",
            url: "/series",
            icon: IconListDetails,
        },
        {
            title: "Matières",
            url: "/subjects",
            icon: IconDatabase,
        },
        {
            title: "Universités",
            url: "/universities",
            icon: IconFolder,
        },
        {
            title: "Diplômes",
            url: "/degrees",
            icon: IconSchool,
        },
    ],
    documents: [],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const [currentUser, setCurrentUser] = React.useState<User | null>(null)

    React.useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                // Récupérer l'ID de l'admin depuis le localStorage
                const adminId = localStorage.getItem("adminId")
                if (adminId) {
                    const user = await getCurrentUser(adminId)
                    setCurrentUser(user)
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'utilisateur:", error)
            }
        }

        loadCurrentUser()
    }, [])

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/">
                                <IconInnerShadowTop className="!size-5"/>
                                <span className="text-base font-semibold">Orientys Admin</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{
                    name: "Admin",
                    email: currentUser?.email || "admin@example.com",
                    avatar: "/avatars/admin.jpg"
                }}/>
            </SidebarFooter>
        </Sidebar>
    )
}
