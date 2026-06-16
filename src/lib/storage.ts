import type { createSupabaseServerClient } from "@/lib/supabase-server"

const FOLDER_IMAGES_BUCKET = "folder-images"
const MAX_IMAGE_SIZE = 2 * 1024 * 1024

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>

export function isValidImageFile(file: File): boolean {
  return file.type.startsWith("image/")
}

export function isImageTooLarge(file: File): boolean {
  return file.size > MAX_IMAGE_SIZE
}

function extensionFromFile(file: File): string {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : undefined
  return fromName || file.type.split("/").pop() || "jpg"
}

export async function uploadFolderImage(
  supabase: SupabaseServerClient,
  userId: string,
  file: File
): Promise<{ data: string | null; error: Error | null }> {
  const path = `${userId}/${crypto.randomUUID()}.${extensionFromFile(file)}`

  const { error } = await supabase.storage
    .from(FOLDER_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type || undefined })

  if (error) {
    return { data: null, error }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(FOLDER_IMAGES_BUCKET).getPublicUrl(path)

  return { data: publicUrl, error: null }
}

export async function deleteFolderImage(
  supabase: SupabaseServerClient,
  imageUrl: string
): Promise<{ error: Error | null }> {
  const marker = `/object/public/${FOLDER_IMAGES_BUCKET}/`
  const markerIndex = imageUrl.indexOf(marker)

  if (markerIndex === -1) {
    return { error: null }
  }

  const path = imageUrl.slice(markerIndex + marker.length)
  const { error } = await supabase.storage.from(FOLDER_IMAGES_BUCKET).remove([path])

  return { error }
}
