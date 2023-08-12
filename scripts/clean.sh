set -e

pnpm rimraf ./node_modules target ./{packages,playground}/*/{node_modules,dist,.next,.turbo,target,binding}
