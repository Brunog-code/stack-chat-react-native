# Base leve e estável
FROM node:20-slim

# Instalar dependências necessárias para o Prisma (openssl)
RUN apt-get update && apt-get install -y openssl && apt-get clean

# Criar pasta do app
WORKDIR /app

# Copiar apenas os arquivos de pacotes para aproveitar o cache das camadas
COPY package*.json ./

# Copiar a pasta prisma para gerar o client
COPY prisma ./prisma/

# Instalar dependências (limpo para produção)
RUN npm install

# 🔥 ESSENCIAL: Gerar o Prisma Client antes do build
RUN npx prisma generate

# Copiar o restante do código
COPY . .

# 🔥 Compilar TypeScript (Se você estiver usando TS)
# Certifique-se de que tem o script "build" no seu package.json
RUN npm run build
RUN echo '{"type": "commonjs"}' > dist/generated/prisma/package.json

# O Socket.io e o Express precisam de portas abertas
EXPOSE 3334

# Rodar o servidor
# Se você usa TS, o comando geralmente é "node dist/server.js"
# Se o seu "npm start" já aponta para o lugar certo, mantenha assim:
CMD ["npm", "start"]