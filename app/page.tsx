import Link from 'next/link'
import Head from 'next/head'
import Script from 'next/script'
import AccordionComponent from '@/components/origin-accordion'
import { Button } from '@/components/ui/button'

export default async function Home() {
  return (
    <main className='flex items-center lg:max-w-3xl md:max-w-2xl sm:max-w-lg max-w-sm md:flex-row flex-col mx-auto min-h-screen justify-center'>
      <header className='flex flex-col items-center md:max-w-lg max-w-sm mx-auto justify-center'>
        <h1 className='shadow-heading tracking-tight leading-tight text-5xl text-center flex-1'>
          Convex ShadCN Table Demo
        </h1>
        <Link href='/v1/students'>
          <Button>View</Button>
        </Link>
      </header>
      <div className='flex items-center md:max-w-lg max-w-sm flex-1 justify-center'>
        <AccordionComponent />
      </div>
    </main>
  )
}
