"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarGroup,
} from "./ui/sidebar";
import { BellIcon, HomeIcon, NotebookPenIcon, UsersIcon } from "lucide-react";
import ToggleTheme from "./toggle-theme";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClerkUser from "./clerk-user";

const sidebarItems = [
  { name: "Home", icon: HomeIcon, href: "/" },
  { name: "Shared with me", icon: UsersIcon, href: "/shared" },
  { name: "Notifications", icon: BellIcon, href: "/notifications" },
];

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border/50">
      {/* Logo */}
      <SidebarHeader className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm glow-primary">
              <NotebookPenIcon size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Notezy</span>
          </div>
          <ToggleTheme />
        </div>
      </SidebarHeader>

      <Separator className="opacity-50" />

      {/* Nav */}
      <SidebarContent className="px-3 pt-4">
        <SidebarGroup>
          <SidebarMenu>
            <ul className="space-y-1">
              {sidebarItems.map(({ name, icon: Icon, href }) => {
                const isActive = pathname === href;
                return (
                  <li key={name}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm glow-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                    >
                      <Icon
                        size={17}
                        className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary-foreground" : ""}`}
                      />
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-3 pb-4 pt-2">
        <Separator className="mb-3 opacity-50" />
        <ClerkUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
