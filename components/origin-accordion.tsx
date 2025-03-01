import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AtSignIcon,
  CommandIcon,
  EclipseIcon,
  LucideIcon,
  ZapIcon,
} from 'lucide-react'
import React from 'react'

interface AccordionItem {
  id: string
  icon: LucideIcon
  title: string
  content: React.ReactNode
}

const items: AccordionItem[] = [
  {
    id: '1',
    icon: CommandIcon,
    title: 'What is this?',
    content: (
      <span>
        This is a demonstration of using convex with ShadCN data table and{' '}
        <code>@tanstack/react-table</code>. I made some changes like in users
        table being able to have filtering with array (Like a user can have more
        than one role and it's being represented via an array), the tasks demo
        on ShadCN does not handle it very well, so I made it more versatile. In
        students table you can also see filtering via a lower and upper range
        for CGPA
      </span>
    ),
  },
  {
    id: '2',
    icon: EclipseIcon,
    title: 'Not using server side sorting and pagination?',
    content: (
      <span>
        I wanted to use server side sorting/filtering and pagination (Pagination
        I tried with prop drilling and works) however, I do not believe it's
        feasible because it needs convex functions and there are only a million
        per month 🙂. I also do not know how to do server side filtering in an
        optimized way
      </span>
    ),
  },
  {
    id: '3',
    icon: ZapIcon,
    title: "Can't sign up or manage events?",
    content: (
      <p>
        Just like above I do not want to use up all my function calls available
        per month
      </p>
    ),
  },
  {
    id: '4',
    icon: AtSignIcon,
    title: 'Future Updates?',
    content: (
      <p>
        I hope to be able to do server side actions instead of client side
        sorting, whenever I feel ambitious. In a real project I am using this it
        is able to 500+ rows pretty fine
      </p>
    ),
  },
]

export default function AccordionComponent() {
  return (
    <div className='space-y-4 w-full'>
      <Accordion type='single' collapsible className='w-full' defaultValue='3'>
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className='py-2'>
            <AccordionTrigger className='py-2 text-[15px] leading-6 hover:no-underline w-sm'>
              <span className='flex items-center gap-3'>
                <item.icon
                  size={16}
                  className='shrink-0 opacity-60'
                  aria-hidden='true'
                />
                <span>{item.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className='text-muted-foreground ps-7 w-full pb-2'>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
