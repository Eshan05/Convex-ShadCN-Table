'use client'

import React, { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  defaultValue?: [number, number]
  onValueChange: (value: [number, number]) => void
  className?: string
}

export function RangeSlider({
  min,
  max,
  step = 0.1,
  defaultValue = [min, max],
  onValueChange,
  className,
}: RangeSliderProps) {
  const [values, setValues] = useState<[number, number]>(defaultValue)

  const handleSliderChange = (newValues: number[]) => {
    const newRange: [number, number] = [
      newValues[0],
      newValues[1] || newValues[0],
    ]
    setValues(newRange)
    onValueChange(newRange)
  }

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseFloat(event.target.value)
    if (!isNaN(newValue)) {
      const newValues = [...values]
      newValues[index] = Math.max(min, Math.min(max, newValue))
      setValues(newValues as [number, number])
      onValueChange(newValues as [number, number])
    }
  }

  return (
    <div
      className={cn(
        'grid grid-cols-[1fr_auto_auto] gap-2 items-center',
        className
      )}
    >
      <Slider
        min={min}
        max={max}
        step={step}
        defaultValue={values}
        onValueChange={handleSliderChange}
        className='w-full'
        aria-label='CGPA Range'
      />
      <Input
        type='number'
        min={min}
        max={max}
        step={step}
        value={values[0]}
        onChange={(e) => handleInputChange(0, e)}
        className='w-16 h-8'
        aria-label='Minimum CGPA'
      />
      <Input
        type='number'
        min={min}
        max={max}
        step={step}
        value={values[1]}
        onChange={(e) => handleInputChange(1, e)}
        className='w-16 h-8'
        aria-label='Maximum CGPA'
      />
    </div>
  )
}
