# TASKS.md — Tâches atomiques

> Une tâche = une chose testable = un prompt Claude Code.
> Toujours donner CLAUDE.md + SPEC.md en contexte.
> Ne pas passer à la suivante sans avoir testé la précédente.
> Cocher au fur et à mesure.

---

## 🔧 Setup

- [ ] Installer les dépendances : `npm install @supabase/supabase-js @supabase/ssr @google/generative-ai youtube-transcript`
- [ ] Installer shadcn/ui : `npx shadcn@latest init` puis ajouter les composants : `button input card badge skeleton toast dialog`
- [ ] Créer le `.env.local` depuis `.env.example` et remplir les variables
- [ ] Configurer les clients Supabase dans `src/lib/supabase.ts` (server + browser)

## 🔐 Auth

- [ ] Créer la page `/auth` avec formulaire login + signup email/password (Supabase Auth)
- [ ] Créer le hook `useAuth.ts` (session, user, logout)
- [ ] Créer le middleware Next.js — protège les routes `(private)/*`, redirect `/auth` si pas de session
- [ ] Tester : accès `/dashboard` sans session → redirect `/auth` ✓

## 🏠 Landing page `/`

- [ ] Layout public avec header (logo + bouton login)
- [ ] Page d'accueil qui présente l'app
- [ ] Si session active → redirect automatique vers `/dashboard`

## 📁 Dossiers — API

- [ ] `GET /api/folders` — retourne les dossiers de l'user avec le nombre de résumés
- [ ] `POST /api/folders` — crée un dossier (multipart : name + image optionnelle → upload Supabase Storage)
- [ ] `PATCH /api/folders/[id]` — renomme ou change l'image d'un dossier
- [ ] `DELETE /api/folders/[id]` — supprime le dossier, ses résumés et son image Storage
- [ ] Tester chaque route avec un client REST (ex: Bruno, Insomnia)

## 📁 Dossiers — UI

- [ ] Page `/dashboard` avec la liste des dossiers
- [ ] Carte dossier : image si disponible, sinon nom centré dans une div de même taille
- [ ] Bouton créer un dossier → dialog (nom + upload image optionnel)
- [ ] Renommer un dossier (inline ou dialog)
- [ ] Supprimer un dossier → confirmation explicite avant suppression
- [ ] Tester : créer, renommer, supprimer un dossier ✓

## 🎬 Transcript YouTube — lib

- [ ] Fonction `extractVideoId(url)` — supporte youtube.com/watch, youtu.be, shorts, embed
- [ ] Fonction `getVideoMetadata(videoId)` — titre + thumbnail via oEmbed (sans API key)
- [ ] Fonction `getTranscript(url)` — extrait le transcript, valide longueur min/max
- [ ] Gérer les erreurs : INVALID_URL, NO_TRANSCRIPT, TRANSCRIPT_TOO_LONG, TRANSCRIPT_TOO_SHORT
- [ ] Tester avec 3 vidéos : courte, longue, sans sous-titres

## 🤖 Gemini — lib

- [ ] Fonction `summarize(transcript, title)` dans `src/lib/ai.ts`
- [ ] Prompt structuré → réponse JSON `{ summary, action_points, timestamps }`
- [ ] Résumé toujours demandé en français dans le prompt
- [ ] Gérer timeout et erreurs API (AI_TIMEOUT, AI_ERROR)
- [ ] Tester avec un transcript réel et vérifier la qualité du JSON retourné

## 📝 Résumé — API

- [ ] `POST /api/summarize` — auth, validation URL, cache check, orchestration complète
- [ ] `PATCH /api/summaries/[id]` — déplacer un résumé vers un autre dossier
- [ ] `GET /api/history` — 20 derniers résumés de l'user
- [ ] Tester le cache : résumer deux fois la même vidéo → retourne le résumé existant ✓

## 📝 Résumé — UI

- [ ] Champ URL + sélecteur de dossier + bouton "Résumer" sur `/dashboard`
- [ ] Loading state pendant le traitement (~5-15s)
- [ ] Gestion des erreurs utilisateur (messages clairs depuis `utils.ts`)
- [ ] Page `/dashboard/summary/[id]` — titre, thumbnail, résumé, points actionnables, timestamps
- [ ] Timestamps cliquables → lien youtube.com/watch?v=xxx&t=yyy
- [ ] Badge "Déjà résumé" si retour depuis le cache
- [ ] Bouton déplacer le résumé vers un autre dossier

## 🧹 Edge cases & polish

- [ ] Message clair si pas de sous-titres disponibles
- [ ] Message si vidéo trop longue
- [ ] Message si transcript trop court
- [ ] Toast succès/erreur sur chaque action
- [ ] Limite 2MB sur l'upload d'image côté client (avant envoi)
- [ ] Responsive mobile sur toutes les pages

## 🚀 Déploiement

- [ ] Variables d'env configurées sur Vercel
- [ ] Vérifier la limite de durée des fonctions Vercel (Hobby = 60s sur App Router)
- [ ] Test end-to-end en production
- [ ] README à jour avec screenshots