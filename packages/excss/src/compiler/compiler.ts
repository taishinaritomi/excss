import { webcrypto } from "node:crypto";
globalThis.crypto = webcrypto;

export type Variants = Record<string, string | number>;
export { transform } from "../../dist/_wasm/compiler/excss_compiler_wasm";
