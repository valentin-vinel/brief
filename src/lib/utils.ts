import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextResponse } from "next/server"
import type { AppError } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ERROR_MESSAGES: Record<AppError, string> = {
  INVALID_URL: "L'URL YouTube n'est pas valide.",
  NO_TRANSCRIPT: "Cette vidéo n'a pas de transcript disponible.",
  TRANSCRIPT_TOO_LONG: "Cette vidéo est trop longue pour être résumée.",
  TRANSCRIPT_TOO_SHORT: "Cette vidéo est trop courte pour être résumée.",
  AI_TIMEOUT: "Le résumé a pris trop de temps, réessaie plus tard.",
  AI_ERROR: "Une erreur est survenue pendant la génération du résumé.",
  UNAUTHORIZED: "Tu dois être connecté pour effectuer cette action.",
  NOT_FOUND: "Ressource introuvable.",
  VALIDATION_ERROR: "Les données envoyées sont invalides.",
  IMAGE_TOO_LARGE: "L'image dépasse la taille maximale autorisée (2 Mo).",
  UNKNOWN: "Une erreur inattendue est survenue.",
}

const STATUS_BY_ERROR: Record<AppError, number> = {
  INVALID_URL: 400,
  NO_TRANSCRIPT: 422,
  TRANSCRIPT_TOO_LONG: 422,
  TRANSCRIPT_TOO_SHORT: 422,
  AI_TIMEOUT: 504,
  AI_ERROR: 502,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  IMAGE_TOO_LARGE: 413,
  UNKNOWN: 500,
}

export function errorResponse(code: AppError) {
  return NextResponse.json(
    { data: null, error: ERROR_MESSAGES[code] },
    { status: STATUS_BY_ERROR[code] }
  )
}
