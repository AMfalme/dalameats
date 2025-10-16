"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  // IconListDetails,
  // IconBox,
  IconReport,
  // IconSearch,
  IconMeat,
  IconUsers,
  // IconPackage,
  IconSettings,
  IconBox,
  // IconUsers,
} from "@tabler/icons-react";
import { getUserDocumentByUID } from "@/lib/utils";
// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";

const data = {
  navMain: {
    adminNav: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Users",
        url: "/dashboard/admin/users",
        icon: IconUsers,
      },

      {
        title: "Product Categories",
        url: "/dashboard/admin/product-categories",
        icon: IconBox,
      },

      {
        title: "Meat Products",
        url: "/dashboard/admin/products",
        icon: IconMeat,
      },
      {
        title: "User Orders",
        url: "/dashboard/admin/user-requests",
        icon: IconChartBar,
      },
      // {
      //   title: "Orders Overview",
      //   url: "/dashboard/admin/orders-overview",
      //   icon: IconReport,
      // },
      // {
      //   title: "Sales",
      //   url: "/dashboard/admin/user-orders",
      //   icon: IconReport,
      // },
    ],
    customNav: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: IconFolder,
      },
      {
        title: "My orders",
        url: "/dashboard/my-orders",
        icon: IconReport,
      },
    ],
  },
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/profile",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        const userDoc = await getUserDocumentByUID(user.uid);
        setIsAdmin(userDoc?.role === "admin");
      }
    };
    fetchUserRole();
  }, [user]);
  return (
    <Sidebar className="py-10" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold text-primary">
                  Dala Meats
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isAdmin ? (
          <NavMain items={data.navMain.adminNav} />
        ) : (
          <NavMain items={data.navMain.customNav} />
        )}

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
