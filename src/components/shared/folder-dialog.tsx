"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { ImagePlusIcon } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import type { Folder } from "@/types"

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

type FolderDialogProps =
  | {
      mode: "create"
      trigger: React.ReactElement
      onSuccess: (folder: Folder) => void
    }
  | {
      mode: "edit"
      folder: Folder
      trigger: React.ReactElement
      onSuccess: (folder: Folder) => void
    }

export function FolderDialog(props: FolderDialogProps) {
  const { trigger, onSuccess } = props
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(props.mode === "edit" ? props.folder.name : "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    props.mode === "edit" ? props.folder.image_url : null
  )
  const [pending, setPending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setName(props.mode === "edit" ? props.folder.name : "")
      setImageFile(null)
      setPreviewUrl(props.mode === "edit" ? props.folder.image_url : null)
    }
    setOpen(nextOpen)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image.")
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("L'image dépasse la taille maximale autorisée (2 Mo).")
      return
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)

    const formData = new FormData()
    formData.set("name", name.trim())
    if (imageFile) {
      formData.set("image", imageFile)
    }

    const url = props.mode === "create" ? "/api/folders" : `/api/folders/${props.folder.id}`
    const method = props.mode === "create" ? "POST" : "PATCH"

    const res = await fetch(url, { method, body: formData })
    const json = await res.json()

    setPending(false)

    if (!res.ok || json.error) {
      toast.error(json.error ?? "Une erreur est survenue.")
      return
    }

    toast.success(props.mode === "create" ? "Dossier créé." : "Dossier mis à jour.")
    setOpen(false)
    onSuccess(json.data)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "Nouveau dossier" : "Renommer le dossier"}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "create"
              ? "Donnez un nom à votre dossier et ajoutez une image si vous le souhaitez."
              : "Modifiez le nom ou l'image du dossier."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="folder-name" className="text-sm font-medium">
              Nom
            </label>
            <Input
              id="folder-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Productivité"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Image (optionnel)</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-16 items-center justify-center overflow-hidden rounded-md border border-dashed border-input bg-muted text-muted-foreground transition-colors hover:bg-muted/70"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="" className="size-full object-cover" />
              ) : (
                <ImagePlusIcon className="size-5" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending || name.trim().length === 0}>
              {pending ? "Enregistrement…" : "Confirmer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
