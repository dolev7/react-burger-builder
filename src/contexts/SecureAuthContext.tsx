import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import AuthService, { type AuthUser } from '../services/authService'
import SecureStorage from '../utils/secureStorage'

interface SecureAuthContextType {
  currentUser: AuthUser | null
  token: string | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
  tokenExpiresIn: number | null
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined)

export function useSecureAuth() {
  const context = useContext(SecureAuthContext)
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider')
  }
  return context
}

interface SecureAuthProviderProps {
  children: ReactNode
}

export function SecureAuthProvider({ children }: SecureAuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tokenExpiresIn, setTokenExpiresIn] = useState<number | null>(null)

  // Secure token storage
  const storeTokenSecurely = async (firebaseUser: any) => {
    try {
      const idToken = await firebaseUser.getIdToken()
      const tokenResult = await firebaseUser.getIdTokenResult()
      
      // Calculate expiration time (Firebase tokens expire in 1 hour)
      const expirationTime = new Date(tokenResult.expirationTime).getTime()
      const now = new Date().getTime()
      const expiresInMinutes = Math.floor((expirationTime - now) / (1000 * 60))
      
      SecureStorage.setToken(idToken, expiresInMinutes)
      setToken(idToken)
      setTokenExpiresIn(expiresInMinutes)
      
      console.log(`🔐 Token stored securely, expires in ${expiresInMinutes} minutes`)
    } catch (error) {
      console.error('Error storing token:', error)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string) => {
    const result = await AuthService.signUp(email, password)
    if (result.user) {
      setCurrentUser(result.user)
      const user = AuthService.getCurrentUser()
      if (user) {
        await storeTokenSecurely(user)
      }
    }
    return result
  }

  // Sign in function
  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn(email, password)
    if (result.user) {
      setCurrentUser(result.user)
      const user = AuthService.getCurrentUser()
      if (user) {
        await storeTokenSecurely(user)
      }
    }
    return result
  }

  // Sign out function
  const signOut = async () => {
    await AuthService.signOutUser()
    setCurrentUser(null)
    setToken(null)
    setTokenExpiresIn(null)
    SecureStorage.clearToken()
  }

  // Token refresh logic
  useEffect(() => {
    const refreshToken = async () => {
      const user = AuthService.getCurrentUser()
      if (user && currentUser) {
        try {
          // Force token refresh
          const newToken = await user.getIdToken(true)
          const tokenResult = await user.getIdTokenResult()
          
          const expirationTime = new Date(tokenResult.expirationTime).getTime()
          const now = new Date().getTime()
          const expiresInMinutes = Math.floor((expirationTime - now) / (1000 * 60))
          
          SecureStorage.setToken(newToken, expiresInMinutes)
          setToken(newToken)
          setTokenExpiresIn(expiresInMinutes)
          
          console.log('🔄 Token refreshed successfully')
        } catch (error) {
          console.error('Token refresh failed:', error)
          await signOut()
        }
      }
    }

    // Refresh token every 50 minutes (before 1-hour expiration)
    const refreshInterval = setInterval(refreshToken, 50 * 60 * 1000)
    
    return () => clearInterval(refreshInterval)
  }, [currentUser])

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Check for existing valid token first
        const existingToken = SecureStorage.getToken()
        if (existingToken) {
          setToken(existingToken)
          setTokenExpiresIn(SecureStorage.getTimeUntilExpiry())
        } else {
          // Get new token
          const firebaseUser = AuthService.getCurrentUser()
          if (firebaseUser) {
            await storeTokenSecurely(firebaseUser)
          }
        }
      } else {
        // User is signed out
        setToken(null)
        setTokenExpiresIn(null)
        SecureStorage.clearToken()
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: SecureAuthContextType = {
    currentUser,
    token,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!currentUser && !!token,
    tokenExpiresIn
  }

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  )
}

export default SecureAuthContext
