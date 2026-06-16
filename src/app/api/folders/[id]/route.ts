import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { errorResponse } from "@/lib/utils"
import {
  deleteFolderImage,
  isImageTooLarge,
  isValidImageFile,
  uploadFolderImage,
} from "@/lib/storage"

type RouteParams = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return errorResponse("UNAUTHORIZED")
  }

  const { data: folder, error: fetchError } = await supabase
    .from("folders")
    .select("id, image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (fetchError) {
    return errorResponse("UNKNOWN")
  }

  if (!folder) {
    return errorResponse("NOT_FOUND")
  }

  const formData = await request.formData()
  const name = formData.get("name")
  const image = formData.get("image")

  const updates: { name?: string; image_url?: string | null } = {}

  if (typeof name === "string") {
    if (name.trim().length === 0) {
      return errorResponse("VALIDATION_ERROR")
    }
    updates.name = name.trim()
  }

  if (image instanceof File && image.size > 0) {
    if (!isValidImageFile(image)) {
      return errorResponse("VALIDATION_ERROR")
    }

    if (isImageTooLarge(image)) {
      return errorResponse("IMAGE_TOO_LARGE")
    }

    const { data: uploadedUrl, error: uploadError } = await uploadFolderImage(
      supabase,
      user.id,
      image
    )

    if (uploadError || !uploadedUrl) {
      return errorResponse("UNKNOWN")
    }

    if (folder.image_url) {
      await deleteFolderImage(supabase, folder.image_url)
    }

    updates.image_url = uploadedUrl
  }

  if (Object.keys(updates).length === 0) {
    return errorResponse("VALIDATION_ERROR")
  }

  const { data, error } = await supabase
    .from("folders")
    .update(updates)
    .eq("id", id)
    .select("id, user_id, name, image_url, created_at")
    .single()

  if (error) {
    return errorResponse("UNKNOWN")
  }

  return NextResponse.json({ data, error: null })
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return errorResponse("UNAUTHORIZED")
  }

  const { data: folder, error: fetchError } = await supabase
    .from("folders")
    .select("id, image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (fetchError) {
    return errorResponse("UNKNOWN")
  }

  if (!folder) {
    return errorResponse("NOT_FOUND")
  }

  const { error: deleteSummariesError } = await supabase
    .from("summaries")
    .delete()
    .eq("folder_id", id)
    .eq("user_id", user.id)

  if (deleteSummariesError) {
    return errorResponse("UNKNOWN")
  }

  const { error: deleteFolderError } = await supabase.from("folders").delete().eq("id", id)

  if (deleteFolderError) {
    return errorResponse("UNKNOWN")
  }

  if (folder.image_url) {
    await deleteFolderImage(supabase, folder.image_url)
  }

  return NextResponse.json({ data: null, error: null })
}
