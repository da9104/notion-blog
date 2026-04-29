import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-none border-0 border-b border-[var(--outline-variant)] bg-transparent px-0 py-1 text-base transition-colors placeholder:text-[var(--tertiary)] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
