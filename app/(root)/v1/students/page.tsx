import dynamic from 'next/dynamic'
import Image from 'next/image'
const TableStudents = dynamic(() => import('./studentTable'), {
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

export default function AdminStudents() {
  return (
    <main className='p-4 flex flex-col gap-4 mx-auto max-w-4xl lg:max-w-4xl 2xl:max-w-5xl min-h-screen items-center justify-center'>
      <aside className='flex overflow-x-auto items-center max-w-sm md:max-w-xl lg:max-w-3xl xl:max-w-5xl justify-center p-2'>
        <div className='w-full'>
          <TableStudents />
        </div>
      </aside>
    </main>
  )
}
