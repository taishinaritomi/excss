import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
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
          plugins: [
            {
              name: "binding-external",
              setup: (build) => {
                build.onResolve({ filter: /binding/ }, (args) => {
                  if (args.importer) {
                    const resolvedPath = path.join(args.resolveDir, args.path);
                    const originalPath = `${resolvedPath}.js`;
                    return {
                      external: true,
                      path: fs.existsSync(originalPath)
                        ? originalPath
                        : resolvedPath,
                    };
                  }
                });
              },
            },
          ],
        }),
      );
    }
  }

  await Promise.all(buildQueue);
}

async function dts() {
  const typesOutDir = path.join("dist", "_types");
  fs.mkdirSync(typesOutDir, { recursive: true });
  fs.writeFileSync(
    path.join(typesOutDir, "package.json"),
    JSON.stringify({ type: "commonjs" }),
  );

  await cmd(
    [
      "tsc",
      "--declaration --emitDeclarationOnly",
      `--outDir ${typesOutDir}`,
      "-p tsconfig.build.json",
    ].join(" "),
  );
}

async function wasm() {
  await cmd(
    [
      "wasm-pack build",
      "--target=nodejs",
      "--out-dir=../../binding/compiler_wasm",
      "./crates/compiler_wasm",
    ].join(" "),
  );
}

async function main() {
  await wasm();
  await js();
  await dts();
}

await main();
