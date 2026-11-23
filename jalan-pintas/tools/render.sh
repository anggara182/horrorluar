#!/usr/bin/env bash
# Full render: silent video (Remotion) -> mux with mix.wav -> final + phone copy. usage: tools/render.sh ep01 v1
set -euo pipefail
EP=$1; V=${2:-v1}; ID=$(echo "$EP" | tr a-z A-Z)
cd "$(dirname "$0")/../remotion"
mkdir -p "../$EP/render"
npx remotion render src/index.ts "$ID" "../$EP/render/$EP-silent.mp4" --concurrency=3 --crf=16 --log=error
cd "../$EP"
ffmpeg -v error -y -i "render/$EP-silent.mp4" -i mix.wav -map 0:v -map 1:a -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "render/$EP-$V.mp4"
ffmpeg -v error -y -i "render/$EP-$V.mp4" -vf scale=720:1280 -c:v libx264 -crf 24 -preset fast -c:a aac -b:a 128k -movflags +faststart "render/$EP-$V-hp.mp4"
ls -la render/
