import * as React from "react"
import {
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    permissions: string[][]; // Permissions as an array of arrays of strings
  };
}
export function AppSidebar({...props }: AppSidebarProps) {
// Utility to check permissions
function hasPermission(permissions: string[][], resource: string): boolean {
  return permissions.some((permission) => permission[0] === resource);
}

const navMain = [
    {
      title: "Admin",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "User Management",
          url: "/user-management",
          permission: "User", // Required resource
        },
        {
          title: "Categories",
          url: "/categories",
          permission: "Category", // Required resource
        },
      ],
    },
  ];
  const { permissions } = props.user
  const { account } = props.user

  const filteredNavMain = navMain
  .map((item) => ({
    ...item,
    items: item.items?.filter((subItem) =>
      hasPermission(permissions, subItem.permission)
    ),
  }))
  .filter((item) => item.items?.length > 0);
  console.log(account)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={account?.image_url} alt={account?.name} />
                  </Avatar>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{account?.name}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
