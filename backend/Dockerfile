# Étape 1 : Utiliser une image Node.js officielle
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances de développement
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Démarrer l'application avec nodemon pour développement
CMD ["node", "dist/index.js"]


