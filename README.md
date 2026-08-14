# Location de salle — site de réservation

Site pour présenter votre salle et permettre aux visiteurs de vérifier les
disponibilités, envoyer une demande de réservation et payer un acompte en
ligne. Construit avec Next.js, Prisma (Postgres) et SumUp — prêt à déployer
sur Vercel.

## Fonctionnalités

- **Page vitrine** : présentation, galerie, équipements, tarifs, avis.
- **Réservation en ligne** (`/reserver`) : calendrier de disponibilité +
  formulaire de demande. Les dates déjà réservées sont grisées.
- **Espace propriétaire** (`/admin`) : liste des demandes, confirmation /
  refus, génération d'un lien de paiement SumUp, suivi des statuts.
- **Emails automatiques** (Resend) : notification au propriétaire pour
  chaque nouvelle demande, email de confirmation avec lien de paiement au
  client.
- **Paiement en ligne** (SumUp Checkout) : acompte réglable par carte via
  un lien de paiement hébergé par SumUp, mise à jour automatique du
  statut par webhook.

## 1. Personnaliser le contenu

Toutes les informations de votre salle (nom, adresse, description,
capacité, équipements, tarifs, contact, avis) se trouvent dans un seul
fichier à éditer :

```
src/lib/content.ts
```

Remplacez les photos placeholder par les vôtres dans `public/images/`
(gardez les mêmes noms de fichiers ou mettez à jour `gallery` dans
`content.ts`).

## 2. Installation

```bash
npm install
cp .env.example .env
```

Le site utilise une base Postgres (`DATABASE_URL` dans `.env`) — en local,
le plus simple est une base gratuite chez [Neon](https://neon.tech) ou
[Supabase](https://supabase.com) (quelques clics, aucune carte requise),
ou une instance Postgres locale si vous en avez déjà une.

Complétez le fichier `.env` (voir détail des variables ci-dessous), puis :

```bash
npm run db:migrate   # applique le schéma sur votre base Postgres
npm run dev            # http://localhost:3000
```

## 3. Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chaîne de connexion Postgres (`postgresql://user:password@host:5432/db?schema=public`). |
| `NEXT_PUBLIC_APP_URL` | URL publique du site (emails, redirections SumUp). |
| `ADMIN_EMAIL` | Email de connexion à `/admin`. |
| `ADMIN_PASSWORD_HASH` | Hash du mot de passe admin — généré avec `npm run hash-password -- "mot_de_passe"`. |
| `SESSION_SECRET` | Chaîne aléatoire pour signer les sessions (`openssl rand -hex 32`). |
| `SUMUP_API_KEY` | Clé API SumUp ([me.sumup.com](https://me.sumup.com) → Profil → Réglages → For Developers → Toolkit → API Keys). |
| `SUMUP_MERCHANT_CODE` | Code marchand SumUp, visible dans les réglages de votre compte. |
| `RESEND_API_KEY` | Clé API Resend ([resend.com/api-keys](https://resend.com/api-keys)). |
| `OWNER_EMAIL` | Adresse qui reçoit les notifications de nouvelle demande. |
| `RESEND_FROM_EMAIL` | Adresse d'expédition des emails (domaine vérifié sur Resend, ou `onboarding@resend.dev` pour tester). |

Un fichier `.env` de démonstration est fourni avec un compte admin
`admin@example.com` / `changeme` — **changez ce mot de passe avant toute
mise en ligne** avec :

```bash
npm run hash-password -- "votre_nouveau_mot_de_passe"
```

Sans clés SumUp/Resend, le site fonctionne quand même : les demandes de
réservation sont enregistrées et visibles dans `/admin`, seuls l'envoi
d'emails et la génération du lien de paiement sont désactivés (un message
vous le rappelle dans le dashboard).

## 4. Configurer SumUp (paiement de l'acompte)

1. Connectez-vous sur [me.sumup.com](https://me.sumup.com), ouvrez votre
   profil → Réglages → For Developers → Toolkit → API Keys, puis créez une
   clé et renseignez-la dans `SUMUP_API_KEY`.
2. Récupérez votre code marchand dans les réglages de votre compte SumUp
   et renseignez-le dans `SUMUP_MERCHANT_CODE`.
3. C'est tout : aucune configuration de webhook n'est nécessaire côté
   dashboard SumUp — l'application transmet elle-même l'URL de
   notification (`/api/webhooks/sumup`) à chaque création de lien de
   paiement.

Quand vous cliquez sur « Confirmer » dans `/admin`, un lien de paiement
hébergé par SumUp est généré pour le montant de l'acompte et envoyé au
client par email. Dès que le client paie, SumUp notifie le site qui
revérifie le statut auprès de l'API SumUp avant de marquer la réservation
comme payée.

Le pourcentage d'acompte se règle dans `src/lib/content.ts`
(`pricing.depositPercent`).

## 5. Configurer Resend (emails)

1. Créez une clé API sur [resend.com/api-keys](https://resend.com/api-keys)
   et renseignez `RESEND_API_KEY`.
2. Vérifiez votre propre domaine dans Resend pour envoyer depuis votre
   adresse (`RESEND_FROM_EMAIL`), ou utilisez `onboarding@resend.dev` pour
   tester sans domaine vérifié.

## 6. Déploiement sur Vercel

Le projet est prêt à être déployé tel quel sur [Vercel](https://vercel.com)
(`vercel.json` applique automatiquement les migrations Prisma à chaque
déploiement).

1. **Créez un compte Vercel** (gratuit) sur [vercel.com](https://vercel.com)
   en vous connectant avec votre compte GitHub.
2. Cliquez sur **Add New → Project**, puis choisissez le dépôt
   `New-festas` (celui-ci) dans la liste.
3. Avant de cliquer sur *Deploy*, ouvrez **Environment Variables** et
   ajoutez toutes les variables listées dans le tableau ci-dessus
   (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`,
   `SUMUP_API_KEY`, `SUMUP_MERCHANT_CODE`, `RESEND_API_KEY`,
   `OWNER_EMAIL`, `RESEND_FROM_EMAIL`). Laissez `NEXT_PUBLIC_APP_URL`
   pour l'instant, on la complétera après.
4. Pour `DATABASE_URL`, le plus simple est d'ajouter une base
   directement depuis Vercel : dans votre projet, onglet **Storage →
   Create Database**, choisissez **Postgres** (ou **Neon**, proposé par
   défaut sur le plan gratuit) — la variable `DATABASE_URL` est alors
   ajoutée automatiquement à votre projet.
5. Cliquez sur **Deploy**. Vercel installe les dépendances, applique les
   migrations Prisma sur votre base, puis construit et met en ligne le
   site. Vous obtenez une adresse du type
   `https://new-festas-xxxx.vercel.app`.
6. Retournez dans **Settings → Environment Variables**, mettez à jour
   `NEXT_PUBLIC_APP_URL` avec cette adresse (ou votre nom de domaine si
   vous en branchez un dans **Settings → Domains**), puis redéployez
   (**Deployments → ⋯ → Redeploy**) pour que les liens dans les emails et
   les redirections SumUp pointent au bon endroit.

Une fois en ligne, l'espace propriétaire est accessible sur
`https://votre-domaine/admin`.

> Chaque nouveau `git push` sur cette branche redéploie automatiquement
> le site sur Vercel.

## Commandes utiles

```bash
npm run dev            # serveur de développement
npm run build           # build de production
npm run start            # lance le build de production
npm run lint              # vérifie le code
npm run db:migrate      # applique les migrations Prisma
npm run db:studio        # interface graphique pour explorer la base
npm run hash-password -- "mdp"   # génère un hash pour ADMIN_PASSWORD_HASH
```
