import { ScriptElementKind } from "typescript";
import type * as ts from "typescript/lib/tsserverlibrary";
import type {
  TemplateContext,
  TemplateLanguageService,
} from "typescript-template-language-service-decorator";
import { getSCSSLanguageService } from "vscode-css-languageservice";

export class LanguageService implements TemplateLanguageService {
  constructor(readonly info: ts.server.PluginCreateInfo) {}

  scssLanguageService = getSCSSLanguageService();

  getCompletionsAtPosition(
    context: TemplateContext,
    position: ts.LineAndCharacter,
  ): ts.CompletionInfo {
    const line = context.text.split(/\n/g)[position.line] ?? "";
    return {
      isGlobalCompletion: false,
      isMemberCompletion: false,
      isNewIdentifierLocation: false,
      entries: [
        {
          name: line.slice(0, position.character),
          kind: ScriptElementKind.unknown,
          kindModifiers: "echo",
          sortText: "echo",
        },
      ],
    };
  }

  // private getCompletion(context: TemplateContext, position: LineAndCharacter) {
  //   // const doc = context.node.getText();
  //   const position = undefined as unknown as Position;
  //   const doc = undefined as unknown as TextDocument;
  //   const stylesheet = this.scssLanguageService.parseStylesheet(doc);
  //   const completions = this.scssLanguageService.doComplete(
  //     doc,
  //     position,
  //     stylesheet,
  //   );
  // }
}
