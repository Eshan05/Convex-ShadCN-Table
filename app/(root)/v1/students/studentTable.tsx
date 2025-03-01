'use client'

import { Student, studentSchema } from '@/components/table/data/student.schema'
import { DataTable } from '@/components/table/students/data-table'
import { Button } from '@/components/ui/button'
import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { StudentInterface } from '@/types/tables'
import { exportToCSV, exportToJSON } from '@/utils/utils'
import { BracesIcon, DatabaseIcon, RotateCcwIcon } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { createColumns } from '@/components/table/students/columns'

interface EventInfo {
  id: Id<'events'>
  name: string
}

export interface StudentTableData
  extends Omit<Student, 'eligibilityOverrides' | 'eventsAttended'> {
  userName: string
  userEmail: string
  coordinatorForEvents: EventInfo[]
  eligibleEvents: EventInfo[]
  ineligibleEvents: EventInfo[]
  eventsAttended: EventInfo[]
}

export default function TableStudents() {
  const [convexStudents, setConvexStudents] = useState<StudentInterface[]>([])
  const [students, setStudents] = useState<z.infer<typeof studentSchema>[]>([])
  const { transformedStudents, eventIdToName } = useQuery(
    api.students.getStudentsForTable
  ) || { transformedStudents: [], eventIdToName: {} }
  // console.log(transformedStudents)
  // console.log(eventIdToName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(true)

  if (!transformedStudents || loading)
    return (
      <div className='flex items-center justify-center gap-2 w-full'>
        <Image
          src='/images/bars-scale.svg'
          width={20}
          height={20}
          className='dark:invert'
          alt='...'
        />
      </div>
    )
  // if (error) return <p>Error: {error}</p>;
  // const columns = useMemo(() => createColumns({ eventIdToName }), [eventIdToName]);
  const columns = createColumns({ eventIdToName })
  return (
    <div>
      <DataTable data={transformedStudents} columns={columns} />
      <footer className='flex justify-end mt-4 gap-4 flex-wrap flex-col md:flex-row'>
        {/* <Button onClick={handleRefresh} variant="outline" className="flex items-center space-x-2">
          <RotateCcwIcon className="w-4 h-4" /> <span>Refresh</span>
        </Button> */}
        <Button
          onClick={() => exportToCSV(convexStudents)}
          variant='outline'
          className='flex items-center space-x-2'
        >
          <DatabaseIcon className='w-4 h-4' /> <span>Export CSV</span>
        </Button>
        <Button
          onClick={() => exportToJSON(convexStudents)}
          variant='outline'
          className='flex items-center space-x-2'
        >
          <BracesIcon className='w-4 h-4' /> <span>Export JSON</span>
        </Button>
      </footer>
    </div>
  )
}
