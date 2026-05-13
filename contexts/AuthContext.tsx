'use client';

import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import supabase from '@/core/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { TPermissionName, TProfile, TRoleName } from '@/core/types/type';

interface AuthContextType {
    user: User | null;
    profile: TProfile | null;
    role: TRoleName | null;
    permissions: TPermissionName[];
    access_scope: 'global' | 'company' | null;
    company_id: string | null;
    loading: boolean;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type PermissionRow = {
    id: string;
    name: TPermissionName;
    module?: string | null;
};

type RolePermissionRow = {
    permissions: PermissionRow | PermissionRow[] | null;
};

type RoleRow = {
    id: string;
    name: TRoleName;
    role_permissions: RolePermissionRow[] | null;
};

type CompanyMemberRow = {
    id: string;
    company_id: string | null;
    access_scope: 'global' | 'company' | null;
    status: string;
    roles: RoleRow | RoleRow[] | null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<TProfile | null>(null);
    const [role, setRole] = useState<TRoleName | null>(null);
    const [permissions, setPermissions] = useState<TPermissionName[]>([]);
    const [accessScope, setAccessScope] = useState<'global' | 'company' | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const queryClient = useQueryClient();

    const resetAuthState = useCallback(() => {
        setUser(null);
        setProfile(null);
        setRole(null);
        setPermissions([]);
        setAccessScope(null);
        setCompanyId(null);
    }, []);

    const loadUserProfile = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (error) {
            console.error('Erreur récupération profile:', error);
            setProfile(null);
            return null;
        }

        setProfile(data as TProfile | null);
        return data as TProfile | null;
    }, []);

    const loadUserAccess = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('company_members')
            .select(`
        id,
        company_id,
        access_scope,
        status,
        roles (
          id,
          name,
          role_permissions (
            permissions (
              id,
              name,
              module
            )
          )
        )
      `)
            .eq('profile_id', userId)
            .eq('status', 'active')
            .maybeSingle();

        if (error) {
            console.error('Erreur récupération accès utilisateur:', error);

            setRole(null);
            setPermissions([]);
            setAccessScope(null);
            setCompanyId(null);

            return;
        }

        if (!data) {
            setRole(null);
            setPermissions([]);
            setAccessScope(null);
            setCompanyId(null);

            return;
        }

        const member = data as unknown as CompanyMemberRow;

        const currentRole = Array.isArray(member.roles)
            ? member.roles[0]
            : member.roles;

        const roleName = currentRole?.name ?? null;

        const permissionNames =
            currentRole?.role_permissions
                ?.flatMap((rolePermission) => {
                    const permission = rolePermission.permissions;

                    if (!permission) return [];

                    if (Array.isArray(permission)) {
                        return permission.map((item) => item.name);
                    }

                    return [permission.name];
                })
                .filter(Boolean) ?? [];

        setRole(roleName);
        setPermissions(permissionNames as TPermissionName[]);
        setAccessScope(member.access_scope);
        setCompanyId(member.company_id);
    }, []);

    const loadSession = useCallback(
        async (session: Session | null) => {
            try {
                setLoading(true);

                if (!session?.user) {
                    resetAuthState();
                    return;
                }

                const currentUser = session.user;

                setUser(currentUser);

                await Promise.all([
                    loadUserProfile(currentUser.id),
                    loadUserAccess(currentUser.id),
                ]);
            } catch (error) {
                console.error('Erreur chargement session:', error);
                resetAuthState();
            } finally {
                setLoading(false);
            }
        },
        [loadUserAccess, loadUserProfile, resetAuthState]
    );

    useEffect(() => {
        const initAuth = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) {
                console.error('Erreur récupération session:', error);
                resetAuthState();
                setLoading(false);
                return;
            }

            await loadSession(session);
        };

        initAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            void loadSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [loadSession, resetAuthState]);

    const signIn = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.status === 400) {
                    return {
                        success: false,
                        error: 'Adresse email ou mot de passe incorrect 🚫',
                    };
                }

                if (error.status === 403) {
                    return {
                        success: false,
                        error: 'Veuillez confirmer votre adresse email 📩',
                    };
                }

                return {
                    success: false,
                    error: error.message || 'Erreur de connexion ❌',
                };
            }

            if (!data.session?.user) {
                return {
                    success: false,
                    error: 'Aucune session utilisateur trouvée ❌',
                };
            }

            await loadSession(data.session);

            queryClient.invalidateQueries({ queryKey: ['profile'] });

            return { success: true };
        } catch (error) {
            console.error('Erreur inconnue connexion:', error);

            return {
                success: false,
                error: 'Erreur inconnue ❗',
            };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        const signOutPromise = async () => {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            resetAuthState();

            queryClient.clear();

            router.push('/');
        };

        toast.promise(signOutPromise(), {
            loading: 'Déconnexion...',
            success: 'Déconnecté ✅',
            error: 'Erreur de déconnexion ❌',
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                role,
                permissions,
                access_scope: accessScope,
                company_id: companyId,
                loading,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
    }

    return context;
};