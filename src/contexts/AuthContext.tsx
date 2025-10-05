import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import AuthService, { type AuthUser } from '../services/authService'

interface AuthContextType {
  currentUser: AuthUser | null
  token: string | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: string | null }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
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
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to store token securely (DRY principle)
  const storeAuthToken = async (firebaseUser: any): Promise<void> => {
    try {
      const idToken = await firebaseUser.getIdToken()
      setToken(idToken)
      localStorage.setItem('authToken', idToken)
      console.log('🔐 Token stored successfully')
    } catch (error) {
      console.error('❌ Error storing token:', error)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string) => {
    const result = await AuthService.signUp(email, password)
    if (result.user) {
      setCurrentUser(result.user)
      // Get and store the auth token using helper function
      const user = AuthService.getCurrentUser()
      if (user) {
        await storeAuthToken(user)
      }
    }
    return result
  }

  // Sign in function
  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn(email, password)
    if (result.user) {
      setCurrentUser(result.user)
      // Get and store the auth token using helper function
      const user = AuthService.getCurrentUser()
      if (user) {
        await storeAuthToken(user)
      }
    }
    return result
  }

  // Sign out function
  const signOut = async () => {
    await AuthService.signOutUser()
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // User is signed in, get token using helper function
        const firebaseUser = AuthService.getCurrentUser()
        if (firebaseUser) {
          await storeAuthToken(firebaseUser)
        }
      } else {
        // User is signed out
        setToken(null)
        localStorage.removeItem('authToken')
      }
      
      setLoading(false)
    })

    // Check for stored token on app start
    const storedToken = localStorage.getItem('authToken')
    if (storedToken && !currentUser) {
      setToken(storedToken)
    }

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    token,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!currentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
