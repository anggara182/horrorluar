#!/bin/bash
# 30-frame sample renders (concurrency 4) from the prebuilt bundle; prints wall s/frame incl. ~startup.
cd "$(dirname "$0")/.."
for r in "$@"; do
  s=$(date +%s.%N)
  npx remotion render out/bundle Episode out/perf.mp4 --frames=$r --concurrency=4 --log=error >/dev/null 2>&1
  e=$(date +%s.%N)
  n=$(( ${r#*-} - ${r%-*} + 1 ))
  echo "$r: $(echo "($e-$s)" | bc -l | cut -c1-5)s total, $(echo "($e-$s)/$n" | bc -l | cut -c1-5) s/frame"
done
