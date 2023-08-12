import { css, fileHash } from "excss";
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
        @include mq(_400) {
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
          [`--${fileHash}-count`]: `${count}deg`,
        }}
        className={css`
          $animation-spin: #{$block-hash};
          animation: 1s $animation-spin;
          @keyframes #{$animation-spin} {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }
          $count: --#{$file-hash}-count;
          transform: rotate(var($count));
        `}
      >
        rotate
      </p>

      <Button color={"green"} />
    </div>
  );
}
