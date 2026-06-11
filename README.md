# brief.so - youtube summarizer

Colle une URL YouTube, reçois un résumé structuré en français — points actionnables et timestamps clés inclus.

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

---

## Features

- 🎬 Résumé de n'importe quelle vidéo YouTube avec transcript
- 🇫🇷 Résumés toujours générés en français
- ✅ Points actionnables et timestamps cliquables
- 📁 Organisation des résumés par dossiers
- 🔐 Authentification email / password
- ⚡ Cache — une vidéo déjà résumée ne repart pas en génération

---

## Stack

| Rôle | Techno |
|---|---|
| Framework | Next.js 16 App Router |
| Auth + DB + Storage | Supabase |
| LLM | Gemini 1.5 Flash |
| Transcripts | youtube-transcript |
| UI | Tailwind CSS v4 + shadcn/ui |
| Déploiement | Vercel |

---

## Installation

```bash
git clone https://github.com/ton-user/brief
cd brief
npm install
cp .env.example .env.local
```

Remplis `.env.local` avec tes clés :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

Lance le serveur de dev :

```bash
npm run dev
```

---

## Base de données

Applique les migrations dans Supabase SQL Editor dans l'ordre :

```
supabase/migrations/001_init.sql
supabase/migrations/002_storage.sql
```

---

## Variables d'environnement

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de ton projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `GEMINI_API_KEY` | Clé API Google AI Studio |