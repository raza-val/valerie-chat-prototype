#!/bin/zsh
# Records every line Valerie says (tools/voice/lines.mjs: the tagline, each headline, the follow-up offer)
# → public/voice/<voice>/<line>.m4a + .json (word timings and a loudness curve, for the ink and Aura's motion).
#   tools/voice/record.sh          all six voices
#   tools/voice/record.sh martha   one voice
# Re-run after a headline changes in src/data/answers.ts. `tools/voice/tts list` shows every installed voice and its id;
# a downloaded Premium voice (System Settings → Accessibility → Spoken Content) can be added to V below.
set -e
here=${0:A:h}; root=${here:h:h}
[[ -x $here/tts ]] || swiftc -O $here/tts.swift -o $here/tts
typeset -A V
V=(nicky com.apple.ttsbundle.siri_nicky_en-US_compact aaron com.apple.ttsbundle.siri_aaron_en-US_compact
   martha com.apple.ttsbundle.siri_martha_en-GB_compact arthur com.apple.ttsbundle.siri_arthur_en-GB_compact
   catherine com.apple.ttsbundle.siri_catherine_en-AU_compact samantha com.apple.voice.compact.en-US.Samantha)
tmp=$(mktemp -d)
node $here/lines.mjs > $tmp/lines.tsv
for n id in ${(kv)V}; do
  [[ -n $1 && $1 != $n ]] && continue
  out=$root/public/voice/$n; mkdir -p $out
  while IFS=$'\t' read -r name text; do
    $here/tts $id $tmp/$name "$text" >/dev/null
    afconvert -f m4af -d aac -b 64000 $tmp/$name.caf $out/$name.m4a
    cp $tmp/$name.json $out/$name.json
  done < $tmp/lines.tsv
  echo "$n done"
done
rm -rf $tmp
