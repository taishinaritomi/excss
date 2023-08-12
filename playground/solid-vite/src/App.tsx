import { css } from "excss";
import { Button } from "./Button";

export function App() {
  return (
    <div
      class={css`
        padding: 2rem;
        background-color: #dddddd;
        border-radius: 0.5rem;
      `}
    >
      <Button />
    </div>
  );
}
