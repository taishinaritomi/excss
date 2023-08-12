import { css } from "excss";

function Home() {
  return (
    <div
      className={css`
        color: $primary;
        @media ($sm) {
          color: $primary;
        }
      `}
    >
      pages
    </div>
  );
}

export default Home;
