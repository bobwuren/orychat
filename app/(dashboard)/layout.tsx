import {AppSidebar} from "@/components/app-sidebar";
import {SidebarProvider} from "@/components/ui/sidebar";
import React from "react";

export default function DashboardLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar/>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
