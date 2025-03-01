'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function AdminDashboard() {
  const router = useRouter()
  const user = useQuery(api.users.getCurrentUserById)

  // useEffect(() => {
  //   if (user && user.roles && !user.roles.includes('admin')) {
  //     router.push('/auth/validate')
  //   }
  // }, [user, router])
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link href='/admin/events'>Manage Events</Link>
        </li>
        <li>
          <Link href='/admin/students'>Manage Students</Link>
        </li>
        <li>
          <Link href='/admin/attendance'>View Attendance</Link>
        </li>
      </ul>
    </div>
  )
}
