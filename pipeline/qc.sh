#!/usr/bin/env bash
# QC a finished episode: specs, duration vs episode.json, loudness, audio/mix sync offset.
ep=$1; f=$2; d=/home/user/$ep
exp=$(python3 -c "import json;print(json.load(open('$d/src/data/episode.json'))['durationSec'])")
spec=$(ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height -of csv=p=0 "$f" | tr '\n' ' ')
lu=$(ffmpeg -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' ' | tr '\n' ' ')
ffmpeg -v error -y -i "$f" -ac 1 -ar 8000 -f s16le /tmp/claude-0/qc_v.raw; ffmpeg -v error -y -i $d/public/audio/mix.wav -ac 1 -ar 8000 -f s16le /tmp/claude-0/qc_m.raw
off=$(python3 -c "
import numpy as np
v=np.fromfile('/tmp/claude-0/qc_v.raw',np.int16).astype(float);m=np.fromfile('/tmp/claude-0/qc_m.raw',np.int16).astype(float)
n=min(len(v),len(m));v=v[:n];m=m[:n]
print(max(range(-400,401,2),key=lambda k:np.dot(v[max(0,k):n+min(0,k)],m[max(0,-k):n-max(0,k)]))/8)")
echo "$ep | $spec | expected ${exp}s | $lu | audio offset ${off} ms"
