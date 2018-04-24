FROM mhart/alpine-node
MAINTAINER me@gus.host

RUN adduser -D -s /bin/bash -h /var/ws anon
RUN chown -R anon:anon /var/ws
WORKDIR /var/ws
COPY run.sh ./
COPY run.js ./
RUN chmod 555 run.sh
USER anon

CMD ["sh", "run.sh"]

