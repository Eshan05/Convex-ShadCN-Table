'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { zUser } from '../data/users.table'
import { DataTableColumnHeader } from '../data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<zUser>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='flex items-center mr-2'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='flex items-center'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Convex ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px] py-1 px-1.5 text-xs border rounded overflow-x-auto no-scrollbar'>
        {row.getValue('_id')}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div className='w-max'>{row.getValue('name')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px] py-1 px-1.5 text-xs border rounded overflow-x-auto no-scrollbar'>
        {row.getValue('email')}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Roles' />
    ),
    cell: ({ row }) => {
      const roles = row.getValue('roles') as string[] | null
      return roles ? (
        roles.map((role) => (
          <Badge key={role} className='' variant='outline'>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        ))
      ) : (
        <Badge className='' variant={'outline'}>
          -
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) => {
      if (!value.length) return true
      const userRoles = row.getValue<string[]>(id) || []
      return value.every((role) => userRoles.includes(role))
    },
    // cell: ({ row }) => <Badge className="" variant={'outline'}>{(row.getValue("roles") ? (row.getValue("roles") as string[]).map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(", ") : "-")}</Badge>,
    enableHiding: true,
  },
  {
    accessorKey: 'emailVerificationTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email Verification Time' />
    ),
    cell: ({ row }) => <div>{row.getValue('emailVerificationTime')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Active' />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('isActive') ? 'Active' : 'Not Active'}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
