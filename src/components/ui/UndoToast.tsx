import * as Toast from '@radix-ui/react-toast'
import { CheckCircle2 } from 'lucide-react'

type UndoToastProps = {
  open: boolean
  message: string
  onOpenChange: (open: boolean) => void
  onUndo: () => void
}

function UndoToast({
  open,
  message,
  onOpenChange,
  onUndo,
}: UndoToastProps) {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={open}
        onOpenChange={onOpenChange}
        duration={5000}
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border border-slate-700
          bg-slate-900
          px-4 py-3
          shadow-2xl
          shadow-black/30

          data-[state=open]:animate-in
          data-[state=closed]:animate-out
        "
      >
        <div
          className="
            flex size-8
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-emerald-500/15
            text-emerald-300
          "
        >
          <CheckCircle2 size={17} />
        </div>

        <Toast.Title className="min-w-0 flex-1 text-sm font-medium text-slate-200">
          {message}
        </Toast.Title>

        <Toast.Action
          altText="Undo task completion"
          asChild
        >
          <button
            type="button"
            onClick={onUndo}
            className="
              shrink-0
              rounded-xl
              px-3 py-2
              text-sm font-semibold
              text-sky-300
              transition
              hover:bg-slate-800
              active:scale-95
            "
          >
            Undo
          </button>
        </Toast.Action>
      </Toast.Root>

      <Toast.Viewport
        className="
          fixed
          bottom-[calc(env(safe-area-inset-bottom)+6rem)]
          left-4
          right-4
          z-[100]

          flex
          flex-col
          gap-2

          sm:left-auto
          sm:w-96

          lg:bottom-6
          lg:right-6
        "
      />
    </Toast.Provider>
  )
}

export default UndoToast