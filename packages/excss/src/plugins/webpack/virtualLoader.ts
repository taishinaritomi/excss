import type { LoaderContext } from "webpack";

function VirtualLoader(this: LoaderContext<{ src: string }>) {
  const { src } = this.getOptions();
  this.callback(undefined, src);
}

export default VirtualLoader;
