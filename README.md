# Location de salle — site de réservation

Site pour présenter votre salle et permettre aux visiteurs de vérifier les
disponibilités, envoyer une demande de réservation et payer un acompte en
ligne. Construit avec Next.js, Prisma (SQLite) et Stripe.

## Fonctionnalités

- **Page vitrine** : présentation, galerie, équipements, tarifs, avis.
- **Réservation en ligne** (`/reserver`) : calendrier de disponibilité +
  formulaire de demande. Les dates déjà réservées sont grisées.
- **Espace propriétaire** (`/admin`) : liste des demandes, confirmation /
  refus, génération d'un lien de paiement Stripe, suivi des statuts.
- **Emails automatiques** (Resend) : notification au propriétaire pour
  chaque nouvelle demande, email de confirmation avec lien de paiement au
  client.
- **Paiement en ligne** (Stripe Checkout) : acompte réglable par carte,
  webhook pour marquer la réservation payée automatiquement.

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

Complétez le fichier `.env` (voir détail des variables ci-dessous), puis :

```bash
npm run db:migrate   # crée la base SQLite locale (dev.db)
npm run dev           # http://localhost:3000
```

## 3. Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | Base SQLite locale, par défaut `file:./dev.db`. |
| `NEXT_PUBLIC_APP_URL` | URL publique du site (emails, redirections Stripe). |
| `ADMIN_EMAIL` | Email de connexion à `/admin`. |
| `ADMIN_PASSWORD_HASH` | Hash du mot de passe admin — généré avec `npm run hash-password -- "mot_de_passe"`. |
| `SESSION_SECRET` | Chaîne aléatoire pour signer les sessions (`openssl rand -hex 32`). |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe ([dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)). |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe (`/api/webhooks/stripe`). |
| `RESEND_API_KEY` | Clé API Resend ([resend.com/api-keys](https://resend.com/api-keys)). |
| `OWNER_EMAIL` | Adresse qui reçoit les notifications de nouvelle demande. |
| `RESEND_FROM_EMAIL` | Adresse d'expédition des emails (domaine vérifié sur Resend, ou `onboarding@resend.dev` pour tester). |

Un fichier `.env` de démonstration est fourni avec un compte admin
`admin@example.com` / `changeme` — **changez ce mot de passe avant toute
mise en ligne** avec :

```bash
npm run hash-password -- "votre_nouveau_mot_de_passe"
```

Sans clés Stripe/Resend, le site fonctionne quand même : les demandes de
réservation sont enregistrées et visibles dans `/admin`, seuls l'envoi
d'emails et la génération du lien de paiement sont désactivés (un message
vous le rappelle dans le dashboard).

## 4. Configurer Stripe (paiement de l'acompte)

1. Récupérez votre clé secrète sur
   [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) et
   renseignez `STRIPE_SECRET_KEY`.
2. Créez un endpoint de webhook pointant vers
   `https://votre-domaine.com/api/webhooks/stripe`, événement
   `checkout.session.completed`, puis copiez le secret de signature dans
   `STRIPE_WEBHOOK_SECRET`.
3. En local, utilisez le [Stripe CLI](https://stripe.com/docs/stripe-cli)
   pour tester : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

Le pourcentage d'acompte se règle dans `src/lib/content.ts`
(`pricing.depositPercent`).

## 5. Configurer Resend (emails)

1. Créez une clé API sur [resend.com/api-keys](https://resend.com/api-keys)
   et renseignez `RESEND_API_KEY`.
2. Vérifiez votre propre domaine dans Resend pour envoyer depuis votre
   adresse (`RESEND_FROM_EMAIL`), ou utilisez `onboarding@resend.dev` pour
   tester sans domaine vérifié.

## 6. Déploiement

Le projet est un site Next.js standard (App Router). Il peut être déployé
sur Vercel ou tout hébergeur supportant Next.js.

> **Important** : la base SQLite (`dev.db`) est un simple fichier sur
> disque. Elle convient pour un déploiement sur un serveur/VPS classique
> avec disque persistant, mais **pas** pour un hébergement serverless
> (Vercel, etc.) où le système de fichiers n'est pas persistant. Pour un
> déploiement serverless, remplacez SQLite par une base Postgres : changez
> `provider = "sqlite"` en `provider = "postgresql"` dans
> `prisma/schema.prisma`, utilisez l'adapter `@prisma/adapter-pg` dans
> `src/lib/prisma.ts`, et pointez `DATABASE_URL` vers votre base Postgres
> (voir la doc Prisma pour le détail de la migration).

Pensez à définir toutes les variables d'environnement ci-dessus chez votre
hébergeur, et à mettre à jour `NEXT_PUBLIC_APP_URL` avec votre domaine
final.

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
