FROM alpine:edge
MAINTAINER f.bagnardi@gmail.com

RUN echo "http://dl-4.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
  apk update && \
  apk add jq nodejs && \
  rm -rf /var/cache/apk/*

RUN adduser -s /bin/bash -H -D anon
RUN mkdir /var/ws && chown -R anon:anon /var/ws
WORKDIR /var/ws

RUN npm install -g babel-cli@6 && \
    npm install babel-preset-es2015@6 babel-preset-stage-1@6 babel-preset-stage-0@6 babel-preset-react@6 && \
    npm cache clean && \
    npm uninstall -g npm

COPY eval-the-code.ash ./
RUN chmod 005 eval-the-code.ash
USER anon

ENV BABEL_CACHE_PATH /var/ws/.babel.json
CMD ["ash", "eval-the-code.ash"]

