#!/bin/sh

node \
  --harmony-bigint \
  --harmony-class-fields \
  --harmony-private-fields \
  --harmony-static-fields \
  --harmony-public-fields \
  --harmony-regexp-named-captures \
  --harmony-do-expressions \
  --experimental-vm-modules \
  --experimental-modules \
  --no-warnings \
  run.js "$(cat -)" 2>&1
