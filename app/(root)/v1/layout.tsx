import AdminSidebar from '@/components/navigation/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import type { Metadata, Viewport } from 'next'
import { ModeToggle } from '@/components/mode-toggle'

const metadata: Metadata = {
  title: 'Sinhgad CDC | Event Attendance Admin',
  description:
    'This is a project by ACES for the Sinhgad Career Development Cell and specifically RMDSTIC, to mark student attendance.',
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider className='overflow-x-hidden'>
      <AdminSidebar />
      <SidebarInset className='group-has[[data-collapsible=icon]]/sidebar-wrapper:w-10 '>
        <section className='transition-[margin] ease-linear'>
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:ml-0 group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-full'>
            <div className='flex items-center gap-2 px-4 justify-between w-full'>
              <aside className='flex items-center gap-2'>
                <SidebarTrigger className='-ml-1' />
                <h1 className='text-lg font-semibold leading-none tracking-tight'>
                  Convex ShadCN Table
                </h1>
              </aside>
              <aside>
                <ModeToggle />
              </aside>
            </div>
          </header>
          <main className='relative group-has-[[data-collapsible=icon]]/sidebar-wrapper:ml-0 ml-0 w-full'>
            {children}
            <footer className='w-full mx-auto relative'>
              {/* <Footer /> */}
            </footer>
          </main>
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
