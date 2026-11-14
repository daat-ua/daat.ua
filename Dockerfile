# Build the static site with Node 26 (LTS), then serve dist/ with Caddy (Railway sets $PORT).

FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# public booking settings (astro.config.mjs `env`): Railway passes service variables to declared build args
ARG PUBLIC_CAL_EVENT_TYPE_ID
ARG PUBLIC_CAL_BOOKING_URL
# type checking runs in CI (.github/workflows/ci.yml), not here: the deploy build only builds
RUN npm run build

FROM caddy:2-alpine
# run unprivileged: $PORT is above 1024, and Caddy only needs its data/config folders
RUN addgroup -S caddy && adduser -S -G caddy caddy && chown -R caddy:caddy /data /config
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
USER caddy
EXPOSE 8080
