# 🚕 Taxi Rush — Note d'intention

## But du jeu

Taxi Rush est un jeu de type endless runner en 3D développé avec Three.js.
Le joueur incarne un taxi jaune new-yorkais qui doit naviguer à toute vitesse
dans les rues de la ville en évitant les obstacles (cyclistes, camions, piétons).
Plus le joueur avance, plus la vitesse augmente et les obstacles se multiplient.

## Choix de game design

### Système de déplacement
Le taxi se déplace sur 3 voies (gauche, centre, droite) avec les touches fléchées.
Ce système simple et intuitif permet une prise en main immédiate tout en offrant
des situations de jeu variées.

### Économie principale — Score
Le score augmente automatiquement avec la distance parcourue.
Il récompense la survie et l'endurance du joueur.

### Économie secondaire — Vies
Le joueur dispose de 3 vies. Chaque collision avec un obstacle lui en coûte une.
Une période d'invincibilité de 2 secondes suit chaque collision pour éviter
les pertes en chaîne.

### Progression par niveaux
3 niveaux de difficulté sont disponibles :
- **Niveau 1** : vitesse normale, pour découvrir le jeu
- **Niveau 2** : vitesse accrue, obstacles plus fréquents
- **Niveau 3** : vitesse maximale, pour les joueurs expérimentés

### Condition de défaite
La partie se termine quand le joueur perd ses 3 vies.
Son score est alors enregistré dans le tableau des meilleurs scores.

## Références artistiques

L'esthétique s'inspire de **Jet Set Radio** (Sega, 2000) :
- Couleurs vives et contrastées
- Ambiance urbaine dynamique
- Bâtiments colorés générés procéduralement

## Stack technique

- **Three.js** — moteur 3D
- **Vite** — bundler
- **Web Audio API** — sound design génératif
- **Symfony + API Platform** — back-end (authentification, scores)
- **JWT** — authentification sécurisée