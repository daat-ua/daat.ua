# Build the static site with Node 26 (LTS), then serve dist/ with Caddy (Railway sets $PORT).

FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# public booking settings (astro.config.mjs `env`): Railway passes service variables to declared build args
ARG PUBLIC_CAL_EVENT_TYPE_ID
ARG PUBLIC_CAL_BOOKING_URL
# where the contact page's form posts its requests (optional)
ARG PUBLIC_CONTACT_FORM_URL
# Sanity content is read during the build, so a redeploy of the same commit must not reuse the build step from
# Docker's cache (it would ship the old content). This fetch (the latest published edit; the response's timing
# field differs on every request) invalidates the step below on every deploy; `npm ci` above stays cached.
ADD "https://7mfhokh5.api.sanity.io/v2025-02-19/data/query/production?query=*%5B!(_id%20in%20path(%22drafts.**%22))%5D%7Corder(_updatedAt%20desc)%5B0%5D._updatedAt" /tmp/sanity-latest.json
# type checking runs in CI (.github/workflows/ci.yml), not here: the deploy build only builds
RUN npm run build

FROM caddy:2-alpine
# run unprivileged: $PORT is above 1024, and Caddy only needs its data/config folders
RUN addgroup -S caddy && adduser -S -G caddy caddy && chown -R caddy:caddy /data /config
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
USER caddy
EXPOSE 8080
