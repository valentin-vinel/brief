import path from "node:path"
import { config } from "dotenv"
import { createBrowserClient } from "@supabase/ssr"

config({ path: path.resolve(process.cwd(), ".env.local") })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD
const APP_URL = process.env.APP_URL ?? "http://localhost:3000"

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Manque NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local"
  )
  process.exit(1)
}

if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  console.error(
    "Manque TEST_USER_EMAIL ou TEST_USER_PASSWORD dans .env.local (compte existant créé via /auth)"
  )
  process.exit(1)
}

// Stocke les cookies de session comme le ferait un navigateur, pour que
// createBrowserClient écrive le cookie sb-<ref>-auth-token avec le même
// format (encodage + chunking) que lit createSupabaseServerClient côté API.
const cookieJar = new Map<string, string>()

const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  cookies: {
    getAll: () => Array.from(cookieJar, ([name, value]) => ({ name, value })),
    setAll: (cookiesToSet) => {
      for (const { name, value } of cookiesToSet) {
        if (value) {
          cookieJar.set(name, value)
        } else {
          cookieJar.delete(name)
        }
      }
    },
  },
})

function cookieHeader(): string {
  return Array.from(cookieJar, ([name, value]) => `${name}=${value}`).join("; ")
}

async function logStep(label: string, request: () => Promise<Response>) {
  const res = await request()
  let body: unknown
  try {
    body = await res.json()
  } catch {
    body = await res.text()
  }

  console.log(`\n=== ${label} (${res.status}) ===`)
  console.log(JSON.stringify(body, null, 2))

  return { status: res.status, body }
}

async function main() {
  console.log(`Connexion en tant que ${TEST_USER_EMAIL}...`)

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: TEST_USER_EMAIL as string,
    password: TEST_USER_PASSWORD as string,
  })

  if (signInError) {
    console.error("Échec de connexion Supabase:", signInError.message)
    process.exit(1)
  }

  console.log("Connecté, cookies de session récupérés.")

  await logStep("GET /api/folders", () =>
    fetch(`${APP_URL}/api/folders`, {
      headers: { Cookie: cookieHeader() },
    })
  )

  const createForm = new FormData()
  createForm.set("name", "Test")

  const created = await logStep("POST /api/folders", () =>
    fetch(`${APP_URL}/api/folders`, {
      method: "POST",
      headers: { Cookie: cookieHeader() },
      body: createForm,
    })
  )

  const folderId = (created.body as { data?: { id?: string } } | null)?.data?.id

  if (!folderId) {
    console.error("\nPas d'id de dossier renvoyé par POST /api/folders, arrêt des tests.")
    await supabase.auth.signOut()
    process.exit(1)
  }

  const renameForm = new FormData()
  renameForm.set("name", "Test renommé")

  await logStep(`PATCH /api/folders/${folderId}`, () =>
    fetch(`${APP_URL}/api/folders/${folderId}`, {
      method: "PATCH",
      headers: { Cookie: cookieHeader() },
      body: renameForm,
    })
  )

  await logStep(`DELETE /api/folders/${folderId}`, () =>
    fetch(`${APP_URL}/api/folders/${folderId}`, {
      method: "DELETE",
      headers: { Cookie: cookieHeader() },
    })
  )

  await supabase.auth.signOut()
}

main()
