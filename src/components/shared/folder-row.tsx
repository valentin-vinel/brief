"use client"

import Link from "next/link"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderDialog } from "@/components/shared/folder-dialog"
import { DeleteFolderDialog } from "@/components/shared/delete-folder-dialog"
import type { Folder, FolderWithSummaryCount } from "@/types"

type FolderRowProps = {
  folder: FolderWithSummaryCount
  onUpdated: (folder: Folder) => void
  onDeleted: (id: string) => void
}

export function FolderRow({ folder, onUpdated, onDeleted }: FolderRowProps) {
  const createdAt = new Date(folder.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white p-3 transition-colors hover:bg-zinc-50">
      <Link href={`/dashboard/${folder.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        {folder.image_url ? (
          <img
            src={folder.image_url}
            alt=""
            className="size-16 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-zinc-100 px-1 text-center text-xs font-medium text-zinc-500">
            {folder.name}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-medium text-zinc-900">{folder.name}</span>
          <span className="text-sm text-zinc-500">
            {folder.summary_count} résumé{folder.summary_count === 1 ? "" : "s"} · {createdAt}
          </span>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-1">
        <FolderDialog
          mode="edit"
          folder={folder}
          onSuccess={onUpdated}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Renommer le dossier">
              <PencilIcon />
            </Button>
          }
        />
        <DeleteFolderDialog
          folder={folder}
          onDeleted={onDeleted}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Supprimer le dossier">
              <Trash2Icon />
            </Button>
          }
        />
      </div>
    </div>
  )
}
