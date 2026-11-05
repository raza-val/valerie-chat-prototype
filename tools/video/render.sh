#!/bin/zsh
# Renders docs/aura/valerie-demo.mp4: one send from Home (greeting, flight, working, the headline read aloud,
# the follow-up offer), captured frame by frame on a virtual clock (clock.js) at 60fps, 1920×1200, with the
# recorded voice laid in where it's spoken. About 5 minutes.
#   tools/video/render.sh              Nicky
#   VOICE=martha tools/video/render.sh
#   VERSION=b tools/video/render.sh    Version B (the Constellation) → docs/aura/valerie-demo-constellation.mp4
# Needs Google Chrome and playwright-core (once: npm i --no-save playwright-core).
set -e
here=${0:A:h}; root=${here:h:h}
cd $root && npm run build
$root/node_modules/.bin/vite preview --port 4173 >/dev/null 2>&1 &
preview=$!
trap "kill $preview" EXIT
sleep 2
[[ -x $here/encode ]] || swiftc -O $here/encode.swift -o $here/encode 2>/dev/null
frames=$(mktemp -d)
node $here/record.mjs $frames 36
out=$root/docs/aura/valerie-demo.mp4
[[ $VERSION == b ]] && out=$root/docs/aura/valerie-demo-constellation.mp4
$here/encode $frames $root/public $out
rm -rf $frames
