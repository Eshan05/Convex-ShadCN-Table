'use client'
import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { fetchQuery } from 'convex/nextjs'

export const useGoogleSignIn = () => {
  const { signIn, signOut } = useAuthActions()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')

  const validateEmail = (email: string) => {
    const departments = ['comp', 'it', 'entc', 'civil', 'mech']
    return (
      email.includes('rmdstic') &&
      departments.some((dept) => email.includes(dept))
    )
  }

  const deactivateUser = useMutation(api.users.deactivateUser)

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signIn('google', {
        redirectTo: '/auth/validate', // Redirect to home page after sign in
      })
      if (result.signingIn) {
        // const userEmail = profile.email
        const userEmail = 'madhurjaripatke.rmdstic.comp@gmail.com'
        if (validateEmail(userEmail)) {
          const existingUser = await fetchQuery(api.users.getUserByEmail, {
            email: userEmail,
          })
          if (existingUser) {
            router.push('/')
          } else {
            router.push('/auth/register')
          }
        } else {
          setError('Invalid email address')
          await deactivateUser({ email: userEmail })
        }
      }
    } catch (error) {
      setError('Error signing in with Google')
    }
  }

  return { handleSignInWithGoogle, error, email, setEmail }
}
