"use client";

import {
    useMemo,
    useState,
} from "react";

import { CreateUserDialog, HeritageUser, UserDepartment, UserRole, UserStatus } from "@/components/forms/admin/CreateUserDialog";
import { UserStats } from "@/components/forms/admin/UserStats";
import { UserFilters } from "@/components/forms/admin/UserFilters";
import { UsersTable } from "@/components/forms/admin/Admin1";
import { useUsers, useUsersScope } from "@/core/hooks/admin/useUsers";
import { DataTable } from "@/components/forms/table/DataTable";
import { activityColumns } from "@/components/shared/columns/ActivitiesColumn";
import { userAccountColumns } from "@/components/shared/columns/userAccountColumns";
import { ActivitiesPageSkeleton } from "@/components/skeleton/ActivitiesPageSkeleton";



export default function UsersPage() {


    //const { data: allUsersAccount = [], isLoading } = useUsers()
    const { data: allUsers = [], isLoading } = useUsersScope()

    const [search, setSearch] = useState("");

    const [role, setRole] =
        useState<UserRole | "all">("all");

    const [department, setDepartment] =
        useState<UserDepartment | "all">("all");

    const [status, setStatus] =
        useState<UserStatus | "all">("all");

    /*  const filteredUsers = useMemo(() => {
         const query = search.trim().toLowerCase();
 
         return allUsers
             .map((item) => {
                 const profile = item?.profiles;
 
                 if (!profile) {
                     return null;
                 }
 
                 return {
                     id: profile.id,
                     fullName: profile.full_name ?? "",
                     email: profile.email ?? "",
                     department: profile.department ?? "",
                     status: profile.status ?? "",
                     role: item.roles?.name ?? "",
                 };
             })
             .filter((user) => {
                 if (!user) return false;
 
                 const matchesSearch =
                     !query ||
                     user.fullName
                         .toLowerCase()
                         .includes(query) ||
                     user.email
                         .toLowerCase()
                         .includes(query);
 
                 const matchesRole =
                     role === "all" ||
                     user.role === role;
 
                 const matchesDepartment =
                     department === "all" ||
                     user.department === department;
 
                 const matchesStatus =
                     status === "all" ||
                     user.status === status;
 
                 return (
                     matchesSearch &&
                     matchesRole &&
                     matchesDepartment &&
                     matchesStatus
                 );
             });
     }, [
         allUsers,
         search,
         role,
         department,
         status,
     ]); */

    function resetFilters() {
        setSearch("");
        setRole("all");
        setDepartment("all");
        setStatus("all");
    }

    /*     function handleView(
            user: HeritageUser
        ) {
            console.log(
                "Voir utilisateur",
                user
            );
        }
    
        function handleEdit(
            user: HeritageUser
        ) {
            console.log(
                "Modifier utilisateur",
                user
            );
        }
     */
    if (isLoading) {
        return <ActivitiesPageSkeleton />;
    }

    return (
        <main className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Gestion des utilisateurs
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Gérez les comptes, rôles et accès des collaborateurs Héritage.
                    </p>
                </div>

                <CreateUserDialog />
            </div>

            <UserStats
                users={allUsers ?? []}
            />

            {/*   <UserFilters
                search={search}
                setSearch={
                    setSearch
                }
                role={role}
                setRole={setRole}
                department={
                    department
                }
                setDepartment={
                    setDepartment
                }
                status={status}
                setStatus={
                    setStatus
                }
                onReset={
                    resetFilters
                }
            /> */}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Utilisateurs
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        {allUsers.length} utilisateur(s)
                    </p>
                </div>

            </div>

            {/*  <UsersTable
                users={
                    filteredUsers
                }
                onView={
                    handleView
                }
                onEdit={
                    handleEdit
                }
            /> */}

            <DataTable
                columns={userAccountColumns ?? []}
                data={allUsers ?? []}   // ← fallback vers un tableau vide
                searchKey="full_name"
                searchPlaceholder="Rechercher un client ou un prospect..."
            />
        </main>
    );
}