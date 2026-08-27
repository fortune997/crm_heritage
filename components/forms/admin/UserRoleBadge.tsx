'use client'


import { Badge } from "@/components/ui/badge";
import { UserRole, roleLabels } from "./CreateUserDialog";



type Props = {
    role: string;
};

export function UserRoleBadge({
    role,
}: Props) {
    return (
        <Badge
            variant="outline"
            className="font-normal"
        >
            {roleLabels[role]}
        </Badge>
    );
}