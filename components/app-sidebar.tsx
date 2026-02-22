"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import {
  BarChart3Icon,
  BookOpenIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SchoolIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Utilisateurs", url: "/admin/users", icon: UsersIcon },
  {
    title: "Consultations",
    url: "/admin/consultations",
    icon: MessageSquareIcon,
  },
  { title: "Conseillers", url: "/admin/counselors", icon: UserCheckIcon },
  { title: "Universités", url: "/admin/universities", icon: SchoolIcon },
  { title: "Diplômes", url: "/admin/degrees", icon: GraduationCapIcon },
  { title: "Séries", url: "/admin/series", icon: BookOpenIcon },
  { title: "Matières", url: "/admin/subjects", icon: LayoutDashboardIcon },
  {
    title: "Recommandations",
    url: "/admin/recommendations",
    icon: BarChart3Icon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin/users">
                <span className="text-base font-semibold">Orientys Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
