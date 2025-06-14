import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'
import useStore from '../../store/useStore'
import './AuthModal.css'

const AuthModal = () => {
  const { showAuthModal, authMode, closeAuthModal } = useStore()
  const { signUp, signIn, signInWithGoogle, loading, error } = useSupabaseAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setFormError('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFormError('Email and password are required')
      return false
    }

    if (authMode === 'signup') {
      if (!formData.fullName) {
        setFormError('Full name is required')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match')
        return false
      }
      if (formData.password.length < 6) {
        setFormError('Password must be at least 6 characters')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      let result
      if (authMode === 'signup') {
        result = await signUp(formData.email, formData.password, {
          fullName: formData.fullName
        })
        if (result.data && !result.error) {
          alert('Signup successful! Please check your email to verify your account.')
          closeAuthModal()
        }
      } else {
        result = await signIn(formData.email, formData.password)
        if (result.data && !result.error) {
          closeAuthModal()
        }
      }

      if (result.error) {
        setFormError(result.error.message)
      }
    } catch (err) {
      setFormError(err.message)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await signInWithGoogle()
      if (error) {
        setFormError(error.message)
      } else {
        closeAuthModal()
      }
    } catch (err) {
      setFormError(err.message)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          className="auth-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeAuthModal}
        >
          <motion.div
            className="auth-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal-header">
              <h2>{authMode === 'signup' ? 'Join the Hackathon' : 'Welcome Back'}</h2>
              <button 
                className="close-button"
                onClick={closeAuthModal}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="auth-modal-content">
              <form onSubmit={handleSubmit} className="auth-form">
                {authMode === 'signup' && (
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required={authMode === 'signup'}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required={authMode === 'signup'}
                      />
                    </div>
                  </div>
                )}

                {(formError || error) && (
                  <div className="error-message">
                    {formError || error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="auth-submit-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
                </button>
              </form>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <button 
                className="google-signin-button"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="auth-switch">
                {authMode === 'signup' ? (
                  <p>
                    Already have an account?{' '}
                    <button 
                      type="button"
                      className="switch-mode-button"
                      onClick={() => useStore.setState({ authMode: 'signin' })}
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      className="switch-mode-button"
                      onClick={() => useStore.setState({ authMode: 'signup' })}
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal