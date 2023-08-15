type Literal = string | number | bigint | boolean | null | undefined;

export type ToLiteral<T, L extends Literal> = T extends `${infer R extends L}`
  ? R
  : T;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Pretty<T> = { [P in keyof T]: T[P] } & {};

export type If<Q extends boolean, T, F> = Q extends true ? T : F;
