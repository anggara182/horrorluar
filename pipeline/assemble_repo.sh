#!/bin/bash
# Refresh /home/user/horror-luar from the working tree (docs/README are maintained in place).
set -e; R=/home/user/horrorluar; H=/home/user
cp $H/AGENT_BRIEF.md $R/docs/AGENT_BRIEF.md
rm -rf $R/episodes $R/pipeline $R/library; mkdir -p $R/episodes $R/pipeline
for d in $H/ep0[3-9] $H/ep1[0-9] $H/ep20; do e=$(basename $d); [ -f $d/STYLE.md ] && mkdir -p $R/episodes/$e && cp $d/STYLE.md $R/episodes/$e/; done
cp $H/episodes.py $H/scaffold.py $H/gen_audio_all.py $H/build_audio_ep.py $H/qc.sh $H/render_q.sh $H/build_library.py $H/gallery_template.html $H/assemble_repo.sh $R/pipeline/
cp $H/pron_test2.py $R/pipeline/pron_tool.py; cp $H/ep03/scripts/ai33.py $R/pipeline/
mkdir -p $R/library && (cd $H/library && tar --exclude=.git --exclude=./pipeline -cf - .) | (cd $R/library && tar -xf -)
cat > $R/.gitignore <<'G'
__pycache__/
node_modules/
*.mp4
G
echo "assembled: $(find $R -type f -not -path '*/.git/*' | wc -l) files, $(du -sh --exclude=.git $R | cut -f1)"
