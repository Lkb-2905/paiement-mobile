import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextValue = {
  isAuthed: boolean;
  phone?: string;
  session: Session | null;
  isLoading: boolean;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ensureProfile = async (session: Session) => {
  const { user } = session;
  if (!user) return;
  await supabase.from('profiles').upsert(
    {
      id: user.id,
      phone_number: user.phone ?? null,
      full_name: user.user_metadata?.full_name ?? null,
      role: 'fan',
    },
    { onConflict: 'id' }
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession) {
          await ensureProfile(nextSession);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthed: Boolean(session?.user),
      phone: session?.user?.phone ?? undefined,
      session,
      isLoading,
      signInWithPhone: async (phone) => {
        await supabase.auth.signInWithOtp({ phone });
      },
      verifyOtp: async (phone, otp) => {
        const { data, error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms',
        });
        if (error) throw error;
        if (data.session) {
          await ensureProfile(data.session);
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
