import { MultiSelect } from '@/components/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'

interface AdminEventFiltersProps {
  sortOption: 'asc' | 'desc' | 'nameDuplicates' | 'deleted' | 'femaleOnly'
  setSortOption: (
    value: 'asc' | 'desc' | 'nameDuplicates' | 'deleted' | 'femaleOnly'
  ) => void
  filterStatuses: string[]
  setFilterStatuses: (values: string[]) => void
  filterDepartments: string[]
  setFilterDepartments: (values: string[]) => void
  filterBatches: number[]
  setFilterBatches: (values: number[]) => void
  statusOptions: { value: string; label: string }[]
  departmentOptions: { value: string; label: string }[]
  batchOptions: { value: string; label: string }[]
}

const AdminEventFilters: React.FC<AdminEventFiltersProps> = ({
  sortOption,
  setSortOption,
  filterStatuses,
  setFilterStatuses,
  filterDepartments,
  setFilterDepartments,
  filterBatches,
  setFilterBatches,
  statusOptions,
  departmentOptions,
  batchOptions,
}) => {
  return (
    <section className='flex items-center gap-2 w-full flex-col'>
      <Select
        onValueChange={(value) =>
          setSortOption(value as 'asc' | 'desc' | 'deleted' | 'nameDuplicates')
        }
        defaultValue={sortOption}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Sort by Date' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='asc'>Date (Oldest)</SelectItem>
          <SelectItem value='desc'>Date (Newest)</SelectItem>
          <SelectItem value='deleted'>Soft Deleted</SelectItem>
          <SelectItem value='nameDuplicates'>Duplicates</SelectItem>
          <SelectItem value='femaleOnly'>Female Only</SelectItem>
        </SelectContent>
      </Select>
      <MultiSelect
        options={statusOptions}
        onValueChange={setFilterStatuses}
        defaultValue={filterStatuses}
        placeholder='Filter by Status'
      />

      <MultiSelect
        options={departmentOptions}
        onValueChange={setFilterDepartments}
        defaultValue={filterDepartments}
        placeholder='Filter by Department'
      />
      <MultiSelect
        options={batchOptions}
        onValueChange={(values) =>
          setFilterBatches(values.map((value) => parseInt(value, 10)))
        }
        defaultValue={filterBatches.map((batch) => batch.toString())}
        placeholder='Filter by Batch Years'
      />
    </section>
  )
}

export default AdminEventFilters
