# Build the static site with Node 26 (LTS), then serve it with Caddy (Railway sets $PORT).

FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
# Migration: the legacy page stays live at / while the Astro build is served from /next/ (see Caddyfile).
# The last migration PR drops these four lines and copies dist/ to /srv instead.
COPY index.html /srv/index.html
COPY assets /srv/assets
COPY fonts /srv/fonts
COPY public /srv/public
COPY --from=build /app/dist /srv/next
EXPOSE 8080
