import { css, keyframes } from "excss";

function Home() {
  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;
  return (
    <div
      className={css`
        color: $primary;
      `}
      style={{
        animation: `${fadeIn} 2s ease-in-out`,
      }}
    >
      app
    </div>
  );
}
export default Home;
