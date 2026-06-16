export type Folder = {
  id: string
  user_id: string
  name: string
  image_url: string | null
  created_at: string
}

export type FolderWithSummaryCount = Folder & {
  summary_count: number
}

export type AppError =
  | "INVALID_URL"
  | "NO_TRANSCRIPT"
  | "TRANSCRIPT_TOO_LONG"
  | "TRANSCRIPT_TOO_SHORT"
  | "AI_TIMEOUT"
  | "AI_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "IMAGE_TOO_LARGE"
  | "UNKNOWN"
