import type { LoaderContext } from "webpack";
import type { LoaderOptions } from "./loader.ts";

export default function cssLoader(
  this: LoaderContext<LoaderOptions>,
  src: string,
) {
  try {
    const params = new URLSearchParams(this.resourceQuery);
    const css = `${src}\n${params.get("css") ?? ""}`;

    this.callback(undefined, css);
  } catch (error) {
    this.callback(error as Error);
  }
}
