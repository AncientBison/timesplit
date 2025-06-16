"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "~/lib/utils"

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  variant?: "solid" | "dotted" | "dashed";
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "solid",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        {
          // Base styles for orientation
          "h-px w-full": orientation === "horizontal",
          "h-full w-px": orientation === "vertical",
          // Border style based on variant
          "border-none bg-border": variant === "solid",
          "border-dotted border border-border bg-transparent": variant === "dotted",
          "border-dashed border border-border bg-transparent": variant === "dashed",
        },
        className
      )}
      {...props}
    />
  )
}

export { Separator }