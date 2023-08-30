import type { LoaderContext } from "webpack";

export default function virtualLoader(this: LoaderContext<{ src: string }>) {
  const { src } = this.getOptions();
  this.callback(undefined, src);
}
