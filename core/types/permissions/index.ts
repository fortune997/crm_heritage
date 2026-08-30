import { SidebarItem } from "@/core/utils/const/nav-item-sidebar";
import { LucideIcon } from "lucide-react";


export type TPermissions = {
    id: string;
    label: string;
    module: string;
    created_at: string;
    name: string;
};




export type SidebarConfig = {
    teams: {
        name: string;
        logo: LucideIcon;
        plan: string;
    }[];
    navMain: SidebarItem[];
};