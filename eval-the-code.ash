#!/bin/ash

INPUT="$(cat -)"

get_input(){
    echo "$INPUT" | jq -r "$1"
}

main(){
    local engine="$(get_input .engine)"
    local code="$(get_input .code)"
    if [ "$engine" == "node" ]; then
        if test -n "$USE_REPL"; then
            echo "$code" | node -i
        else
            node -p "$code"  2>&1
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
            babel-node -p "$code" 2>&1
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

