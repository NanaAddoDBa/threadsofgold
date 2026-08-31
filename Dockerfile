# syntax=docker/dockerfile:1.7

FROM node:22.23.2-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV PATH=${PNPM_HOME}:${PATH}
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

FROM base AS dependencies

COPY . .

RUN pnpm install --frozen-lockfile

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

FROM base AS storefront

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_STOREFRONT_URL=https://storefront.threadsofgold.invalid
ENV NODE_ENV=production
ENV PORT=3000

COPY --chown=node:node --from=build-storefront /workspace /workspace

USER node
EXPOSE 3000
CMD ["./apps/storefront/node_modules/.bin/next", "start"]

FROM base AS admin

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_ADMIN_URL=https://admin.threadsofgold.invalid
ENV NODE_ENV=production
ENV PORT=3001

COPY --chown=node:node --from=build-admin /workspace /workspace

USER node
EXPOSE 3001
CMD ["./apps/admin/node_modules/.bin/next", "start", "--port", "3001"]

FROM base AS api

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=4000

COPY --chown=node:node --from=build-api /workspace /workspace

USER node
EXPOSE 4000
CMD ["node", "--enable-source-maps", "apps/api/dist/main.js"]

FROM base AS worker

ARG APP_RELEASE=container
ENV APP_ENV=production
ENV APP_RELEASE=${APP_RELEASE}
ENV NODE_ENV=production

COPY --chown=node:node --from=build-worker /workspace /workspace

USER node
CMD ["node", "--enable-source-maps", "apps/worker/dist/main.js"]
