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

Le développement se fait sur la branche `dev`. Au merge d'une pull request dans `main`, la CI ([`build.yml`](.github/workflows/build.yml)) :

1. build le script et commit `dist/toolExtractor.user.js` sur `main` ;
2. crée une release GitHub `v<version>` à partir de la version du `package.json`.

Penser donc à bumper la version dans `package.json` avant de merger.
