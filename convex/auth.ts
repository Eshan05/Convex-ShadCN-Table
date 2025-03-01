import { Password } from '@convex-dev/auth/providers/Password'
import Google from '@auth/core/providers/google'
import { convexAuth } from '@convex-dev/auth/server'
import { api } from './_generated/api'
import { useRouter } from 'next/navigation'
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password(),
    // Google({
    //   profile(googleProfile) {
    //     return {
    //       id: googleProfile.sub,
    //       email: googleProfile.email,
    //       name: googleProfile.name,
    //     }
    //   },
    // }),
  ],
})
