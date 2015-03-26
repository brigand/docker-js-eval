#!/bin/ash

INPUT="$(cat -)"

get_input(){
    echo "$INPUT" | jq -r "$1"
}

main(){
    local engine="$(get_input .engine)"
    local code="$(get_input .code)"
    if [ "$engine" == "node" ]; then
       node -p "$code" 2>&1
    fi
    if [ "$engine" == "babel" ]; then
        babel-node -p "$code" 2>&1
    fi
}

OUT="$(main)"
status="$?"

if [[ "$status" != "0" ]]; then
    jq -n -c -M --arg v "$OUT" '{"success": false, "text": $v}'
else
    jq -n -c -M --arg v "$OUT" '{"success": true, "text": $v}'
fi

