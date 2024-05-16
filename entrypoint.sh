#!/bin/sh

# Esperar até que o banco de dados esteja disponível
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 1
done

# Gerar o cliente Prisma
npx prisma generate

# Aplicar migrações Prisma
npx prisma migrate deploy

# Construir a aplicação NestJS
npm run build

# Iniciar a aplicação
npm run start:prod
