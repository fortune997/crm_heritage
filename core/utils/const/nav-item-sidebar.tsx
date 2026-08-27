import { usePermissions } from "@/core/hooks/usePermissions";
import { sidebarConfig } from "@/core/lib/config/SidebarConfig";
import { TPermissions } from "@/core/types/permissions";



import type { LucideIcon } from "lucide-react";

export type SidebarSubItem = {
  title: string;
  url: string;
  requiredPermissions?: TPermissions[];
};

export type SidebarItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  requiredPermissions?: TPermissions[];
  items?: SidebarSubItem[];
};

export type SidebarConfig = {
  teams: {
    name: string;
    logo: LucideIcon;
    plan: string;
  }[];
  navMain: SidebarItem[];
};

export function useSidebarData() {
  const { canAny, isSuperAdmin } = usePermissions();



  const navMain = sidebarConfig.navMain
    .map((item) => {
      const items = item.items?.filter((subItem) => {
        if (!subItem.requiredPermissions?.length) return true;
        return canAny(subItem.requiredPermissions);
      });

      return {
        ...item,
        items,
      };
    })
    .filter((item) => {
      if (isSuperAdmin) return true;

      const parentVisible =
        !item.requiredPermissions?.length ||
        canAny(item.requiredPermissions);

      const childVisible = item.items && item.items.length > 0;

      return parentVisible || childVisible;
    });

  return {
    teams: sidebarConfig.teams,
    navMain,
  };
}