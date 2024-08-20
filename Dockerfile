FROM node:22-alpine3.19

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
RUN npm install -g pnpm
# Establece el directorio de trabajo en /app
WORKDIR /app

