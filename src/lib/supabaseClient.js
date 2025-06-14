import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper functions for common operations
export const authHelpers = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    const userAgent = navigator.userAgent || 'Unknown'
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName || '',
          user_agent: userAgent,
          signup_timestamp: new Date().toISOString(),
          ...userData
        }
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign in with Google OAuth
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}

// Database helpers
export const dbHelpers = {
  // Insert user data after successful auth
  async createUserRecord(user) {
    const userData = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      auth_provider: user.app_metadata?.provider || 'email',
      signup_timestamp: user.created_at,
      user_agent: user.user_metadata?.user_agent || '',
      last_accessed: new Date().toISOString(),
      received_confirmation: false
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()

    return { data, error }
  },

  // Get all projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Select projects for user
  async selectProjects(userId, projectIds) {
    // First, remove existing selections
    await supabase
      .from('user_projects')
      .delete()
      .eq('user_id', userId)

    // Then insert new selections
    const userProjects = projectIds.map(projectId => ({
      user_id: userId,
      project_id: projectId,
      selected_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('user_projects')
      .insert(userProjects)
      .select(`
        *,
        projects (
          id,
          title,
          description,
          tags
        )
      `)

    return { data, error }
  },

  // Get user's selected projects
  async getUserProjects(userId) {
    const { data, error } = await supabase
      .from('user_projects')
      .select(`
        *,
        projects (
          id,
          title,
          description,
          tags,
          status,
          difficulty
        )
      `)
      .eq('user_id', userId)

    return { data, error }
  },

  // Update user's last accessed time
  async updateLastAccessed(userId) {
    const { data, error } = await supabase
      .from('users')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', userId)

    return { data, error }
  }
}

// Real-time subscriptions
export const realtimeHelpers = {
  // Subscribe to projects changes
  subscribeToProjects(callback) {
    return supabase
      .channel('projects-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, callback)
      .subscribe()
  },

  // Subscribe to user's project selections
  subscribeToUserProjects(userId, callback) {
    return supabase
      .channel(`user-projects-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_projects',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription)
  }
}