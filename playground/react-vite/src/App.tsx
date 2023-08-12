import { css, FILE_ID } from "excss";
import { useState } from "react";
import { Button } from "./Button";

export function App() {
  const [count, setCount] = useState(0);
  return (
    <div
      className={css`
        padding: 10rem;
        background-color: $red;
        border-radius: 0.5rem;
        @include mq(400) {
          background-color: black;
        }
      `}
    >
      <button
        onClick={() => {
          setCount((v) => v + 1);
        }}
      >
        {count}
      </button>

      <p
        style={{
          [`--${FILE_ID}-count`]: `${count}deg`,
        }}
        className={css`
          $animation-spin: unique();
          animation: 1s $animation-spin;
          @keyframes #{$animation-spin} {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }

          transform: rotate(var(--#{$FILE_ID}-count));
        `}
      >
        rotate
      </p>

      <Button color={"green"} />
    </div>
  );
}
