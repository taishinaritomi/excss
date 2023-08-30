import type {
  Pretty,
  ToLiteral,
  Required as _Required,
  Optional as _Optional,
} from "./utils/types.ts";

const DEFAULT = "default";

export namespace Ex {
  export type ClassName = ClassName[] | string | false | null | undefined;

  export type Required<
    T extends RawCallback | RawProps,
    Optional extends T extends RawCallback
      ? keyof Ex<T>
      : Exclude<keyof T, undefined> = never,
  > = T extends RawCallback
    ? _Required<Ex<T>, Optional>
    : _Required<
        T,
        Optional extends Exclude<keyof T, undefined> ? Optional : never
      >;

  export type Optional<
    T extends RawCallback | RawProps,
    Required extends T extends RawCallback
      ? keyof Ex<T>
      : Exclude<keyof T, undefined> = never,
  > = T extends RawCallback
    ? _Optional<Ex<T>, Required>
    : _Optional<
        T,
        Required extends Exclude<keyof T, undefined> ? Required : never
      >;
}

type Props<T> = Pretty<{
  [K in Exclude<keyof T, typeof DEFAULT>]?:
    | ToLiteral<keyof T[K], Exclude<RawKey, string>>
    | undefined;
}>;

type Input<T> = Pretty<
  {
    [DEFAULT]?: Props<T> | undefined;
  } & {
    [K in keyof T]?: K extends typeof DEFAULT
      ? Props<T> | undefined
      : Selectors<T[K]>;
  }
>;

type Selectors<T> = Pretty<{
  [K in keyof T]: T[K] extends string ? T[K] : never;
}>;

type RawKey = string | boolean | number;

type RawDefault = Record<string, RawKey>;
type RawSelector = Record<string, string>;

type RawInput = Partial<
  Record<typeof DEFAULT, RawDefault> & Record<string, RawSelector>
>;

type RawProps = Record<string, RawKey | undefined> | undefined;

type RawCallback = (props?: RawProps) => string;

function callback(this: { _input: RawInput }, props?: RawProps): string {
  let result = "";

  if (props) {
    for (const selector in this._input) {
      if (selector !== DEFAULT) {
        const key = props[selector] ?? this._input.default?.[selector];
        if (key !== undefined) {
          const className = this._input[selector]?.[`${key}`];

          if (className) {
            if (result) result += " ";
            result += className;
          }
        }
      }
    }
  }

  return result;
}

function resolveClassName(className: Ex.ClassName): string {
  if (typeof className === "string") {
    return className;
  } else if (Array.isArray(className)) {
    let result = "";

    for (const _className of className) {
      if (_className) {
        if (result) result += " ";
        result += resolveClassName(_className);
      }
    }

    return result;
  } else {
    return "";
  }
}

export type Ex<T extends RawCallback> = Pretty<
  Exclude<Parameters<T>[0], undefined>
>;

export function ex<T>(input: Input<T>) {
  const bind = { _input: input as RawInput };
  return callback.bind(bind) as (props?: Props<T> | undefined) => string;
}

ex.join = function (...classNames: Ex.ClassName[]) {
  return resolveClassName(classNames);
};
