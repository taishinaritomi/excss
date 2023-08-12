import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <html>
      <head>
        <title></title>
      </head>
      <body>{children}</body>
    </html>
  );
}

export default Layout;
