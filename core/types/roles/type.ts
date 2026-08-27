import { TPermission, TPermissions } from "../permissions"


export type RolePermission = {
    id: string,
    role_id: string,
    permission_id: string,
    permissions: TPermission
}