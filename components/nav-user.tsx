"use client"

import {
  IconDotsVertical,
  IconLogout,
  IconExternalLink,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useLogout } from "@/components/auth/logout-provider"
import { ThemeSwitch } from "@/components/comp-182"

export function NavUser({
                          user,
                        }: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { openLogoutDialog } = useLogout()

  return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Admin</span>
                  <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Admin</span>
                    <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/*/!* Section pour le changement de thème *!/*/}
              {/*<div className="flex items-center justify-between px-2 py-1.5">*/}
              {/*  <span className="text-sm">Thème</span>*/}
              {/*  <ThemeSwitch />*/}
              {/*</div>*/}
              {/*<DropdownMenuSeparator />*/}

              <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    window.open(process.env.NEXT_PUBLIC_CLIENT_URL, '_blank')
                  }}
              >
                <IconExternalLink />
                Interface Client
              </DropdownMenuItem>
              <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    openLogoutDialog()
                  }}
              >
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
  )
}