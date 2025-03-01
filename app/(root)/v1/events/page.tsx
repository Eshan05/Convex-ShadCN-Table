'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { EventInterface, statusOptions } from '@/types/tables'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { RefreshCcw } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BatchList, DepList } from '../create/save'
import AdminEventFilters from './filters'

const EventCard = dynamic(() => import('./eventCard'), { ssr: false })
const EventForm = dynamic(() => import('../create/eventForm'), { ssr: false })

export interface TransformedEvent extends EventInterface {
  coordinatorNames: string[]
}

export default function AdminEvents() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [updateCounter, setUpdateCounter] = useState(0)
  const [eventToEdit, setEventToEdit] = useState<TransformedEvent | null>(null)
  const [open, setOpen] = useState(false)

  const [sortOption, setSortOption] = useState<
    'asc' | 'desc' | 'nameDuplicates' | 'deleted' | 'femaleOnly'
  >('desc')
  const [filterStatuses, setFilterStatuses] = useState<string[]>([])
  const [filterDepartments, setFilterDepartments] = useState<string[]>([])
  const [filterBatches, setFilterBatches] = useState<number[]>([])
  const [searchName, setSearchName] = useState<string>('')

  const {
    results: eventsResult,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.events.getAllEventsPaginated,
    {},
    {
      initialNumItems: 10,
    }
  )
  const coordinatorsResult = useQuery(api.coordinators.getCoordinators)

  // console.log(eventsResult)
  const events = eventsResult || []
  const coordinators = coordinatorsResult || []

  const transformedEvents: TransformedEvent[] = events.map((event) => {
    const coordinatorNames = event.coordinatorIds.map((coordIdObj) => {
      const user = coordinators.find((u) => u._id === coordIdObj.id)
      return user ? user.name || user.email : 'AmongUs'
    })

    return {
      ...event,
      coordinatorNames: coordinatorNames,
    }
  })

  const refreshData = () => {
    try {
      setUpdateCounter(updateCounter + 1)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  const filteredEvents = useMemo(() => {
    let filtered = [...transformedEvents]
    filtered = filtered.filter((event) => !event.isDeleted)

    if (searchName) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }

    switch (sortOption) {
      case 'asc':
        filtered.sort((a, b) => a._creationTime - b._creationTime)
        break
      case 'desc':
        filtered.sort((a, b) => b._creationTime - a._creationTime)
        break
      case 'nameDuplicates':
        const names: string[] = []
        filtered = filtered.filter((event) => {
          if (names.includes(event.name)) {
            return true
          } else {
            names.push(event.name)
            return false
          }
        })
        break
      case 'deleted':
        filtered = transformedEvents.filter((event) => event.isDeleted)
        break
      case 'femaleOnly': // When gender is FEMALE
        filtered = transformedEvents.filter((event) => {
          return event.eligibilityCriteria.gender === 'FEMALE'
        })
        break
      default:
        break
    }

    if (filterStatuses.length > 0) {
      filtered = filtered.filter((event) =>
        filterStatuses.includes(event.status)
      )
    }

    if (filterDepartments.length > 0) {
      filtered = filtered.filter((event) => {
        return event.eligibilityCriteria.allowedDepartments?.some((dept) =>
          filterDepartments.includes(dept)
        )
      })
    }

    if (filterBatches.length > 0) {
      filtered = filtered.filter((e) => {
        return e.eligibilityCriteria.allowedBatches?.some((batch) =>
          filterBatches.includes(batch)
        )
      })
    }

    return filtered
  }, [
    transformedEvents,
    searchName,
    sortOption,
    filterStatuses,
    filterDepartments,
    filterBatches,
  ])

  const departmentOptions = DepList
  const batchOptions = BatchList

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'l') {
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => {
      window.removeEventListener('keydown', handleShortcut)
    }
  }, [])

  const handleEdit = (event: TransformedEvent) => {
    setEventToEdit(event)
    setOpen(true)
  }

  const handleUpdate = () => {
    setUpdateCounter((prev) => prev + 1)
    setEventToEdit(null)
    setOpen(false)
  }

  if (eventsResult === undefined || coordinatorsResult === undefined)
    return (
      <div className='flex items-center justify-center gap-2 w-full mt-4'>
        <Image
          src='/images/bars-scale.svg'
          width={20}
          height={20}
          className='dark:invert'
          alt='...'
        />
      </div>
    )

  return (
    <main className='p-4 flex flex-col gap-4 mx-auto max-w-sm md:max-w-2xl lg:max-w-5xl 2xl:max-w-6xl min-h-screen items-center justify-center relative'>
      <Button
        size='icon'
        variant='secondary'
        className='fixed backdrop-blur bg-[#fffa] z-10 shadow rounded-full bottom-4 border right-4 dark:bg-[#09090b]'
        onClick={refreshData}
      >
        <RefreshCcw className='w-4 h-4 text-black dark:text-white' />
      </Button>
      <section className='flex items-center p-2 border rounded-lg dark:bg-[#0c0e0f88] bg-white'>
        {' '}
        <Input
          ref={inputRef}
          type='text'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder='Search by name...'
          className='flex-grow focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[#0c0e0f] border-none shadow-none'
        />
        <kbd className='p-1 ml-2 mr-2 font-mono text-xs bg-gray-100 rounded ring-1 ring-gray-900/10 dark:bg-zinc-800 dark:ring-gray-900/50 dark:text-zinc-300 whitespace-nowrap'>
          ALT<span className='text-[.25rem]'>&nbsp;</span>+
          <span className='text-[.25rem]'>&nbsp;</span>L
        </kbd>
      </section>
      <div className='flex flex-col lg:flex-row gap-4 items-center lg:justify-evenly w-full'>
        <header className='flex flex-col gap-2'>
          <div>
            <h1 className='shadow-heading text-7xl'>Events</h1>
          </div>
          <p className='max-w-md w-sm text-muted-foreground'>
            Here you can see all the events currently in the system. To filter
            by desired criterion you can use the filters provided{' '}
            <span className='sm:hidden'>via the button</span>
            <span className='hidden sm:inline'>to the side</span>. To search by
            name you can use the search bar. To refresh data use the refresh
            icon in the corner
          </p>
        </header>
        <aside className='max-w-md lg:w-full sm:block'>
          <AdminEventFilters
            sortOption={sortOption}
            setSortOption={setSortOption}
            filterStatuses={filterStatuses}
            setFilterStatuses={setFilterStatuses}
            filterDepartments={filterDepartments}
            setFilterDepartments={setFilterDepartments}
            filterBatches={filterBatches}
            setFilterBatches={setFilterBatches}
            statusOptions={statusOptions}
            departmentOptions={departmentOptions}
            batchOptions={batchOptions}
          />
        </aside>
      </div>
      <article className='grid lg:grid-cols-2 grid-cols gap-4 place-items-center w-full'>
        {filteredEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onEdit={() => handleEdit(event)}
          />
        ))}
      </article>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className='hidden'></DialogTitle>
        <DialogDescription className='hidden'></DialogDescription>
        <DialogContent
          className='max-w-[90%] lg:max-w-[50%] max-h-[80vh] rounded overflow-scroll no-scrollbar'
          aria-describedby={undefined}
        >
          {eventToEdit && (
            <EventForm passedData={eventToEdit} onUpdate={handleUpdate} />
          )}
        </DialogContent>
      </Dialog>
      <Button onClick={() => loadMore(10)} disabled={status !== 'CanLoadMore'}>
        Load More
      </Button>
    </main>
  )
}
