import { redirect } from "next/navigation"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col items-center px-4">
      {/* Hero */}
      <div className="flex flex-col items-center text-center py-24 max-w-2xl w-full">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">
          Résumez vos vidéos YouTube en quelques secondes
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl mb-8 leading-relaxed">
          Brief extrait le transcript de n'importe quelle vidéo YouTube et génère
          un résumé structuré en français — avec des points actionnables et les
          moments clés.
        </p>
        <Button asChild size="lg">
          <Link href="/auth?mode=signup">Commencer gratuitement</Link>
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-3xl w-full text-left mb-20">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-zinc-900">Résumé en prose</span>
          <p className="text-sm text-zinc-500">
            3 à 5 paragraphes clairs et directs, toujours en français quelle
            que soit la langue de la vidéo.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-zinc-900">Points actionnables</span>
          <p className="text-sm text-zinc-500">
            Ce que vous pouvez faire ou retenir concrètement après avoir regardé
            la vidéo.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-zinc-900">Timestamps clés</span>
          <p className="text-sm text-zinc-500">
            Les moments importants de la vidéo avec des liens directs pour y
            accéder en un clic.
          </p>
        </div>
      </div>

      {/* Demo */}
      <div className="w-full max-w-3xl mb-24">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-6 text-center">
          Exemple de résultat
        </p>

        {/* Fake input bar */}
        <div className="flex gap-2 mb-8">
          <Input
            disabled
            value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="bg-zinc-50 text-zinc-400 cursor-not-allowed"
          />
          <Button disabled>Résumer</Button>
        </div>

        {/* Fake result card */}
        <div className="border rounded-xl bg-white p-6 flex flex-col gap-6">
          {/* Video header */}
          <div className="flex flex-col gap-4 items-start lg:flex-row">
            <div className="w-32 h-18 shrink-0 rounded-md bg-zinc-100 overflow-hidden">
              {/* Thumbnail placeholder */}
              <div className="w-full h-full bg-linear-to-br from-zinc-200 to-zinc-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <h2 className="font-semibold text-zinc-900 text-base leading-snug">
                Comment construire des habitudes durables — les 4 lois du changement de comportement
              </h2>
              <p className="text-xs text-zinc-400">Atomic Habits · James Clear · 18 min</p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Résumé
            </h3>
            <div className="flex flex-col gap-3 text-sm text-zinc-700 leading-relaxed">
              <p>
                James Clear explique que les habitudes ne se forment pas par motivation ou
                volonté, mais par la répétition de petits comportements ancrés dans un système
                clair. Il introduit le concept des « 1 % de mieux » : des améliorations
                marginales quotidiennes qui, composées sur un an, produisent des résultats
                remarquables.
              </p>
              <p>
                Le cœur de la méthode repose sur quatre lois : rendre le comportement
                évident, attrayant, facile et satisfaisant. Chaque loi correspond à l'un des
                quatre stades de formation d'une habitude — signal, envie, réponse,
                récompense. Inversement, pour briser une mauvaise habitude, il suffit
                d'inverser chacune de ces lois.
              </p>
              <p>
                Clear insiste sur l'importance de l'identité : les habitudes durables naissent
                quand on se définit par le type de personne qu'on veut devenir plutôt que par
                les objectifs qu'on cherche à atteindre. Chaque action devient alors un vote
                pour cette identité souhaitée.
              </p>
            </div>
          </div>

          {/* Action points */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Points actionnables
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                "Définissez votre identité cible avant de fixer un objectif : « Je suis quelqu'un qui lit chaque jour » plutôt que « Je veux lire 12 livres ».",
                "Appliquez l'empilement d'habitudes : associez un nouveau comportement à une routine existante (après le café → 10 minutes de lecture).",
                "Réduisez la friction à zéro : préparez la veille tout ce dont vous aurez besoin pour exécuter l'habitude le lendemain matin.",
              ].map((point, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-500">
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Timestamps */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Moments clés
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Introduction aux 1 %", seconds: 42 },
                { label: "Les 4 lois du changement", seconds: 214 },
                { label: "L'identité comme levier", seconds: 731 },
              ].map(({ label, seconds }) => (
                <a
                  key={seconds}
                  href={`https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${seconds}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
                    {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
                  </Badge>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
