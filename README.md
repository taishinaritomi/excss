# excss

excss is a small, simple, zero-runtime CSS-in-JS library with just two APIs.

```ts
import { css, ex, FILE_ID } from "excss";
import type { Ex } from "excss";
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
          transform: rotate(var(--#{$FILE_ID}-rotate));
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
        `,
        css`
          color: $primary;
          gap: $space_sm;
        `,
        !isDisabled &&
          css`
            @include mediaQuery(sm) {
              background-color: black;
            }

            &:hover {
              background-color: green;
            }
          `,
      )}
    >
      <button className={button(props.buttonStyle)}>Button</button>
    </div>
  );
}
```