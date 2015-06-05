FROM alpine
MAINTAINER f.bagnardi@gmail.com

RUN apk update && \
  apk add nodejs jq


RUN npm install -g babel && \
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

