FROM node:22.20.0-alpine3.22 
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g corepack@0.34.0 && corepack enable pnpm
WORKDIR /app
COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm_client,target=/pnpm/store pnpm install
COPY next.config.ts ./next.config.ts
COPY postcss.config.mjs ./postcss.config.mjs
COPY tsconfig.json ./tsconfig.json
COPY public ./public
COPY src ./src

CMD [ "pnpm", "dev" ]