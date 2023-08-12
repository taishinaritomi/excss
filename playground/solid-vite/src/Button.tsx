import { css } from "excss";

export function Button() {
  return (
    <button
      class={css`
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.2rem;
        &:hover {
          background-color: #fefefe;
        }
      `}
    >
      Button
    </button>
  );
}
