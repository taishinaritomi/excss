// import type * as ts from "typescript/lib/tsserverlibrary";
// import { decorateWithTemplateLanguageService } from "typescript-template-language-service-decorator";
// import { LanguageService } from "./LanguageService";

// export = (mod: { typescript: typeof ts }) => {
//   return {
//     create(info: ts.server.PluginCreateInfo): ts.LanguageService {
//       info.project.projectService.logger.info("start excss ts plugin");
//       return decorateWithTemplateLanguageService(
//         mod.typescript,
//         info.languageService,
//         info.project,
//         new LanguageService(info),
//         {
//           tags: ["css"],
//           enableForStringWithSubstitutions: true,
//         },
//       );
//     },
//   };
// };

import x from "@styled/typescript-styled-plugin";

export = x;
