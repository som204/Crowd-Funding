import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../lib/storage'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signUp = async (email, password) => {
    try {
      const { user } = auth.signUp(email, password)
      return { data: { user }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { user } = auth.signIn(email, password)
      setUser(user)
      return { data: { user }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = () => {
    auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}