set -e

pnpm rimraf ./node_modules target target_check ./{packages,playground}/*/{node_modules,dist,.next,.turbo,binding}
