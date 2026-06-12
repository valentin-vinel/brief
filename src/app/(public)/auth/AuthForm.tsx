"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Mode = "login" | "signup"

export default function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode: Mode = searchParams.get("mode") === "signup" ? "signup" : "login"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)

    const supabase = createSupabaseBrowserClient()

    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        setError(authError.message)
        setPending(false)
        return
      }
      router.push("/dashboard")
      router.refresh()
    } else {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authError) {
        setError(authError.message)
        setPending(false)
        return
      }
      setSignupDone(true)
      setPending(false)
    }
  }

  function switchMode() {
    setError(null)
    setSignupDone(false)
    router.push(mode === "login" ? "/auth?mode=signup" : "/auth")
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Connectez-vous pour accéder à vos résumés."
              : "Créez un compte pour commencer à résumer des vidéos."}
          </CardDescription>
        </CardHeader>

        {signupDone ? (
          <CardContent>
            <p className="text-sm text-zinc-600">
              Un email de confirmation vous a été envoyé. Vérifiez votre boîte
              mail pour activer votre compte.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
                  {error}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={pending}>
                {pending
                  ? "Chargement…"
                  : mode === "login"
                  ? "Se connecter"
                  : "Créer un compte"}
              </Button>
              <button
                type="button"
                onClick={switchMode}
                className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                {mode === "login"
                  ? "Pas encore de compte ? S'inscrire"
                  : "Déjà un compte ? Se connecter"}
              </button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
