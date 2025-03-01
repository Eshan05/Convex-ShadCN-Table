import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import TableUsers from './userTable'

async function getAllUsers() {
  const data = fetchQuery(api.users.getAllUsers)
  return data
}

export default async function AdminUsers() {
  const users = await getAllUsers()
  return (
    <main className='p-4 flex flex-col gap-4 mx-auto max-w-4xl lg:max-w-4xl 2xl:max-w-5xl min-h-screen items-center justify-center'>
      <aside className='flex overflow-x-auto items-center max-w-sm md:max-w-xl lg:max-w-3xl xl:max-w-5xl justify-center p-2'>
        <div className='w-full'>
          <TableUsers users={users} />
        </div>
      </aside>
    </main>
  )
}
