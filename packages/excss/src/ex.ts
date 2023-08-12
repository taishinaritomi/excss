import type { If, Pretty, StringToLiteral } from "./utils/types";

export { ex };
export type { Ex };

type ClassName = string | string[];

const BASE = "base";
const DEFAULT = "default";
type BASE = typeof BASE;
type DEFAULT = typeof DEFAULT;

type KeyToLiteral<T> = StringToLiteral<keyof T, boolean | number>;

type IsClassName<T> = [T] extends [ClassName] ? true : false;
type IsBase<T> = [T] extends [BASE] ? true : false;
type IsDefault<T> = [T] extends [DEFAULT] ? true : false;

type ExSelector<T> = Pretty<{
  [K in keyof T]: If<IsClassName<T[K]>, T[K], never>;
}>;

type ExInput<T> = Pretty<{
  [BASE]?: ClassName;
  [DEFAULT]?: ExProps<T>;
}> & {
  [K in keyof T]?: If<
    IsBase<K>,
    ClassName,
    If<IsDefault<K>, ExProps<T>, ExSelector<T[K]>>
  >;
};

type ExProps<T> = Pretty<{
  [K in Exclude<keyof T, BASE | DEFAULT>]?: KeyToLiteral<T[K]>;
}>;

type Key = string | number;

type ResolvedExSelector = Record<Key, string>;

type ResolvedExSelectorMeta = {
  /** @internal */
  _default: string | undefined;
  /** @internal */
  _selector: ResolvedExSelector;
};

type ResolvedExSelectors = Record<Key, ResolvedExSelectorMeta>;

type ResolvedEx = {
  /** @internal */
  _base: string | undefined;
  /** @internal */
  _selectors: ResolvedExSelectors;
};

type RawExDefault = Record<Key, string | number>;

type RawExInput = Partial<
  Record<BASE, ClassName> &
    Record<DEFAULT, RawExDefault> &
    Record<Key, RawExSelector>
>;

type RawExSelector = Record<Key, ClassName>;
type RawExProps = Record<Key, string | number | boolean | undefined>;

function join(className: ClassName): string {
  return Array.isArray(className) ? className.join(" ") : className;
}

function resolveEx(ex: RawExInput): ResolvedEx {
  const exDefault = ex[DEFAULT] ?? {};

  const resoledBase = ex[BASE] && join(ex[BASE]);
  const resoledSelectors: ResolvedExSelectors = {};

  for (const exKey in ex) {
    if (exKey !== BASE) {
      const selector = ex[exKey];

      const resoledSelector: ResolvedExSelector = {};
      const defaultKey = exDefault[`${exKey}`];
      let defaultClassName: string | undefined;

      for (const selectorKey in selector) {
        let className = selector[selectorKey];
        if (className) {
          className = join(className);
          resoledSelector[selectorKey] = className;
          if (defaultKey && `${defaultKey}` === selectorKey) {
            defaultClassName = className;
          }
        }
      }

      resoledSelectors[exKey] = {
        _default: defaultClassName,
        _selector: resoledSelector,
      };
    }
  }
  return { _base: resoledBase, _selectors: resoledSelectors };
}

function exCallback(this: ResolvedEx, props: RawExProps): string {
  let classNames = "";

  if (this._base) classNames = this._base;

  for (const selectorKey in this._selectors) {
    const selector = this._selectors[selectorKey];
    const propsKey = props[selectorKey];

    const className =
      propsKey === undefined
        ? selector?._default
        : selector?._selector[`${propsKey}`];

    if (className) {
      if (classNames) classNames += " ";
      classNames += className;
    }
  }
  return classNames;
}

type Ex<T extends (props: RawExProps) => string> = Pretty<Parameters<T>[0]>;

function ex<T>(ex: ExInput<T>) {
  const resolvedEx = resolveEx(ex as RawExInput);
  return exCallback.bind(resolvedEx) as (props: ExProps<T>) => string;
}

ex.join = join;
