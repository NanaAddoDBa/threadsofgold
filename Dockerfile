# syntax=docker/dockerfile:1.7

FROM node:22.23.2-bookworm-slim AS operating-system

RUN apt-get update \
  && apt-get install --yes --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

FROM operating-system AS build-base

ENV PNPM_HOME=/pnpm
ENV PATH=${PNPM_HOME}:${PATH}
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /workspace

RUN corepack enable \
  && corepack prepare pnpm@10.18.3 --activate

FROM build-base AS dependencies

COPY . .

RUN --mount=type=cache,id=threadsofgold-pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile

RUN DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build pnpm database:generate

FROM dependencies AS build-storefront

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV NEXT_PUBLIC_STOREFRONT_URL=https://storefront.threadsofgold.invalid

RUN pnpm exec turbo run build --filter=@threadsofgold/storefront...

FROM dependencies AS build-admin

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV NEXT_PUBLIC_ADMIN_URL=https://admin.threadsofgold.invalid

RUN pnpm exec turbo run build --filter=@threadsofgold/admin...

FROM dependencies AS build-api

RUN pnpm exec turbo run build --filter=@threadsofgold/api...

FROM dependencies AS build-worker

RUN pnpm exec turbo run build --filter=@threadsofgold/worker...

FROM build-api AS deploy-api

RUN --mount=type=cache,id=threadsofgold-pnpm,target=/pnpm/store \
  pnpm --filter @threadsofgold/api deploy --prod --legacy /deploy/api

FROM build-worker AS deploy-worker

RUN --mount=type=cache,id=threadsofgold-pnpm,target=/pnpm/store \
  pnpm --filter @threadsofgold/worker deploy --prod --legacy /deploy/worker

FROM operating-system AS runtime-base

ENV NEXT_TELEMETRY_DISABLED=1

# Package managers belong only in build stages. Removing them from the runtime
# image reduces both its attack surface and its software inventory.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
  && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    /usr/local/bin/pnpm /usr/local/bin/pnpx

FROM runtime-base AS storefront

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV FOUNDATION_RUNTIME_ENABLED=false
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_STOREFRONT_URL=https://storefront.threadsofgold.invalid
ENV NODE_ENV=production
ENV PORT=3000

COPY --chown=node:node --from=build-storefront /workspace/apps/storefront/.next/standalone /app
COPY --chown=node:node --from=build-storefront /workspace/apps/storefront/.next/static /app/apps/storefront/.next/static
COPY --chown=node:node --from=build-storefront /workspace/apps/storefront/public /app/apps/storefront/public

WORKDIR /app/apps/storefront
USER node
EXPOSE 3000
CMD ["node", "server.js"]

FROM runtime-base AS admin

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_ADMIN_URL=https://admin.threadsofgold.invalid
ENV NODE_ENV=production
ENV PORT=3001

COPY --chown=node:node --from=build-admin /workspace/apps/admin/.next/standalone /app
COPY --chown=node:node --from=build-admin /workspace/apps/admin/.next/static /app/apps/admin/.next/static

WORKDIR /app/apps/admin
USER node
EXPOSE 3001
CMD ["node", "server.js"]

FROM runtime-base AS api

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV FOUNDATION_RUNTIME_ENABLED=false
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=4000

COPY --chown=node:node --from=deploy-api /deploy/api /app

WORKDIR /app
USER node
EXPOSE 4000
CMD ["node", "--enable-source-maps", "dist/main.js"]

FROM runtime-base AS worker

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV FOUNDATION_RUNTIME_ENABLED=false
ENV HEALTH_HOST=0.0.0.0
ENV HEALTH_PORT=4001
ENV NODE_ENV=production

COPY --chown=node:node --from=deploy-worker /deploy/worker /app

WORKDIR /app
USER node
EXPOSE 4001
CMD ["node", "--enable-source-maps", "dist/main.js"]
