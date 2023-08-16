# excss

excss is a small, simple, zero-runtime CSS-in-JS library with just two APIs.

```ts
import { css, ex, Ex, FILE_ID } from "excss";
import { useState } from "react";

const button = ex({
  color: {
    red: css`
      color: red;
    `,
    green: css`
      color: green;
    `,
    blue: css`
      color: blue;
    `,
  },
});

type Props = {
  buttonStyle: Ex<typeof button>;
};

export function Component(props: Props) {
  const [rotate] = useState(0);
  const [isDisabled] = useState(false);
  return (
    <div
      style={{ [`--${FILE_ID}-rotate`]: `${rotate}deg` }}
      className={ex.join(
        css`
          transform: rotate(var(--#{$FILE_ID}-rotate) ;);

          $animation-spin: unique();
          animation: $animation_spin 0.5s;

          @keyframes #{$animation-spin} {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }

          display: flex;
          gap: $space_sm;

          @include mediaQuery(sm) {
            background-color: black;
          }
        `,
        isDisabled &&
          css`
            display: none;
          `,
      )}
    >
      <button className={button(props.buttonStyle)}>Button</button>
    </div>
  );
}
```
