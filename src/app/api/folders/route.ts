import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { errorResponse } from "@/lib/utils"
import { isImageTooLarge, isValidImageFile, uploadFolderImage } from "@/lib/storage"
import type { Folder, FolderWithSummaryCount } from "@/types"

// Supabase client has no generated Database types in this project, so the
// embedded `summaries(count)` aggregate isn't inferred — shape it explicitly.
type FolderRow = Folder & { summaries: { count: number }[] }

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return errorResponse("UNAUTHORIZED")
  }

  const { data, error } = await supabase
    .from("folders")
    .select("id, user_id, name, image_url, created_at, summaries(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return errorResponse("UNKNOWN")
  }

  const folders: FolderWithSummaryCount[] = (data as FolderRow[]).map((folder) => {
    const { summaries, ...rest } = folder
    return { ...rest, summary_count: summaries[0]?.count ?? 0 }
  })

  return NextResponse.json({ data: folders, error: null })
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return errorResponse("UNAUTHORIZED")
  }

  const formData = await request.formData()
  const name = formData.get("name")
  const image = formData.get("image")

  if (typeof name !== "string" || name.trim().length === 0) {
    return errorResponse("VALIDATION_ERROR")
  }

  let imageUrl: string | null = null

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

    if (uploadError) {
      return errorResponse("UNKNOWN")
    }

    imageUrl = uploadedUrl
  }

  const { data, error } = await supabase
    .from("folders")
    .insert({ user_id: user.id, name: name.trim(), image_url: imageUrl })
    .select("id, user_id, name, image_url, created_at")
    .single()

  if (error) {
    return errorResponse("UNKNOWN")
  }

  return NextResponse.json({ data, error: null })
}
