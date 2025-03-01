'use client'

import { formSchema as signInSchema } from '@/app/auth/sign-in/page'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

import { useAuthActions } from '@convex-dev/auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export default function LoginDialog() {
  const { signIn, signOut } = useAuthActions()
  const signinForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      flow: 'signIn',
    },
  })

  const signInSubmit = (data: z.infer<typeof signInSchema>) => {
    void signIn('password', {
      email: data.email,
      password: data.password,
      flow: 'signIn',
    })
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully.')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type='button' variant={'outline'}>
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Quick login for password validator
          </DialogDescription>
        </DialogHeader>
        <Form {...signinForm}>
          <form
            className='flex flex-col p-2 w-full mx-auto rounded-md gap-2 items-center'
            onSubmit={signinForm.handleSubmit(signInSubmit)}
          >
            <header className='flex flex-col items-center space-y-1 mb-4'>
              <h1 className='text-3xl font-bold !mt-3'>Welcome Back</h1>
              <p className='text-sm text-muted-foreground'>Please login</p>
            </header>
            <div className='flex flex-col gap-2 w-full'>
              <FormField
                control={signinForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel htmlFor='email' className='hidden'></FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your email'
                        tabIndex={1}
                        {...field}
                        required
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <FormField
                control={signinForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel
                      htmlFor='password'
                      className='hidden'
                    ></FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter your password'
                        {...field}
                        required
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <section className='flex justify-between items-center w-full'>
                <aside className='flex items-center space-x-2 my-2 px-1'>
                  <Checkbox id='remember' className='rounded-full' />
                  <Label
                    htmlFor='remember'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    Remember me
                  </Label>
                </aside>
                <p className='text-sm text-muted-foreground'>
                  <Link
                    className='inline-block text-foreground font-medium underline'
                    href='/auth/forgot-password'
                  >
                    Forgot password?
                  </Link>
                </p>
              </section>
              <DialogFooter className='gap-2'>
                <Button type='submit'>Sign in</Button>
                <Button type='button' onClick={handleSignOut}>
                  Sign out
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
