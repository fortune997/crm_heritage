"use client";

import {
    Search,
    RotateCcw,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserDepartment, UserRole, UserStatus, departmentLabels, roleLabels, statusLabels } from "./CreateUserDialog";



type Props = {
    search: string;
    setSearch: (value: string) => void;

    role: UserRole | "all";
    setRole: (
        value: UserRole | "all"
    ) => void;

    department:
    | UserDepartment
    | "all";

    setDepartment: (
        value:
            | UserDepartment
            | "all"
    ) => void;

    status: UserStatus | "all";

    setStatus: (
        value: UserStatus | "all"
    ) => void;

    onReset: () => void;
};

export function UserFilters({
    search,
    setSearch,
    role,
    setRole,
    department,
    setDepartment,
    status,
    setStatus,
    onReset,
}: Props) {
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px_160px_auto]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Rechercher par nom ou email..."
                        className="pl-9"
                    />
                </div>

                <select
                    value={role}
                    onChange={(e) =>
                        setRole(
                            e.target
                                .value as
                            | UserRole
                            | "all"
                        )
                    }
                    className="h-10 rounded-md border bg-white px-3 text-sm"
                >
                    <option value="all">
                        Tous les rôles
                    </option>

                    {Object.entries(
                        roleLabels
                    ).map(
                        ([
                            value,
                            label,
                        ]) => (
                            <option
                                key={value}
                                value={
                                    value
                                }
                            >
                                {label}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={department}
                    onChange={(e) =>
                        setDepartment(
                            e.target
                                .value as
                            | UserDepartment
                            | "all"
                        )
                    }
                    className="h-10 rounded-md border bg-white px-3 text-sm"
                >
                    <option value="all">
                        Tous les départements
                    </option>

                    {Object.entries(
                        departmentLabels
                    ).map(
                        ([
                            value,
                            label,
                        ]) => (
                            <option
                                key={value}
                                value={
                                    value
                                }
                            >
                                {label}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target
                                .value as
                            | UserStatus
                            | "all"
                        )
                    }
                    className="h-10 rounded-md border bg-white px-3 text-sm"
                >
                    <option value="all">
                        Tous les statuts
                    </option>

                    {Object.entries(
                        statusLabels
                    ).map(
                        ([
                            value,
                            label,
                        ]) => (
                            <option
                                key={value}
                                value={
                                    value
                                }
                            >
                                {label}
                            </option>
                        )
                    )}
                </select>

                <Button
                    variant="outline"
                    onClick={onReset}
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Réinitialiser
                </Button>
            </div>
        </div>
    );
}