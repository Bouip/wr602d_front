# 🚕 Taxi Rush — Front

Endless runner 3D développé avec Three.js + Vite dans le cadre du module WR602D.

## Installation

### Prérequis
- Node.js >= 20

### Installation des dépendances

```bash
npm install
```

### Lancer le projet

```bash
npx vite
```

Ouvrir `http://localhost:5173` dans le navigateur.

### Build pour la production

```bash
npx vite build
```

## Dépendances

- **Three.js** `^0.184.0` — moteur 3D
- **Vite** `^8.0.12` — bundler

## Jouer

- **← →** : changer de voie
- **Espace** : pause / reprendre

## Structure du projet

```
src/
├── game/
│   ├── Game.js          # Boucle principale
│   ├── Scene.js         # Caméra, lumières, environnement
│   ├── Player.js        # Le taxi
│   ├── Road.js          # Route infinie
│   ├── Obstacles.js     # Obstacles
│   ├── Buildings.js     # Bâtiments
│   ├── ScoreManager.js  # Gestion des scores et niveaux
│   └── SoundManager.js  # Sound design
└── ui/
    ├── Auth.js           # Authentification
    ├── HUD.js            # Interface en jeu
    └── Menu.js           # Menus
```