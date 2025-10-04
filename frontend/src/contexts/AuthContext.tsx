import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, data?: { firstName?: string; lastName?: string }) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    console.log('AuthProvider: Initializing authentication...');
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session:', session?.user?.email || 'No user');
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, session?.user?.email || 'No user');
        
        // Clear all cached data when user changes or signs out
        if (event === 'SIGNED_OUT' || (event === 'SIGNED_IN' && user && session?.user?.id !== user.id)) {
          console.log('AuthProvider: Clearing cached data due to user change');
          queryClient.clear();
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, data?: { firstName?: string; lastName?: string }) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // If successful and we have user data, register with our backend
    if (authData.user && data) {
      try {
        // Use the same API base URL configuration as in api.ts
        const backendUrl = import.meta.env.PROD 
          ? '/api'  // Relative path when deployed
          : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api');  // Absolute path for development
        const response = await fetch(`${backendUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            firstName: data.firstName,
            lastName: data.lastName,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Registration failed')
        }
      } catch (backendError) {
        console.error('Backend registration error:', backendError)
        // Continue even if backend registration fails, as Supabase user was created
      }
    }

    return authData
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}