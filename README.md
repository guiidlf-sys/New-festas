# Location de salle — site de réservation

Site pour présenter votre salle et permettre aux visiteurs de vérifier les
disponibilités, envoyer une demande de réservation et payer un acompte en
ligne. Construit avec Next.js, Prisma (SQLite) et SumUp.

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

Complétez le fichier `.env` (voir détail des variables ci-dessous), puis :

```bash
npm run db:migrate   # crée la base SQLite locale (dev.db)
npm run dev           # http://localhost:3000
```

## 3. Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | Base SQLite locale, par défaut `file:./dev.db`. |
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
