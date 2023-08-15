import type { Ex } from "excss";
import { css, ex } from "excss";
import { useReducer } from "react";

const style = ex({
  isDisabled: {
    true: css`
      background-color: red;
    `,
    false: css`
      background-color: blue;
    `,
  },
  color: {
    red: css`
      color: red;
    `,
    green: css`
      color: green;
    `,
  },
  space: {
    0: css`
      margin: 0rem;
    `,
    1: css`
      margin: 1rem;
    `,
    2: css`
      margin: 2rem;
    `,
  },
});

type Props = Ex<typeof style>;

export function Button(props: Props) {
  const [isDisabled, toggle] = useReducer((v) => !v, false);
  return (
    <button
      onClick={() => {
        toggle();
      }}
      className={style({ isDisabled: isDisabled, space: 0, ...props })}
    >
      Button
    </button>
  );
}
