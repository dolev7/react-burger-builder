import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import type { User, AuthError } from 'firebase/auth'
import { auth } from '../config/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}

export interface AuthResult {
  user: AuthUser | null
  error: string | null
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('🔥 Attempting sign up with:', { email, authDomain: auth.app.options.authDomain })
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      console.log('✅ Sign up successful:', user.uid)
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        },
        error: null
      }
    } catch (error) {
      console.error('❌ Sign up error:', error)
      console.error('Auth instance:', auth)
      console.error('Firebase config:', auth.app.options)
      return {
        user: null,
        error: this.getErrorMessage(error as AuthError)
      }
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        },
        error: null
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return {
        user: null,
        error: this.getErrorMessage(error as AuthError)
      }
    }
  }

  // Sign out
  static async signOutUser(): Promise<{ error: string | null }> {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: 'Failed to sign out. Please try again.' }
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        })
      } else {
        callback(null)
      }
    })
  }

  // Convert Firebase Auth errors to user-friendly messages
  private static getErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/configuration-not-found':
        return 'Authentication is not properly configured. Please contact support.'
      case 'auth/user-not-found':
        return 'No account found with this email address.'
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/user-disabled':
        return 'This account has been disabled.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.'
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.'
      default:
        return error.message || 'An unexpected error occurred. Please try again.'
    }
  }
}

export default AuthService
