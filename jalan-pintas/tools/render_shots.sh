#!/usr/bin/env bash
# Render an episode shot by shot (only changed shots), join, add the mix, export final + phone copy.
# usage: tools/render_shots.sh ep01 v2 [--force | --only S05,S06]
#   env: CONC=2 (parallel tabs per shot), CRF=22 (final <50 MB), SCALE=0.5 for a fast 540x960 draft (segments in render/shots-draft/, no phone copy)
set -euo pipefail
EP=$1; V=${2:-v1}; shift 2 || true
SCALE=${SCALE:-1}; export SCALE
cd "$(dirname "$0")/../remotion"
node scripts/render_shots.mjs "$EP" "$@"
cd "../$EP/render"
DIR=shots; [ "$SCALE" != "1" ] && DIR=shots-draft
mapfile -t SEGS < <(sed -n "s/^file '\(.*\)'$/$DIR\/\1/p" "$DIR/list.txt")
ARGS=(); FILT=""; i=0
for s in "${SEGS[@]}"; do ARGS+=(-i "$s"); FILT+="[$i:v]"; i=$((i+1)); done
ffmpeg -v error -y "${ARGS[@]}" -i ../mix.wav -filter_complex "${FILT}concat=n=$i:v=1:a=0[v]" -map "[v]" -map "$i:a" \
  -c:v libx264 -crf "${CRF:-22}" -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$EP-$V.mp4"
if [ "$SCALE" = "1" ]; then
  ffmpeg -v error -y -i "$EP-$V.mp4" -vf scale=720:1280 -c:v libx264 -crf 24 -preset fast -c:a aac -b:a 128k -movflags +faststart "$EP-$V-hp.mp4"
  ls -la "$EP-$V.mp4" "$EP-$V-hp.mp4"
else
  ls -la "$EP-$V.mp4"
fi
