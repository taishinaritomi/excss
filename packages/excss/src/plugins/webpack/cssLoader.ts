import type { LoaderContext } from "webpack";
import { CSS_PARAM_NAME } from "./loader.ts";

export default function cssLoader(this: LoaderContext<unknown>, src: string) {
  try {
    const params = new URLSearchParams(this.resourceQuery);
    const css = `${src}\n${params.get(CSS_PARAM_NAME) ?? ""}`;
    console.log("debug:", "cssLoader", css);

    this.callback(undefined, css);
  } catch (error) {
    this.callback(error as Error);
  }
}
