import { usePermissions } from "@/core/hooks/usePermissions";
import { sidebarConfig } from "@/core/lib/config/SidebarConfig";


import type { TPermissionName } from "@/core/types/type";
import type { LucideIcon } from "lucide-react";

export type SidebarSubItem = {
  title: string;
  url: string;
  requiredPermissions?: TPermissionName[];
};

export type SidebarItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  requiredPermissions?: TPermissionName[];
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
    .filter((item) => {
      if (isSuperAdmin) return true;

      if (!item.requiredPermissions?.length) return true;

      return canAny(item.requiredPermissions);
    })
    .map((item) => {
      const filteredItems = item.items?.filter((subItem) => {
        if (isSuperAdmin) return true;

        if (!subItem.requiredPermissions?.length) return true;

        return canAny(subItem.requiredPermissions);
      });

      return {
        ...item,
        items: filteredItems,
      };
    })
    .filter((item) => {
      /**
       * Si le menu n'a pas de sous-menu, on le garde.
       * Exemple: Dashboard
       */
      if (!item.items) return true;

      /**
       * Si le menu a des sous-menus, on garde seulement
       * ceux qui ont au moins un sous-menu visible.
       */
      return item.items.length > 0;
    });

  return {
    teams: sidebarConfig.teams,
    navMain,
  };
}