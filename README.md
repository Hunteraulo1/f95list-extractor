# F95 France – Tool Extractor

Userscript (Tampermonkey) qui extrait les données d'un jeu depuis une page de thread **F95zone** ou **LC**, pour l'ajouter facilement à la liste F95 France.

## Installation

1. Installer l'extension [Tampermonkey](https://www.tampermonkey.net/).
2. Ouvrir le [script](https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/toolExtractor.user.js) : Tampermonkey propose automatiquement de l'installer.

Les mises à jour sont ensuite récupérées automatiquement par Tampermonkey.

## Utilisation

Sur une page de thread (`/threads/…`), un bouton **E** apparaît dans le header du site. Il ouvre un panneau avec les actions suivantes :

| Action | F95zone | LC | Description |
| --- | :---: | :---: | --- |
| Copier les tags | ✅ | ✅ | Copie les tags du jeu, séparés par des virgules |
| Copier toutes les données | ✅ | ✅ | Copie un JSON : nom, version, statut, type, tags, lien, image, description |
| Ajouter à la liste | ✅ | ✅ | Ouvre le dashboard avec les données pré-remplies (session admin requise) |
| Copier pour f95checker | ❌ | ✅ | Copie une requête SQL d'insertion / mise à jour pour la base de f95checker |

## Développement

Prérequis : [Bun](https://bun.sh/).

```bash
bun install
```

### Configuration

L'URL du dashboard est injectée au build via la variable `DASHBOARD_ORIGIN` (schéma + host + port, sans slash final). Le build échoue si elle n'est pas définie.

| Fichier | Utilisé par | Exemple |
| --- | --- | --- |
| `.env.development` | `bun run dev` | `DASHBOARD_ORIGIN=http://localhost:5173` |
| `.env` / `.env.production` | `bun run build` | voir [`.env.example`](.env.example) |

### Scripts

| Commande | Description |
| --- | --- |
| `bun run dev` | Build en mode watch (version suffixée `-dev`, non minifié) |
| `bun run build` | Build de production dans `dist/toolExtractor.user.js` |
| `bun run lint` | Lint avec Biome (corrige automatiquement) |
| `bun run format` | Formatage avec Biome |
| `bun run check` | Lint + formatage |

Pour tester en local, installer le fichier `dist/toolExtractor.user.js` généré dans Tampermonkey.

### Structure

```
src/
├── index.ts            # Point d'entrée
├── button.ts           # Bouton « E » inséré dans le header
├── panel.ts            # Panneau d'actions et ajout à la liste
├── domains/
│   ├── f95z.ts         # Extraction F95zone
│   └── lc.ts           # Extraction LC (+ export f95checker)
├── utils.ts            # Détection du site, scraping de la description
├── dashboardOrigin.ts  # URL du dashboard (injectée au build)
├── types.ts
└── style.scss
```

## Release

Le développement se fait sur la branche `dev`. La publication d'une nouvelle version est automatisée :

1. **Bumper la version** dans `package.json` (ex. `1.5.0` → `1.5.1`) en suivant [SemVer](https://semver.org/lang/fr/).
2. **Commit et push sur `dev`** :
   ```bash
   git commit -am ":bookmark: v1.5.1"
   git push origin dev
   ```
3. **PR automatique** : le workflow [`release-pr.yml`](.github/workflows/release-pr.yml) détecte le changement de version et ouvre une PR `dev → main` intitulée `:bookmark: v1.5.1` (ou met à jour la PR déjà ouverte).
4. **Merger la PR** : le workflow [`build.yml`](.github/workflows/build.yml) build le script, commit `dist/toolExtractor.user.js` sur `main` et crée la release GitHub `v1.5.1`.

Un push sur `dev` sans changement de version (ex. mise à jour de dépendances) ne crée pas de PR.

### Mise à jour chez les utilisateurs

Le script installé pointe (`@updateURL`) vers `dist/toolExtractor.user.js` sur `main`. Tampermonkey vérifie régulièrement ce fichier et installe la mise à jour dès que la `@version` (reprise du `package.json`) est supérieure à celle installée : c'est pour ça que le bump de version est indispensable.

Pour forcer la vérification : cliquer sur l'icône Tampermonkey → *Rechercher des mises à jour des scripts utilisateur*.

### Secrets GitHub requis

| Secret | Usage |
| --- | --- |
| `PERSONAL_ACCESS_TOKEN` | Création de la PR de release et push du build sur `main` (droits *Contents* et *Pull requests* en écriture) |
| `DASHBOARD_ORIGIN` | URL du dashboard injectée au build de la release |
