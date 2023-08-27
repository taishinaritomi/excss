import childProcess from "node:child_process";
import * as esBuild from "esbuild";

function cmd(command: string) {
  const spawn = childProcess.spawn(command, { shell: true });
  return new Promise<void>((resolve, reject) => {
    spawn.stdout.on("data", (data: string | Buffer) => {
      console.log(data.toString());
    });
    spawn.stderr.on("data", (data: string | Buffer) => {
      console.error(data.toString());
    });
    spawn.on("exit", (code) => {
      code === 0 ? resolve() : reject();
    });
  });
}

const entryPoints = [
  "src/index.ts",
  "src/compiler.ts",
  "src/plugins/webpack/plugin.ts",
  "src/plugins/webpack/loader.ts",
  "src/plugins/webpack/virtualLoader.ts",
  "src/plugins/vite.ts",
  "src/plugins/next.ts",
];

const formats = ["esm", "cjs"] as const;

async function js() {
  const buildQueue: Promise<esBuild.BuildResult>[] = [];

  for (const entryPoint of entryPoints) {
    for (const format of formats) {
      buildQueue.push(
        esBuild.build({
          entryPoints: [entryPoint],
          outbase: "src",
          outdir: "dist",
          outExtension: {
            ".js": format === "esm" ? ".mjs" : ".cjs",
          },
          format: format,
          mangleProps: /^_.*/,
          minify: true,
          bundle: true,
          packages: "external",
          define: {
            __ESM__: `${format === "esm"}`,
          },
        }),
      );
    }
  }

  await Promise.all(buildQueue);
}

async function main() {
  await js();
  await cmd("tsc -p tsconfig.build.json");
}

await main();
