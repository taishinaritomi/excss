import type { If, Pretty, StringToLiteral } from "./utils/types";

export { picker };
export type { Picker };

type ClassName = string | string[];

const BASE = "base";
const DEFAULT = "default";
type BASE = typeof BASE;
type DEFAULT = typeof DEFAULT;

type KeyToLiteral<T> = StringToLiteral<keyof T, boolean | number>;

type IsClassName<T> = [T] extends [ClassName] ? true : false;
type IsBase<T> = [T] extends [BASE] ? true : false;
type IsDefault<T> = [T] extends [DEFAULT] ? true : false;

type PickerSelector<T> = Pretty<{
  [K in keyof T]: If<IsClassName<T[K]>, T[K], never>;
}>;

type PickerInput<T> = Pretty<{
  [BASE]?: ClassName;
  [DEFAULT]?: PickerProps<T>;
}> & {
  [K in keyof T]?: If<
    IsBase<K>,
    ClassName,
    If<IsDefault<K>, PickerProps<T>, PickerSelector<T[K]>>
  >;
};

type PickerProps<T> = Pretty<{
  [K in Exclude<keyof T, BASE | DEFAULT>]?: KeyToLiteral<T[K]>;
}>;

type Key = string | number;

type ResolvedPickerSelector = Record<Key, string>;

type ResolvedPickerSelectorMeta = {
  /** @internal */
  _default: string | undefined;
  /** @internal */
  _selector: ResolvedPickerSelector;
};

type ResolvedPickerSelectors = Record<Key, ResolvedPickerSelectorMeta>;

type ResolvedPicker = {
  /** @internal */
  _base: string | undefined;
  /** @internal */
  _selectors: ResolvedPickerSelectors;
};

type RawPickerDefault = Record<Key, string | number>;

type RawPickerInput = Partial<
  Record<BASE, ClassName> &
    Record<DEFAULT, RawPickerDefault> &
    Record<Key, RawPickerSelector>
>;

type RawPickerSelector = Record<Key, ClassName>;
type RawPickerProps = Record<Key, string | number | boolean | undefined>;

function resolveClassName(className: ClassName): string {
  return Array.isArray(className) ? className.join(" ") : className;
}

function resolvePicker(picker: RawPickerInput): ResolvedPicker {
  const pickerDefault = picker[DEFAULT] ?? {};

  const resoledBase = picker[BASE] && resolveClassName(picker[BASE]);
  const resoledSelectors: ResolvedPickerSelectors = {};

  for (const pickerKey in picker) {
    if (pickerKey !== BASE) {
      const selector = picker[pickerKey];

      const resoledSelector: ResolvedPickerSelector = {};
      const defaultKey = pickerDefault[`${pickerKey}`];
      let defaultClassName: string | undefined;

      for (const selectorKey in selector) {
        let className = selector[selectorKey];
        if (className) {
          className = resolveClassName(className);
          resoledSelector[selectorKey] = className;
          if (defaultKey && `${defaultKey}` === selectorKey) {
            defaultClassName = className;
          }
        }
      }

      resoledSelectors[pickerKey] = {
        _default: defaultClassName,
        _selector: resoledSelector,
      };
    }
  }
  return { _base: resoledBase, _selectors: resoledSelectors };
}

function pickerCallback(this: ResolvedPicker, props: RawPickerProps): string {
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

type Picker<T extends (props: RawPickerProps) => string> = Pretty<
  Parameters<T>[0]
>;

function picker<T>(picker: PickerInput<T>) {
  const resolvedPicker = resolvePicker(picker as RawPickerInput);
  return pickerCallback.bind(resolvedPicker) as (
    props: PickerProps<T>,
  ) => string;
}
