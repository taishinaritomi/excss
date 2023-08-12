import { css } from "excss";

export function App() {
  return (
    <button
      className={css`
        color: red;
        background-color: green;
      `}
    >
      button
    </button>
  );
}
