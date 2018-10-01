FROM node:slim

COPY run.js /run/
WORKDIR /var/ws
USER node

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
  "/run/run.js"]
