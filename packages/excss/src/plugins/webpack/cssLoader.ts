import type { LoaderContext } from "webpack";

export default function cssLoader(this: LoaderContext<unknown>) {
  const params = new URLSearchParams(this.resourceQuery);
  this.callback(undefined, params.get("css") ?? "");
}
