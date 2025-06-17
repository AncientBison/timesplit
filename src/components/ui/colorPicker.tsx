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
import { TASK_COLORS, type Color } from "~/lib/taskColors"

export function ColorPicker({ selected, onSelect }: { selected: Color, onSelect: (color: Color) => void }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
        <div
            style={{
                backgroundColor: selected,
                boxShadow: `0 0 0 2px ${selected}80`
            }}
            className="rounded-lg size-10"
        />
    </PopoverTrigger>
    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <div className="grid grid-cols-8 gap-2 p-2">
            {TASK_COLORS.map(color => (
                <div
                    onClick={() => {
                        onSelect(color);
                        setOpen(false)
                    }}
                    key={color}
                    style={{
                        backgroundColor: color,
                    }}
                    className="rounded-lg size-10"
                />
            ))}
        </div>
    </PopoverContent>
    </Popover>
  )
}
