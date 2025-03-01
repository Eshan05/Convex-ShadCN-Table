'use client'

import { Form } from '@/components/ui/form'
import { useAuthActions } from '@convex-dev/auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
const SignInForm = dynamic(() => import('./form'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center gap-2 w-full mt-4'>
      <Image
        src='/images/bars-scale.svg'
        width={20}
        height={20}
        className='dark:invert'
        alt='...'
      />
    </div>
  ),
})

export const formSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8),
  flow: z.enum(['signIn', 'signUp']),
})

// https://labs.convex.dev/auth/config/passwords#customize-user-information
// Need to do above and remove optional on isActive and roles
export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      flow: 'signIn',
    },
  })
  const { signIn } = useAuthActions()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const flow = form.watch('flow') || 'signIn'
  const Submit = (data: z.infer<typeof formSchema>) => {
    signIn('password', {
      email: data.email,
      password: data.password,
      flow,
    })
      .catch((error) => {
        setError(error.message)
      })
      .then(() => {
        router.push('/')
      })
  }

  return (
    <main className='p-4 flex flex-col gap-4 mx-auto min-w-80 max-w-xl min-h-screen items-center justify-center'>
      <Form {...form}>
        <form
          className='flex flex-col p-2 w-full mx-auto rounded-md gap-2 items-center'
          onSubmit={form.handleSubmit(Submit)}
        >
          <header className='flex flex-col items-center space-y-1'>
            <img
              src='https://res.cloudinary.com/dygc8r0pv/image/upload/v1734452294/ACES_Logo_ACE_White_d6rz6a.png'
              alt='logo'
              width={100}
              height={100}
              className='w-[3.33em] h-[3.33em] rounded-full'
            />
            <h1 className='text-3xl font-bold !mt-3'>Welcome Back</h1>
            <p className='text-sm text-muted-foreground'>Please login</p>
          </header>
          <SignInForm form={form} />
          {error && (
            <div className='bg-red-500/20 border-2 border-red-500/50 rounded-md p-2'>
              <p className='text-foreground font-mono text-xs'>
                Error signing in: {error}
              </p>
            </div>
          )}
        </form>
      </Form>
    </main>
  )
}
