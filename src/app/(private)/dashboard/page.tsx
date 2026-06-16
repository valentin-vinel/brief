"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderDialog } from "@/components/shared/folder-dialog"
import { FolderRow } from "@/components/shared/folder-row"
import type { Folder, FolderWithSummaryCount } from "@/types"

export default function DashboardPage() {
  const [folders, setFolders] = useState<FolderWithSummaryCount[] | null>(null)

  useEffect(() => {
    let active = true

    fetch("/api/folders")
      .then((res) => res.json())
      .then((json) => {
        if (!active) return
        if (json.error) {
          toast.error(json.error)
          setFolders([])
          return
        }
        setFolders(json.data)
      })
      .catch(() => {
        if (active) {
          toast.error("Impossible de charger les dossiers.")
          setFolders([])
        }
      })

    return () => {
      active = false
    }
  }, [])

  function handleCreated(folder: Folder) {
    setFolders((prev) => [{ ...folder, summary_count: 0 }, ...(prev ?? [])])
  }

  function handleUpdated(folder: Folder) {
    setFolders((prev) => (prev ?? []).map((f) => (f.id === folder.id ? { ...f, ...folder } : f)))
  }

  function handleDeleted(id: string) {
    setFolders((prev) => (prev ?? []).filter((f) => f.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Mes dossiers</h1>
        <FolderDialog
          mode="create"
          onSuccess={handleCreated}
          trigger={
            <Button>
              <PlusIcon />
              Nouveau dossier
            </Button>
          }
        />
      </div>

      {folders === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
          ))}
        </div>
      ) : folders.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Aucun dossier pour l&apos;instant. Créez-en un pour organiser vos résumés.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {folders.map((folder) => (
            <FolderRow
              key={folder.id}
              folder={folder}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
