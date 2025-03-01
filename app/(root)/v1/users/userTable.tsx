'use client'

import { columns } from '@/components/table/users/columns'
import { DataTable } from '@/components/table/users/data-table'
import { Button } from '@/components/ui/button'
import { UserInterface } from '@/types/tables'
import { exportToCSV, exportToJSON } from '@/utils/utils'
import { BracesIcon, DatabaseIcon } from 'lucide-react'

export default function TableUsers({ users }: { users: UserInterface[] }) {
  return (
    <div>
      {/* @ts-expect-error */}
      <DataTable data={users} columns={columns} />
      <footer className='flex justify-end mt-4 gap-4 flex-wrap flex-col md:flex-row'>
        {/* <Button onClick={handleRefresh} variant="outline" className="flex items-center space-x-2">
          <RotateCcwIcon className="w-4 h-4" /> <span>Refresh</span>
        </Button> */}
        <Button
          onClick={() => exportToCSV(users)}
          variant='outline'
          className='flex items-center space-x-2'
        >
          <DatabaseIcon className='w-4 h-4' /> <span>Export CSV</span>
        </Button>
        <Button
          onClick={() => exportToJSON(users)}
          variant='outline'
          className='flex items-center space-x-2'
        >
          <BracesIcon className='w-4 h-4' /> <span>Export JSON</span>
        </Button>
      </footer>
    </div>
  )
}
