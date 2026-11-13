#!/bin/bash
# usage: render_q.sh ep10:EP10-bloody-mary ...
for pair in "$@"; do e=${pair%%:*}; n=${pair#*:}; cd /home/user/$e || continue
  npx remotion render out/bundle Episode out/$e-clean.mp4 --concurrency=4 --crf=16 --log=error >/dev/null 2>out/render.err && \
  scripts/finish.sh out/$e-clean.mp4 out/$n.mp4 0.30 23 >/dev/null 2>&1 && \
  /home/user/qc.sh $e out/$n.mp4 | tr '\n' ' ' && echo && \
  git add -A >/dev/null && git commit -qm "$n render" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01B68mnBVR2dFDtRL2CW9jfu" ; echo "$e finished rc=$? $(date -u +%T)"
done
