import { CompileCodeResult } from "office-script-synchronous/dist/lib/CompileCodeResult";
import ts from "typescript"
/**
 * required typescript compiler to be loaded
 * @param code the code to compile
 */
export async function compileCode(code: string): Promise<CompileCodeResult> {
  // const ts = await import("typescript");

  // console.log('compileCode')
  // console.log(code)

  // Upgrade the target on non IE11 browsers to avoid issues releated to TypeScript compiler es5 support.
  // This simply avoids hitting es5 support issues on newer browsers.
  const target = ts.ScriptTarget.ES2019;
  const lib = ["dom", "es2019"];

  const result = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      target,
      lib,
      allowJs: true,
    },
  });

  if (result.diagnostics!.length) {
    const compileErrorMessage = result
      .diagnostics!.map((item) => {
        const upThroughError = code.substr(0, item.start);
        const afterError = code.substr(item.start! + 1);
        const lineNumber = upThroughError.split("\n").length;
        const startIndexOfThisLine = upThroughError.lastIndexOf("\n");
        const lineText = code
          .substring(
            startIndexOfThisLine,
            item.start! + Math.max(afterError.indexOf("\n"), 0),
          )
          .trim();
        const message = `${item.messageText}\n ${lineText}`;
        return new Error(`${lineNumber}: ${message}`);
      })
      .join("\n\n");

    return {
      compileErrorMessage,
    };
  }

  // Manually remove es2015 module generation
  const outputText = result.outputText.replace(
    'Object.defineProperty(exports, "__esModule", { value: true });',
    "",
  );

  // console.log(`Typescript output: ${outputText}`)

  return {
    outputText,
  };
}
