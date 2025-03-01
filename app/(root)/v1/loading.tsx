import Image from 'next/image'

export default function Loading() {
  return (
    <div className='flex flex-col items-center flex-1 w-full gap-20 h-screen'>
      <Image
        src='/images/ring-resize.svg'
        width={20}
        height={20}
        className='dark:invert'
        alt='...'
      />
    </div>
  )
}
