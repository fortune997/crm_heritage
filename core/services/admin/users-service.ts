
import { TPermission } from "@/core/hooks/admin/useRoles";
import { CreateRoleFormValues, CreateUserFormValues } from "@/core/lib/validations/admin/createUserSchema";
import { HeritageUser } from "@/core/types/profiles";
import { createClient } from "@/lib/config/supabase";

type Roles =
    { name: string }



export type UserScopes = {
    id: string,
    user_id: string,
    role_id: string,
    assigned_at: string,
    roles: Roles,
    profiles: HeritageUser,
    created_at: string
}

const supabase = createClient();

type TBrands = {
    id: string,
    name: string,
    slug: string
}

export async function getUsers(): Promise<HeritageUser[]> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getTopographeUsers(): Promise<HeritageUser[]> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq('department', 'topographie')
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getCommercialUsers(): Promise<HeritageUser[]> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq('department', 'marketing_commercial')
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getUsersScope(): Promise<UserScopes[]> {
    const { data, error } = await supabase
        .from("user_roles")
        .select("*, roles(name), profiles(*) ")
        .order("assigned_at", { ascending: false });


    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}

export const fetchUsersScopeById = async (id?: string) => {
    if (!id) return null;
    const { data, error } = await supabase
        .from("user_roles")
        .select("*, roles(id,name), profiles(*) ")
        .eq('user_id', id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function createUserCount(input: CreateUserFormValues) {
    try {
        const response = await fetch("/api/users/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API ERROR:", data);

            throw new Error(
                data.message || "Erreur lors de la création utilisateur"
            );
        }

        return data;

    } catch (error) {
        console.error("createUserCount error:", error);
        throw error;
    }
}


export const createRole = async (
    value: CreateRoleFormValues) => {
    const { data, error } = await supabase
        .from("roles")
        .insert(value)
        .select();

    if (error) throw new Error(error.message);

    return data;
};


export const fetchRole = async () => {
    const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("created_at", { ascending: false })


    if (error) throw new Error(error.message);
    return data;
};

export const fetchAllBrand = async (): Promise<TBrands[]> => {
    const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("created_at", { ascending: false })


    if (error) throw new Error(error.message);
    return data;
};


export const fetchAllPermissions = async (): Promise<TPermission[]> => {
    const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("module");

    if (error) throw new Error(error.message);
    return data;
};

export const getRoleById = async (
    roleId: string) => {
    const { data, error } = await supabase
        .from("roles")
        .select("*")
        .eq("id", roleId)
        .single();

    if (error) throw new Error(error.message);

    return data;
};

export const getRolePermissionById = async (
    roleId: string) => {
    const { data, error } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", roleId);


    if (error) throw new Error(error.message);

    return data;
};


type CreateRolePermissionPayload = {
    role_id: string;
    permission_id: string;
};


export const createRolePermission = async (
    values: CreateRolePermissionPayload[]
) => {

    const { data, error } = await supabase
        .from("role_permissions")
        .insert(values)
        .select();


    if (error) {
        throw new Error(error.message);
    }


    return data;
};

type UpdateRolePermissionsPayload = {
    roleId: string;
    permissions: string[];
};


export const updateRolePermissions = async (
    payload: UpdateRolePermissionsPayload
) => {


    const {
        roleId,
        permissions
    } = payload;



    // 1. supprimer les anciennes permissions

    const { error: deleteError } = await supabase
        .from("role_permissions")
        .delete()
        .eq(
            "role_id",
            roleId
        );


    if (deleteError)
        throw deleteError;



    // 2. préparer les nouvelles

    const rows = permissions.map(
        permissionId => ({

            role_id: roleId,
            permission_id: permissionId

        })
    );



    if (rows.length === 0)
        return [];



    // 3. insertion

    const { data, error } = await supabase
        .from("role_permissions")
        .insert(rows)
        .select();



    if (error)
        throw error;



    return data;

};