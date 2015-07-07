FROM alpine:edge
MAINTAINER f.bagnardi@gmail.com

RUN echo "http://dl-4.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
  apk update && \
  apk add jq iojs && \
  rm -rf /var/cache/apk/*


RUN npm install -g babel@5 && \
    npm cache clean && \
    npm uninstall -g npm

RUN adduser -s /bin/bash -H -D anon
RUN mkdir /var/ws && chown -R anon:anon /var/ws
WORKDIR /var/ws
COPY eval-the-code.ash ./
RUN chmod 005 eval-the-code.ash
USER anon

ENV BABEL_CACHE_PATH /var/ws/.babel.json
CMD ["ash", "eval-the-code.ash"]

