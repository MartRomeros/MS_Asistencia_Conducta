FROM node:22-alpine3.20 AS builder

WORKDIR /usr/app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22-alpine3.20

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /usr/app/dist ./dist

COPY --from=builder /usr/app/package.json /usr/app/pnpm-lock.yaml /usr/app/pnpm-workspace.yaml ./

RUN pnpm install --prod --frozen-lockfile

CMD ["node", "dist/index.js"]
