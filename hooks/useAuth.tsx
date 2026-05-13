'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/core/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TProfile } from '@/core/types/type';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUserProfile } from '@/core/hooks/useEmploye';

interface AuthContextType {
    user: User | null;
    profile: TProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: profile, isLoading: profileLoading } = useUserProfile(user?.id || null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) console.error('Erreur récupération session', error);

            if (session?.user) {
                setUser(session.user);
            }

            setLoading(false);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setUser(session.user);
            }
            if (event === 'SIGNED_OUT') {
                setUser(null);
                queryClient.invalidateQueries({ queryKey: ['profile'] });
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [queryClient]);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (data.session?.user) {
                setUser(data.session.user);
                queryClient.invalidateQueries({ queryKey: ['profile'] });
                return { success: true };
            }

            return { success: false, error: '' + error };
        } catch (error: any) {
            switch (error.status) {
                case 400:
                    return { success: false, error: 'Adresse email ou mot de passe incorrect 🚫' };
                case 403:
                    return { success: false, error: 'Veuillez confirmer votre adresse email 📩' };
                default:
                    return { success: false, error: 'Erreur inconnue ❗' };
            }
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        const signOutPromise = async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        };

        toast.promise(
            signOutPromise().then(() => {
                router.push('/');
            }),
            {
                loading: 'Déconnexion...',
                success: 'Déconnecté ✅',
                error: 'Erreur de déconnexion ❌',
            }
        );
    };

    return (
        <AuthContext.Provider
      value= {{
        user,
            profile,
            loading: loading || profileLoading,
                signIn,
                signOut,
      }
}
    >
    { children }
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
