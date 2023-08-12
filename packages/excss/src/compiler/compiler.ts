import { webcrypto } from "node:crypto";
globalThis.crypto = webcrypto;

export type Variants = Record<string, string | number>;
export { transform } from "../../binding/compiler_wasm/excss_compiler_wasm";
