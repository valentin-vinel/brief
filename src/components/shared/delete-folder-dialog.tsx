"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { FolderWithSummaryCount } from "@/types"

type DeleteFolderDialogProps = {
  folder: FolderWithSummaryCount
  trigger: React.ReactElement
  onDeleted: (id: string) => void
}

export function DeleteFolderDialog({ folder, trigger, onDeleted }: DeleteFolderDialogProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleDelete() {
    setPending(true)
    const res = await fetch(`/api/folders/${folder.id}`, { method: "DELETE" })
    const json = await res.json()
    setPending(false)

    if (!res.ok || json.error) {
      toast.error(json.error ?? "Une erreur est survenue.")
      return
    }

    toast.success("Dossier supprimé.")
    setOpen(false)
    onDeleted(folder.id)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer « {folder.name} » ?</DialogTitle>
          <DialogDescription>
            {folder.summary_count > 0
              ? `Ce dossier contient ${folder.summary_count} résumé${folder.summary_count > 1 ? "s" : ""}. Cette action est irréversible et les supprimera également.`
              : "Cette action est irréversible."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending ? "Suppression…" : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
