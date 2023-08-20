set -e

pnpm wasm-pack build --target=nodejs --no-pack --out-dir=../../binding/wasm-node --out-name=excss_compiler ./crates/compiler_wasm

# https://docs.rs/getrandom/latest/getrandom/#nodejs-es-module-support
echo "
if(typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto').webcrypto
}
" >> binding/wasm-node/excss_compiler.js

pnpm wasm-pack build --target=web --no-pack --out-dir=../../binding/wasm-web --out-name=excss_compiler ./crates/compiler_wasm

echo '{"type":"module"}' >> binding/wasm-web/package.json

rm -rf binding/**/.gitignore
