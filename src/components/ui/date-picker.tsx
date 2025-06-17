"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@components/ui/button"
import { Calendar } from "@components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/popover"

export function DatePicker({ selected, onSelect, disabled }: { selected?: Date | undefined, onSelect?: (date: Date | undefined) => void, disabled?: (date: Date) => boolean }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-full justify-between font-normal"
          >
          {selected ? selected.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          captionLayout="dropdown"
          onSelect={(date) => {
              setOpen(false)
              if (onSelect) {
                  onSelect(date);
              }
          }}
          disabled={disabled}
        />
    </PopoverContent>
    </Popover>
  )
}
