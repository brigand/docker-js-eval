#!/bin/bash

INPUT="$(cat -)"

get_input(){
    echo "$INPUT" | jq -r "$1"
}

source ./nvm/nvm.sh

main(){
    local engine="$(get_input .engine)"
    local code="$(get_input .code)"
    local node_version="$(get_input .nodeVersion)"

    if [[ "$node_version" == "null" ]]; then
      node_version="6"
    fi

    nvm use "$node_version" >/dev/null 2>&1

    if [ "$engine" == "node" ]; then
        if test -n "$USE_REPL"; then
            echo "$code" | node -i
        else
            node eval-js.js "$code"  2>&1
        fi
    fi

    if [ "$engine" == "node-harmony" ]; then
        node $(node --v8-options | grep harmony | awk '{print $1}') -p "$code" 2>&1
    fi

    if [ "$engine" == "babel" ]; then
        if test -n "$BABELRC"; then
            echo "$BABELRC" > .babelrc
        fi

        if test -n "$USE_REPL"; then
            echo "$code" | babel-node 2>&1
        else
            node eval-js.js "$code" --use-babel 2>&1
        fi
    fi
}

OUT="$(main)"
status="$?"

if [[ "$status" != "0" ]]; then
    jq -n -c -M --arg v "$OUT" '{"success": false, "text": $v}'
else
    jq -n -c -M --arg v "$OUT" '{"success": true, "text": $v}'
fi

