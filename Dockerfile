FROM mhart/alpine-node
LABEL author=me@gus.host

RUN adduser -D -s /bin/bash -h /var/ws anon
COPY run.js /var/run/
WORKDIR /var/ws
USER anon

CMD ["node", \
  "--harmony-bigint", \
  "--harmony-class-fields", \
  "--harmony-private-fields", \
  "--harmony-static-fields", \
  "--harmony-public-fields", \
  "--harmony-regexp-named-captures", \
  "--harmony-do-expressions", \
  "--experimental-vm-modules", \
  "--experimental-modules", \
  "--no-warnings", \
  "/var/run/run.js"]
