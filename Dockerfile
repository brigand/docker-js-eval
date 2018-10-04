FROM node:slim

COPY run.js /run/
WORKDIR /var/ws
USER node

CMD ["node", \
  "--no-warnings", \
  "/run/run.js"]
