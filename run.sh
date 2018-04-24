#!/bin/sh

node \
  --experimental-vm-modules \
  --experimental-modules \
  --expose-internals \
  --no-warnings \
  run.js "$(cat -)" 2>&1
