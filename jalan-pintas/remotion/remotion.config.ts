import { Config } from '@remotion/cli/config';
import fs from 'node:fs';
// Three.js (WebGL) on CPU: ANGLE + SwiftShader. Local PC: delete the browser line, Remotion downloads its own shell.
Config.setChromiumOpenGlRenderer('swangle');
Config.setVideoImageFormat('jpeg');
const shell = '/opt/pw-browsers/chromium_headless_shell';
if (fs.existsSync(shell)) Config.setBrowserExecutable(shell);
