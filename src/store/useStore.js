import { create } from 'zustand'
import { dbHelpers, realtimeHelpers } from '../lib/supabaseClient'

const useStore = create((set, get) => ({
  // Auth state
  user: null,
  session: null,
  isAuthenticated: false,
  
  // Projects state
  projects: [],
  selectedProjects: [],
  userProjects: [],
  
  // UI state
  showAuthModal: false,
  authMode: 'signin', // 'signin' | 'signup'
  loading: {
    projects: false,
    userProjects: false,
    projectSelection: false
  },
  
  // Real-time subscriptions
  subscriptions: [],

  // Auth actions
  setAuth: (user, session) => set({
    user,
    session,
    isAuthenticated: !!user
  }),

  // Modal actions
  openAuthModal: (mode = 'signin') => set({
    showAuthModal: true,
    authMode: mode
  }),

  closeAuthModal: () => set({
    showAuthModal: false
  }),

  // Project actions
  setProjects: (projects) => set({ projects }),

  setSelectedProjects: (projectIds) => set({
    selectedProjects: projectIds
  }),

  setUserProjects: (userProjects) => set({ userProjects }),

  // Loading actions
  setLoading: (key, value) => set((state) => ({
    loading: {
      ...state.loading,
      [key]: value
    }
  })),

  // Fetch projects from Supabase
  fetchProjects: async () => {
    const { setLoading } = get()
    
    try {
      setLoading('projects', true)
      const { data, error } = await dbHelpers.getProjects()
      
      if (error) throw error
      
      set({ projects: data || [] })
      return { data, error: null }
    } catch (err) {
      console.error('Error fetching projects:', err)
      return { data: null, error: err }
    } finally {
      setLoading('projects', false)
    }
  },

  // Fetch user's selected projects
  fetchUserProjects: async (userId) => {
    const { setLoading } = get()
    
    try {
      setLoading('userProjects', true)
      const { data, error } = await dbHelpers.getUserProjects(userId)
      
      if (error) throw error
      
      set({ userProjects: data || [] })
      return { data, error: null }
    } catch (err) {
      console.error('Error fetching user projects:', err)
      return { data: null, error: err }
    } finally {
      setLoading('userProjects', false)
    }
  },

  // Select projects for user
  selectProjectsForUser: async (userId, projectIds) => {
    const { setLoading } = get()
    
    try {
      setLoading('projectSelection', true)
      const { data, error } = await dbHelpers.selectProjects(userId, projectIds)
      
      if (error) throw error
      
      // Update local state
      set({
        selectedProjects: projectIds,
        userProjects: data || []
      })

      // Trigger email confirmation
      await get().sendConfirmationEmail(userId, data)
      
      return { data, error: null }
    } catch (err) {
      console.error('Error selecting projects:', err)
      return { data: null, error: err }
    } finally {
      setLoading('projectSelection', false)
    }
  },

  // Send confirmation email (placeholder for Edge Function)
  sendConfirmationEmail: async (userId, selectedProjects) => {
    try {
      // This will be implemented with Supabase Edge Functions
      console.log('Sending confirmation email for user:', userId, selectedProjects)
      
      // For now, we'll just log the email data
      const emailData = {
        userId,
        projects: selectedProjects,
        timestamp: new Date().toISOString()
      }
      
      console.log('Email data:', emailData)
      
      return { success: true }
    } catch (err) {
      console.error('Error sending confirmation email:', err)
      return { success: false, error: err }
    }
  },

  // Set up real-time subscriptions
  setupRealtimeSubscriptions: (userId) => {
    const { subscriptions } = get()
    
    // Subscribe to projects changes
    const projectsSubscription = realtimeHelpers.subscribeToProjects((payload) => {
      console.log('Projects updated:', payload)
      get().fetchProjects()
    })

    // Subscribe to user's project selections
    const userProjectsSubscription = realtimeHelpers.subscribeToUserProjects(
      userId,
      (payload) => {
        console.log('User projects updated:', payload)
        get().fetchUserProjects(userId)
      }
    )

    set({
      subscriptions: [
        ...subscriptions,
        projectsSubscription,
        userProjectsSubscription
      ]
    })
  },

  // Clean up subscriptions
  cleanupSubscriptions: () => {
    const { subscriptions } = get()
    
    subscriptions.forEach(subscription => {
      realtimeHelpers.unsubscribe(subscription)
    })
    
    set({ subscriptions: [] })
  },

  // Reset store on logout
  reset: () => set({
    user: null,
    session: null,
    isAuthenticated: false,
    projects: [],
    selectedProjects: [],
    userProjects: [],
    showAuthModal: false,
    authMode: 'signin',
    loading: {
      projects: false,
      userProjects: false,
      projectSelection: false
    }
  })
}))

export default useStore