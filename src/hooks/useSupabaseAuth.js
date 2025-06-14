import { useState, useEffect } from 'react'
import { supabase, authHelpers, dbHelpers } from '../lib/supabaseClient'

export const useSupabaseAuth = () => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await authHelpers.getSession()
        if (error) throw error

        setSession(session)
        setUser(session?.user ?? null)

        // Update last accessed time if user exists
        if (session?.user) {
          await dbHelpers.updateLastAccessed(session.user.id)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setError(null)

        if (event === 'SIGNED_IN' && session?.user) {
          // Create or update user record in database
          try {
            await dbHelpers.createUserRecord(session.user)
          } catch (err) {
            console.error('Error creating user record:', err)
            setError(err.message)
          }
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await authHelpers.signUp(email, password, userData)
      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await authHelpers.signIn(email, password)
      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await authHelpers.signInWithGoogle()
      if (error) throw error
      
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await authHelpers.signOut()
      if (error) throw error
      
      return { error: null }
    } catch (err) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  }
}