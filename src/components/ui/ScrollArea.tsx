import * as RadixScrollArea from '@radix-ui/react-scroll-area'
import type { ReactNode } from 'react'

type ScrollAreaProps = {
  children: ReactNode
  className?: string
  viewportClassName?: string
  horizontal?: boolean
}

function ScrollArea({
  children,
  className = '',
  viewportClassName = '',
  horizontal = false,
}: ScrollAreaProps) {
  return (
    <RadixScrollArea.Root
      className={`relative overflow-hidden ${className}`}
    >
      <RadixScrollArea.Viewport
        className={`
          h-full w-full
          rounded-[inherit]
          ${viewportClassName}
        `}
      >
        {children}
      </RadixScrollArea.Viewport>

      <RadixScrollArea.Scrollbar
        orientation="vertical"
        className="
          flex w-2.5
          touch-none
          select-none
          p-0.5
        "
      >
        <RadixScrollArea.Thumb
          className="
            relative flex-1
            rounded-full
            bg-slate-700
            transition
            hover:bg-slate-600
          "
        />
      </RadixScrollArea.Scrollbar>

      {horizontal && (
        <RadixScrollArea.Scrollbar
          orientation="horizontal"
          className="
            flex h-2.5
            touch-none
            select-none
            p-0.5
          "
        >
          <RadixScrollArea.Thumb
            className="
              relative flex-1
              rounded-full
              bg-slate-700
            "
          />
        </RadixScrollArea.Scrollbar>
      )}

      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  )
}

export default ScrollArea