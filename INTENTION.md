# VROUM VROUM — Note d'intention

## But du jeu

VROUM VROUM est un jeu de type endless runner en 3D développé avec Three.js.
Le joueur incarne un petit kart qui doit conduire dans les rues de la ville en évitant les obstacles (
cartons, camions etc).
Plus le joueur avance, plus la vitesse augmente et la difficulté aussi.

## Choix de game design

### Système de déplacement
Le kart se déplace sur 3 voies (gauche, centre, droite) avec les touches fléchées.

### Score
Le score augmente automatiquement avec la distance parcourue.

### Vies
Le joueur possède de 3 vies. Chaque collision avec un obstacle lui en coûte une.
Une période d'invincibilité de 2 secondes suit chaque collision pour éviter
les pertes en chaîne.

### Progression par niveaux
3 niveaux de difficulté sont disponibles :
- **Niveau 1** : vitesse normale, pour découvrir le jeu
- **Niveau 2** : vitesse accrue, obstacles plus fréquents
- **Niveau 3** : vitesse maximale, pour les joueurs expérimentés

### Game Over
La partie se termine quand le joueur perd ses 3 vies.
Son score est enregistré dans le tableau de scores et il peut voir les meilleurs scores.

## Références artistiques

Je me suis inspirée de **Subway Surfers** pour le principe des 3 voies et la progression de vitesse.

Pour la DA, j'ai choisi une palette avec du rose, du noir et un peu de jaune et des assets 3D **Kenney** pour garder un style cartoon.

## Stack technique

- **Three.js** — moteur 3D
- **Vite** — bundler
- **Web Audio API** — sound design génératif
- **Symfony + API Platform** — back-end (authentification, scores)
- **JWT** — authentification sécurisée