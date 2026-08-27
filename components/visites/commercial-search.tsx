"use client";

import { useEffect, useState } from "react";
import {
    Check,
    ChevronsUpDown,
    Search,
    UserRound,
    X,
} from "lucide-react";

import supabase from "@/core/lib/supabase";

export interface Commercial {
    id: string;
    full_name: string;
    email?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
}

interface Props {
    value?: string;
    onChange: (value: string) => void;
    error?: string;
}

export function CommercialSearch({
    value,
    onChange,
    error,
}: Props) {
    const [open, setOpen] = useState(false);

    const [search, setSearch] =
        useState("");

    const [users, setUsers] = useState<
        Commercial[]
    >([]);

    const [selected, setSelected] =
        useState<Commercial | null>(null);

    const [loading, setLoading] =
        useState(false);

    /*
     * Charger l'utilisateur sélectionné
     */
    useEffect(() => {
        if (!value) {
            setSelected(null);
            return;
        }

        async function loadSelectedUser() {
            const { data } = await supabase
                .from("profiles")
                .select(
                    "id, full_name, email, phone, avatar_url"
                )
                .eq("id", value)
                .maybeSingle();

            if (data) {
                setSelected(data);
            }
        }

        loadSelectedUser();
    }, [value]);

    /*
     * Recherche
     */
    useEffect(() => {
        if (!open) return;

        const timer = setTimeout(async () => {
            setLoading(true);

            let query = supabase
                .from("profiles")
                .select(
                    "id, full_name, email, phone, avatar_url"
                )
                .order("full_name")
                .limit(20);

            if (search.trim()) {
                query = query.or(
                    `full_name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%`
                );
            }

            const { data } = await query;

            setUsers(data || []);

            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [search, open]);

    function selectUser(user: Commercial) {
        setSelected(user);
        onChange(user.id);
        setOpen(false);
        setSearch("");
    }

    function clear() {
        setSelected(null);
        onChange("");
    }

    return (
        <div className="relative">
            <label className="mb-1.5 block text-sm font-medium">
                Commercial responsable
                <span className="ml-1 text-red-500">
                    *
                </span>
            </label>

            {/* Valeur sélectionnée */}
            {selected ? (
                <div className="flex h-11 items-center justify-between rounded-lg border bg-background px-3">
                    <div className="flex min-w-0 items-center gap-3">
                        {selected.avatar_url ? (
                            <img
                                src={selected.avatar_url}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserRound className="h-4 w-4" />
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {selected.full_name}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                {selected.email ||
                                    selected.phone ||
                                    ""}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={clear}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex h-11 w-full items-center justify-between rounded-lg border bg-background px-3 text-left text-sm hover:bg-muted/30"
                    >
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <UserRound className="h-4 w-4" />
                            Sélectionner un commercial
                        </span>

                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {open && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border bg-popover shadow-xl">
                            <div className="border-b p-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <input
                                        autoFocus
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Nom, téléphone ou email..."
                                        className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="max-h-60 overflow-y-auto p-1">
                                {loading ? (
                                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                                        Recherche...
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                                        Aucun utilisateur trouvé.
                                    </div>
                                ) : (
                                    users.map((user) => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() =>
                                                selectUser(user)
                                            }
                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
                                        >
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt=""
                                                    className="h-9 w-9 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <UserRound className="h-4 w-4" />
                                                </div>
                                            )}

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {user.full_name}
                                                </p>

                                                <p className="truncate text-xs text-muted-foreground">
                                                    {user.phone ||
                                                        user.email ||
                                                        "—"}
                                                </p>
                                            </div>

                                            {value === user.id && (
                                                <Check className="h-4 w-4 text-primary" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}