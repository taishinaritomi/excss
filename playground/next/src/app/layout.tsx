import { css } from "excss";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <title>excss</title>
      </head>
      <body
        className={css`
          background: green;
        `}
      >
        {children}
      </body>
    </html>
  );
}

export default Layout;
