FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY site /srv/site
COPY outputs /srv/outputs
COPY essays /srv/essays
