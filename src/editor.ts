import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import officeJsString from './office-js.d.ts?raw'
import libDTsString from '../libs/dist/index.d.ts?raw'
import sampleString from '../sample/index.ts?raw'
import preloadString from '../libs/dist/index.js?raw'
import { intellisenseTypes, intellisenseSynchronous } from 'office-script-synchronous'

// @ts-ignore
self.MonacoEnvironment = {
    getWorker(moduleId, label) {
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker({ name: label });
        }
        return new editorWorker({ name: label });
    },
};

const promise = import('monaco-editor').then(({ languages, editor, KeyCode, Uri }) => {
    languages.typescript.typescriptDefaults.setCompilerOptions({
        target: languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
        module: languages.typescript.ModuleKind.ESNext,
        allowSyntheticDefaultImports: true,
    });

    const libs = {

    }

    languages.typescript.typescriptDefaults.addExtraLib(
        officeJsString,
        `file:///node_modules/office-js.d.ts`,
    );
    languages.typescript.typescriptDefaults.addExtraLib(
        libDTsString,
        `file:///node_modules/google-addon.d.ts`,
    )
    languages.typescript.typescriptDefaults.addExtraLib(
        'declare type int = number; declare type color = string; declare type NumberFormat = string; declare type float = number; declare const context: Excel.RequestContext',
        'file:///node_modules/builtin.d.ts',
    )

    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const editorDom = document.getElementById('editor')!
    const standoneEditor = editor.create(editorDom, {
        language: 'typescript',
        // theme: isDark ? "vs-dark" : 'vs',
        automaticLayout: true,
    });
    const model = editor.createModel(sampleString, 'typescript')
    standoneEditor.setModel(model)
    standoneEditor.onDidChangeModelContent((e) => {
        console.log(e)
    })

    // standoneEditor.onDidChangeModel((e) => {
    //     history.push(e.newModelUrl)
    // })

    // languages.typescript.typescriptDefaults.
    // const service = standoneEditor._codeEditorService;
    // const openEditorBase = service.openCodeEditor.bind(service);
    // service.openCodeEditor = async (input, source) => {
    //     const result = await openEditorBase(input, source);
    //     if (!result) {
    //         const model = editor.getModel(input.resource)
    //         source.setModel(model)
    //         source.setSelection(input.options.selection)
    //         source.revealLines(input.options.selection.startLineNumber,
    //             input.options.selection.endLineNumber,
    //             input.options.selectionRevealType)
    //     }
    //     return result;
    // }

    // standoneEditor.addCommand(KeyCode.F2, () => {
    //     languages.typescript.getTypeScriptWorker()
    //         .then(function (worker) {
    //             worker(models.common.uri).then(function (client) {
    //                 client.getEmitOutput(models.common.uri.toString()).then(function (r) {
    //                     // const code = r.outputFiles[0].text;
    //                     const code = `let localRequire = require; require = this.require; ${r.outputFiles[0].text}; require = localRequire;`;
    //                     evalInScope(code)
    //                 });
    //             });
    //         });
    // });

    const run = () => {
        // preloadString
    }

    return { editor: standoneEditor, languages, run }
});


export function getEditor() {
    return promise
}