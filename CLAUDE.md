@AGENTS.md

# CLAUDE.md — Contexte projet pour Claude Code

> Lire ce fichier en entier avant de toucher au code.
> Lire aussi SPEC.md pour le détail fonctionnel.

---

## Stack

- **Framework** : Next.js 16, App Router, TypeScript strict
- **Auth + DB + Storage** : Supabase
- **Styling** : Tailwind CSS v4 + shadcn/ui
- **LLM** : Gemini 1.5 Flash (Google AI API)
- **Transcripts** : `youtube-transcript` npm package
- **Package manager** : npm
- **Déploiement** : Vercel

---

## Structure des dossiers

```
src/
  app/
    (public)/         → pages publiques sans auth (landing, auth)
      page.tsx        → page d'accueil
      auth/
        page.tsx      → login / signup
    (private)/        → pages protégées, layout vérifie la session
      dashboard/
        page.tsx      → espace principal user
        summary/
          [id]/
            page.tsx  → page d'un résumé
    api/              → Route Handlers (pas de logique métier ici, déléguer à lib/)
      summarize/
        route.ts
      folders/
        route.ts
        [id]/
          route.ts
      summaries/
        [id]/
          route.ts
      history/
        route.ts
  components/
    ui/               → composants shadcn/ui (ne jamais modifier)
    shared/           → composants réutilisables du projet
  lib/
    supabase.ts       → clients Supabase server et browser
    ai.ts             → logique LLM (Gemini) — isolée pour permettre swap futur
    youtube.ts        → extraction transcript + métadonnées
    utils.ts          → helpers génériques (formatage, messages d'erreur)
  hooks/
    useAuth.ts        → session, user, logout
  types/
    index.ts          → tous les types TypeScript du projet
supabase/
  migrations/         → SQL versionnés, ne jamais modifier un fichier existant
```

---

## Conventions de code

- **TypeScript strict** — pas de `any`, pas de `as` sauf cas exceptionnel justifié en commentaire
- **Gestion d'erreurs** — toutes les fonctions async retournent `{ data, error }`, jamais de try/catch silencieux
- **Server vs Client** — tout est Server Component par défaut ; `"use client"` uniquement si event handlers ou hooks
- **Variables d'env** — `NEXT_PUBLIC_` uniquement pour ce qui doit être exposé au client
- **Commits** — Conventional Commits : `feat:`, `fix:`, `chore:`, `refactor:`
- **Nommage** — camelCase variables/fonctions, PascalCase composants/types, kebab-case fichiers

---

## Routes handlers — règles

- Toujours vérifier l'auth en premier
- Toujours valider le body avant de faire quoi que ce soit
- Retourner des messages d'erreur lisibles (définis dans `lib/utils.ts`)
- Ne jamais mettre de logique métier dans les routes — déléguer à `lib/`

---

## Supabase — règles

- `createSupabaseServerClient()` dans les Server Components et Route Handlers
- `createSupabaseBrowserClient()` dans les Client Components uniquement
- Les images Storage sont uploadées sous le chemin `user_id/filename`
- Ne jamais exposer la service role key côté client

---

## LLM — règles

- Toute la logique Gemini est dans `src/lib/ai.ts` uniquement
- Les résumés sont toujours demandés en français dans le prompt, quelle que soit la langue de la vidéo
- La réponse attendue est du JSON strict : `{ summary, action_points, timestamps }`

---

## Types principaux

```ts
type Folder = {
  id: string
  user_id: string
  name: string
  image_url: string | null
  created_at: string
}

type Summary = {
  id: string
  user_id: string
  folder_id: string | null
  youtube_url: string
  video_id: string
  video_title: string
  video_thumbnail: string | null
  summary_text: string
  action_points: string[]
  timestamps: { label: string; seconds: number }[]
  created_at: string
}

type AppError =
  | "INVALID_URL"
  | "NO_TRANSCRIPT"
  | "TRANSCRIPT_TOO_LONG"
  | "TRANSCRIPT_TOO_SHORT"
  | "AI_TIMEOUT"
  | "AI_ERROR"
  | "UNAUTHORIZED"
  | "UNKNOWN"
```

---

## Ce qu'on ne fait PAS dans ce projet

- Pas de résumé de playlists
- Pas de partage public de résumés
- Pas d'export PDF
- Pas de choix du LLM par l'utilisateur (prévu v2)