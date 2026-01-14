FROM node:20-alpine

WORKDIR /app

# Version must match the Docker image tag
ARG VERSION
ENV PORT=3000
ENV CORS_ORIGIN=*

EXPOSE 3000

# Pin the package version to match the Docker tag
CMD npx @dirathea/busical@${VERSION}
