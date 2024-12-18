# Utiliser l'image Node.js officielle
FROM node:18

# Créer un répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Exposer le port utilisé par Vite (5173 par défaut)
EXPOSE 5173

# Démarrer l'application React avec Vite en mode développement
CMD ["npm", "run", "dev"]

