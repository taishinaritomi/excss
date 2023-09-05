console.log("createFilter");

// import { resolve, posix, isAbsolute } from "node:path";

// export type FilterPattern =
//   | readonly (string | RegExp)[]
//   | string
//   | RegExp
//   | null
//   | undefined;

// function getMatcherString(
//   id: string,
//   resolutionBase: string | false | null | undefined,
// ) {
//   if (resolutionBase === false || isAbsolute(id) || id.startsWith("**")) {
//     return normalizePath(id);
//   }

//   // resolve('') is valid and will default to process.cwd()
//   const basePath = normalizePath(resolve(resolutionBase || ""))
//     // escape all possible (posix + win) path characters that might interfere with regex
//     .replaceAll(/[$()*+.?[\]^{|}-]/g, "\\$&");
//   // Note that we use posix.join because:
//   // 1. the basePath has been normalized to use /
//   // 2. the incoming glob (id) matcher, also uses /
//   // otherwise Node will force backslash (\) on windows
//   return posix.join(basePath, normalizePath(id));
// }

// const createFilter: CreateFilter = function createFilter(
//   include?,
//   exclude?,
//   options?,
// ) {
//   const resolutionBase = options?.resolve;

//   const getMatcher = (id: string | RegExp) =>
//     id instanceof RegExp
//       ? id
//       : {
//           test: (what: string) => {
//             // this refactor is a tad overly verbose but makes for easy debugging
//             const pattern = getMatcherString(id, resolutionBase);
//             const fn = pm(pattern, { dot: true });
//             const result = fn(what);

//             return result;
//           },
//         };

//   const includeMatchers = ensureArray(include).map(getMatcher);
//   const excludeMatchers = ensureArray(exclude).map(getMatcher);

//   return function result(id: string): boolean {
//     if (typeof id !== "string") return false;

//     for (const matcher of excludeMatchers) {
//       if (matcher.test(id)) return false;
//     }

//     for (const matcher of includeMatchers) {
//       if (matcher.test(id)) return true;
//     }

//     return includeMatchers.length === 0;
//   };
// };
