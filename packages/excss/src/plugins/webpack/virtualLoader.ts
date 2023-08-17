import type { LoaderContext } from "webpack";

function virtualLoader(this: LoaderContext<{ src: string }>) {
  const { src } = this.getOptions();
  this.callback(undefined, src);
}

export default virtualLoader;
