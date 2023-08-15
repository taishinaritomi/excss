import type { Pretty, ToLiteral } from "./utils/types";

export { ex };
export type { Ex };

const DEFAULT = "default";

namespace Ex {
  type StdRequired<T> = { [P in keyof T]-?: T[P] };
  type _Required<T, K extends keyof T = keyof T> = Omit<
    T & StdRequired<Pick<T, K & keyof T>>,
    never
  >;

  export type ClassName = ClassName[] | string | false | null | undefined;

  export type Key = string | boolean | number | null | undefined;

  export type Required<
    T extends RawCallback,
    K extends keyof Ex<T> = keyof Ex<T>,
  > = _Required<Ex<T>, K>;

  export type Props<T> = Pretty<{
    [K in Exclude<keyof T, typeof DEFAULT>]?: ToLiteral<
      keyof T[K],
      Exclude<Key, string>
    >;
  }>;

  export type Input<T> = Pretty<{
    [DEFAULT]?: Props<T>;
  }> & {
    [K in keyof T]?: K extends typeof DEFAULT ? Props<T> : Selectors<T[K]>;
  };

  type Selectors<T> = Pretty<{
    [K in keyof T]: T[K] extends string ? T[K] : never;
  }>;

  type RawDefault = Record<string, Key>;
  type RawSelector = Record<string, string>;

  export type RawInput = Partial<
    Record<typeof DEFAULT, RawDefault> & Record<string, RawSelector>
  >;

  export type RawProps = Record<string, Key>;

  export type RawCallback = (props: RawProps) => string;
}

type Ex<T extends Ex.RawCallback> = Pretty<Parameters<T>[0]>;

function ex<T>(input: Ex.Input<T>) {
  const bind = { _input: input as Ex.RawInput };
  return callback.bind(bind) as (props: Ex.Props<T>) => string;
}

ex.join = function (...classNames: Ex.ClassName[]) {
  return resolveClassName(classNames);
};

function callback(this: { _input: Ex.RawInput }, props: Ex.RawProps): string {
  let result = "";

  for (const selector in this._input) {
    if (selector !== DEFAULT) {
      const key = props[selector] ?? this._input.default?.[selector];
      const className = this._input[selector]?.[`${key}`];

      if (className) {
        if (result) result += " ";
        result += className;
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
