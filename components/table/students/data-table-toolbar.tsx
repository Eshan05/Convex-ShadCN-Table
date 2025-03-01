'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '../data-table-faceted-filter'

import {
  batchYears,
  departmentOptions,
  enrollmentStatus,
  genderOptions,
  isArchivedOptions,
  isBlacklistedOptions,
  isPlacedOptions,
} from '../data/student.data'
import { DataTableViewOptions } from './data-table-view-options'
import { useEffect, useState } from 'react'
import { RangeSlider } from './rangeSlider'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [cgpaRange, setCgpaRange] = useState<[number, number]>([0, 10])

  useEffect(() => {
    // @ts-ignore
    table.getColumn('cgpa')?.setFilterValue(cgpaRange)
  }, [cgpaRange, table])
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col items-start gap-2'>
        <section className='flex flex-1 items-center gap-2 flex-wrap'>
          <Input
            placeholder='Filter students...'
            value={
              (table.getColumn('userName')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('userName')?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[200px]'
          />

          {table.getColumn('enrollmentStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('enrollmentStatus')}
              title='Status'
              // @ts-ignore
              options={enrollmentStatus.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
            />
          )}
          {table.getColumn('batchYear') && (
            <DataTableFacetedFilter
              column={table.getColumn('batchYear')}
              title='Batch'
              // @ts-ignore
              options={batchYears.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
            />
          )}
          {table.getColumn('department') && (
            <DataTableFacetedFilter
              column={table.getColumn('department')}
              title='Department'
              // @ts-ignore
              options={departmentOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
            />
          )}
          {table.getColumn('isArchived') && (
            <DataTableFacetedFilter
              column={table.getColumn('isArchived')}
              title='Deleted'
              // @ts-ignore
              options={isArchivedOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
            />
          )}
          {table.getColumn('isBlacklisted') && (
            <DataTableFacetedFilter
              column={table.getColumn('isBlacklisted')}
              title='Blacklist'
              // @ts-ignore
              options={isBlacklistedOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
            />
          )}
          {table.getColumn('isPlaced') && (
            <DataTableFacetedFilter
              column={table.getColumn('isPlaced')}
              title='Placed'
              // @ts-ignore
              options={isPlacedOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
            />
          )}
          {table.getColumn('gender') && (
            <DataTableFacetedFilter
              column={table.getColumn('gender')}
              title='Gender'
              // @ts-ignore
              options={genderOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
            />
          )}

          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => table.resetColumnFilters()}
              className='h-8 px-2 lg:px-3 flex items-center space-x-2'
            >
              <span>Reset</span>
              <X className='w-4 h-4' />
            </Button>
          )}
        </section>
        <section className='flex flex-1 items-center space-x-2 w-full'>
          <RangeSlider
            min={0}
            max={10}
            step={0.1}
            defaultValue={[0, 10]}
            onValueChange={setCgpaRange}
            className='w-full max-w-sm'
          />
        </section>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
