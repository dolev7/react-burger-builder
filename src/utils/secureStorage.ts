// Secure storage utilities for authentication tokens

export class SecureStorage {
  private static readonly TOKEN_KEY = 'authToken'
  private static readonly EXPIRY_KEY = 'tokenExpiry'

  // Store token with expiration
  static setToken(token: string, expirationMinutes: number = 60): void {
    try {
      const expiryTime = new Date().getTime() + (expirationMinutes * 60 * 1000)
      
      // Store in sessionStorage (more secure than localStorage)
      sessionStorage.setItem(this.TOKEN_KEY, token)
      sessionStorage.setItem(this.EXPIRY_KEY, expiryTime.toString())
      
      console.log('🔐 Token stored securely with expiration')
    } catch (error) {
      console.error('Failed to store token:', error)
    }
  }

  // Get token if not expired
  static getToken(): string | null {
    try {
      const token = sessionStorage.getItem(this.TOKEN_KEY)
      const expiry = sessionStorage.getItem(this.EXPIRY_KEY)
      
      if (!token || !expiry) {
        return null
      }

      const expiryTime = parseInt(expiry, 10)
      const now = new Date().getTime()

      if (now > expiryTime) {
        // Token expired, remove it
        this.clearToken()
        console.log('🕒 Token expired and removed')
        return null
      }

      return token
    } catch (error) {
      console.error('Failed to get token:', error)
      return null
    }
  }

  // Clear all auth data
  static clearToken(): void {
    try {
      sessionStorage.removeItem(this.TOKEN_KEY)
      sessionStorage.removeItem(this.EXPIRY_KEY)
      console.log('🗑️ Token cleared from storage')
    } catch (error) {
      console.error('Failed to clear token:', error)
    }
  }

  // Check if token exists and is valid
  static hasValidToken(): boolean {
    return this.getToken() !== null
  }

  // Get time until token expires (in minutes)
  static getTimeUntilExpiry(): number | null {
    try {
      const expiry = sessionStorage.getItem(this.EXPIRY_KEY)
      if (!expiry) return null

      const expiryTime = parseInt(expiry, 10)
      const now = new Date().getTime()
      const diffMinutes = Math.floor((expiryTime - now) / (1000 * 60))

      return diffMinutes > 0 ? diffMinutes : 0
    } catch (error) {
      console.error('Failed to get expiry time:', error)
      return null
    }
  }
}

export default SecureStorage
