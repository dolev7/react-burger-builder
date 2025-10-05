import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Auth.css'

interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
}

function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const navigate = useNavigate()
  const { signUp, signIn, isAuthenticated, loading } = useAuth()
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<AuthFormData>()

  const password = watch('password')

  const onSubmit = async (data: AuthFormData) => {
    setAuthError(null)
    setSuccessMessage(null)
    
    try {
      let result
      
      if (isSignUp) {
        result = await signUp(data.email, data.password)
        if (result.user) {
          setSuccessMessage('Account created successfully! Welcome!')
          setTimeout(() => {
            navigate('/') // Redirect to home page
          }, 2000)
        }
      } else {
        result = await signIn(data.email, data.password)
        if (result.user) {
          setSuccessMessage('Signed in successfully! Welcome back!')
          setTimeout(() => {
            navigate('/') // Redirect to home page
          }, 1500)
        }
      }
      
      if (result.error) {
        setAuthError(result.error)
      }
      
    } catch (error) {
      console.error('Auth error:', error)
      setAuthError('An unexpected error occurred. Please try again.')
    }
  }

  const switchAuthModeHandler = () => {
    setIsSignUp(prev => !prev)
    setAuthError(null)
    setSuccessMessage(null)
    reset() // Clear form when switching modes
  }

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          <p>
            {isSignUp 
              ? 'Join us to start building your perfect burger!' 
              : 'Welcome back! Sign in to your account.'
            }
          </p>
        </div>

        {/* Auth Messages */}
        {authError && (
          <div className="auth-message error">
            <span>⚠️ {authError}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="auth-message success">
            <span>✅ {successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: isSignUp ? 'Please confirm your password' : false,
                  validate: value => 
                    !isSignUp || value === password || 'Passwords do not match'
                })}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading">
                <span className="spinner"></span>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>

          {/* Switch Mode */}
          <div className="auth-switch">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button" 
                className="switch-button"
                onClick={switchAuthModeHandler}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </form>

        {/* Demo Credentials (for testing) */}
        <div className="demo-info">
          <p><strong>Demo:</strong> test@example.com / password123</p>
        </div>
      </div>
    </div>
  )
}

export default Auth
