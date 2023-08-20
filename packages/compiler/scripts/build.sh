set -e

pnpm wasm-pack build --target=nodejs --no-pack --out-dir=../../binding/wasm-node --out-name=excss_compiler ./crates/compiler_wasm

# https://docs.rs/getrandom/latest/getrandom/#nodejs-es-module-support
echo "globalThis.crypto ??= require('crypto').webcrypto;" >> binding/wasm-node/excss_compiler.js

echo '{"type":"commonjs"}' >> binding/wasm-node/package.json

pnpm wasm-pack build --target=web --no-pack --out-dir=../../binding/wasm-web --out-name=excss_compiler ./crates/compiler_wasm

echo '{"type":"module"}' >> binding/wasm-web/package.json

rm -rf binding/**/.gitignore
