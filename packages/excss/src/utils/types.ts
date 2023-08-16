type Literal = string | number | bigint | boolean | null | undefined;

export type ToLiteral<T, L extends Literal> = T extends `${infer R extends L}`
  ? R
  : T;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Pretty<T> = { [P in keyof T]: T[P] } & {};

export type If<Q extends boolean, T, F> = Q extends true ? T : F;

type TSRequired<T> = { [P in keyof T]-?: T[P] };
type ExcludeValue<T, V> = { [P in keyof T]: Exclude<T[P], V> };
type ExtendValue<T, V> = { [P in keyof T]: T[P] | V };

type StdRequired<T> = ExcludeValue<TSRequired<T>, undefined>;
type StdOptional<T> = ExtendValue<Partial<T>, undefined>;

export type Required<T, Optional extends keyof T = never> = Pretty<
  StdOptional<Pick<T, Optional>> &
    StdRequired<Pick<T, Exclude<keyof T, Optional>>>
>;

export type Optional<T, Required extends keyof T = never> = Pretty<
  StdRequired<Pick<T, Required>> &
    StdOptional<Pick<T, Exclude<keyof T, Required>>>
>;
