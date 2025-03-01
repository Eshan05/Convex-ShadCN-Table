'use client'

import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { decodeU } from '@/lib/utils'
import { useAuthToken } from '@convex-dev/auth/react'
import { fetchQuery } from 'convex/nextjs'
import { deleteCookie, getCookies, setCookie } from 'cookies-next/client'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface AuthContextProps {
  user: Doc<'users'> | null | undefined
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
})

export function useAuth() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Doc<'users'> | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const token = useAuthToken()

  useEffect(() => {
    const refreshCookie = async () => {
      const cookies = getCookies()
      if (cookies?.user && token) {
        try {
          const fetchedUser = await fetchQuery(
            api.users.getCurrentUserById,
            {},
            { token }
          )

          if (fetchedUser) {
            setUser(fetchedUser)
            setCookie('user', JSON.stringify(fetchedUser), {
              sameSite: 'lax',
              // secure: process.env.NODE_ENV === "production",
              // httpOnly: process.env.NODE_ENV === "production",
              path: '/',
              maxAge: 1800,
            })
          } else {
            setUser(null)
            deleteCookie('user')
            setIsAuthenticated(false)
          }
        } catch (error) {
          console.error('Error refreshing user cookie:', error)
          setUser(null)
          deleteCookie('user')
          setIsAuthenticated(false)
        }
      }
    }

    const loadUserFromCookie = () => {
      const cookies = getCookies()
      if (cookies?.user) {
        try {
          let userData
          if (typeof cookies.user === 'string') {
            userData = decodeU(cookies.user)
          } else {
            userData = cookies.user as Doc<'users'> | null | undefined
          }
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Error parsing user cookie:', error)
          deleteCookie('user')
          setUser(null)
          setIsAuthenticated(false)
        }
      }
    }

    const loadInitialUser = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const fetchedUser = await fetchQuery(
          api.users.getCurrentUserById,
          {},
          { token }
        )
        if (fetchedUser) {
          setUser(fetchedUser)
          setCookie('user', JSON.stringify(fetchedUser), {
            sameSite: 'lax',
            // secure: process.env.NODE_ENV === "production",
            // httpOnly: process.env.NODE_ENV === "production",
            path: '/',
            maxAge: 1800,
          })
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserFromCookie()

    if (!user) {
      loadInitialUser()
    }
    const intervalId = setInterval(refreshCookie, 30 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [token])

  const contextValue = {
    user,
    isLoading,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
