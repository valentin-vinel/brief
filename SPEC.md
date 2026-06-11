# SPEC.md — YouTube Summarizer

## Ce que fait l'app

Un utilisateur connecté colle une URL YouTube, l'app récupère le transcript et génère un résumé structuré, actionnable, avec des références aux timestamps importants. Les résumés sont en français (traduits si la vidéo est dans une autre langue). Les résumés sont organisés dans des dossiers créés par l'utilisateur.

---

## Ce que l'app ne fait PAS (hors scope v1)

- Pas de résumé de playlists
- Pas de partage public de résumés
- Pas d'export PDF
- Pas de résumé de vidéos sans transcript disponible
- Pas de choix du LLM par l'utilisateur (prévu en v2)

---

## User flows

### Flow principal
1. L'utilisateur arrive sur `/` — page d'accueil publique qui présente l'app
2. Bouton login / sign up classique en header
3. Si token valide déjà en session → redirect automatique vers `/dashboard`
4. Sinon la page d'accueil s'affiche normalement

### Flow dashboard
1. `/dashboard` — espace principal de l'utilisateur connecté
2. Liste de ses dossiers (avec image ou nom centré si pas d'image)
3. Il peut créer / renommer / supprimer un dossier
4. Il peut déplacer un résumé d'un dossier à un autre
5. Supprimer un dossier supprime les résumés qu'il contient (avec confirmation explicite)

### Flow résumé
1. Depuis `/dashboard`, l'user colle une URL YouTube
2. Il choisit un dossier de destination (ou en crée un à la volée)
3. Il clique "Résumer"
4. Loading state pendant le traitement (~5-15s)
5. Redirect vers `/dashboard/summary/[id]`

### Flow auth
1. `/auth` → formulaire email + password (Supabase Auth)
2. Après login → redirect vers `/dashboard`

---

## Ce que l'app affiche sur `/dashboard/summary/[id]`

- Titre de la vidéo + thumbnail
- Résumé en prose en français (3-5 paragraphes, clair et direct)
- Points actionnables (3-5 bullet points — ce que l'utilisateur peut faire/retenir concrètement)
- Timestamps clés (moments importants avec lien direct youtube.com/watch?v=xxx&t=yyy)
- Lien vers la vidéo originale
- Dossier d'appartenance + date du résumé

---

## Schéma DB (PostgreSQL / Supabase)

### `folders`
| colonne     | type        | notes |
|-------------|-------------|-------|
| id          | uuid PK     | |
| user_id     | uuid FK → auth.users | |
| name        | text        | |
| image_url   | text        | nullable — URL Supabase Storage |
| created_at  | timestamptz | |

### `summaries`
| colonne          | type        | notes |
|------------------|-------------|-------|
| id               | uuid PK     | |
| user_id          | uuid FK → auth.users | |
| folder_id        | uuid FK → folders | nullable |
| youtube_url      | text        | |
| video_id         | text        | pour le cache (unique par user) |
| video_title      | text        | |
| video_thumbnail  | text        | |
| summary_text     | text        | prose du résumé en français |
| action_points    | text[]      | points actionnables en français |
| timestamps       | jsonb       | [{ label: string, seconds: number }] |
| created_at       | timestamptz | |

---

## API Routes

### POST `/api/summarize`
- Auth requise
- Body : `{ url: string, folder_id?: string }`
- Cache check : si la vidéo a déjà été résumée par cet user → retourne le résumé existant
- Sinon : extrait transcript → envoie à Gemini → sauvegarde → retourne
- Erreurs gérées : URL invalide, pas de transcript, vidéo trop longue, timeout

### GET `/api/folders`
- Auth requise
- Retourne tous les dossiers de l'user avec le nombre de résumés dedans

### POST `/api/folders`
- Auth requise
- Body : `multipart/form-data` — `{ name: string, image?: File }`
- Upload image vers Supabase Storage si fournie

### PATCH `/api/folders/[id]`
- Auth requise
- Body : `multipart/form-data` — `{ name?: string, image?: File }`

### DELETE `/api/folders/[id]`
- Auth requise
- Supprime le dossier, ses résumés et l'image dans Storage si elle existe

### PATCH `/api/summaries/[id]`
- Auth requise
- Body : `{ folder_id: string | null }` — déplacer un résumé vers un autre dossier

### GET `/api/history`
- Auth requise
- Retourne les 20 derniers résumés de l'user (tous dossiers confondus)

---

## LLM

- **Gemini 1.5 Flash** via Google AI API (free tier : 1500 req/jour)
- Toute la logique LLM est isolée dans `src/lib/ai.ts` pour permettre de brancher d'autres modèles en v2
- Les résumés sont toujours générés en français, quelle que soit la langue de la vidéo

---

## Edge cases à gérer

- URL YouTube invalide ou non reconnue
- Vidéo sans transcript (pas de sous-titres)
- Vidéo trop longue (transcript > 7500 mots)
- Transcript trop court (< 100 mots)
- Vidéo déjà résumée → retourner le cache avec badge "Déjà résumé"
- Timeout Gemini API
- Suppression d'un dossier non vide → confirmation explicite
- folder_id invalide ou qui n'appartient pas à l'user
- Image de dossier trop lourde → limiter à 2MB côté client et serveur