import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  Ellipsis,
  Pencil,
  Trash2,
} from 'lucide-react'

type ActionMenuProps = {
  onEdit?: () => void
  onDelete: () => void
}

function ActionMenu({
  onEdit,
  onDelete,
}: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Task actions"
          className="
            flex size-9 items-center justify-center
            rounded-full
            text-slate-500
            transition
            hover:bg-slate-800
            hover:text-slate-200
            active:scale-95
          "
        >
          <Ellipsis size={19} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="
            z-50 min-w-40
            rounded-xl
            border border-slate-700
            bg-slate-900
            p-1.5
            shadow-2xl
          "
        >
          {onEdit && (
            <DropdownMenu.Item
              onSelect={onEdit}
              className="
                flex cursor-pointer
                items-center gap-2
                rounded-lg
                px-3 py-2
                text-sm text-slate-300
                outline-none
                data-[highlighted]:bg-slate-800
                data-[highlighted]:text-white
              "
            >
              <Pencil size={15} />
              Edit
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Separator className="my-1 h-px bg-slate-800" />

          <DropdownMenu.Item
            onSelect={onDelete}
            className="
              flex cursor-pointer
              items-center gap-2
              rounded-lg
              px-3 py-2
              text-sm text-red-300
              outline-none
              data-[highlighted]:bg-red-950/50
            "
          >
            <Trash2 size={15} />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default ActionMenu