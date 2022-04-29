import * as ts from "typescript";
// import { getMockDataForType as getMockDataBuiltinType } from "./mockData";
// @ts-ignore
import officeJsString from './office-js.d.ts?raw'

/**
 * Create a typescript compiler host for a groups of files
 */
function createCompilerHost(
    files: Record<string, string>,
    options: ts.CompilerOptions
): ts.CompilerHost {
    let cwd = ''

    return {
        getSourceFile,
        getDefaultLibFileName: () => "lib.d.ts",
        writeFile: (fileName, content) => files[fileName] = content,
        getCurrentDirectory: () => cwd,
        // getDirectories: path => Object.keys(files).filter((filename) => ),
        getCanonicalFileName: fileName => fileName,
        getNewLine: () => '\n',
        useCaseSensitiveFileNames: () => true,
        fileExists,
        readFile,
        resolveModuleNames
    };

    function fileExists(fileName: string): boolean {
        return !!files[fileName]
    }

    function readFile(fileName: string): string | undefined {
        return files[fileName]
    }

    function getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void) {
        const sourceText = files[fileName];
        return sourceText !== undefined
            ? ts.createSourceFile(fileName, sourceText, languageVersion)
            : undefined;
    }

    function resolveModuleNames(
        moduleNames: string[],
        containingFile: string
    ): ts.ResolvedModule[] {
        const resolvedModules: ts.ResolvedModule[] = [];
        for (const moduleName of moduleNames) {
            // try to use standard resolution
            let result = ts.resolveModuleName(moduleName, containingFile, options, {
                fileExists,
                readFile
            });
            if (result.resolvedModule) {
                resolvedModules.push(result.resolvedModule);
            } else {
                // check fallback locations, for simplicity assume that module at location
                // should be represented by '.d.ts' file
                // for (const location of moduleSearchLocations) {
                //     const modulePath = path.join(location, moduleName + ".d.ts");
                //     if (fileExists(modulePath)) {
                //         resolvedModules.push({ resolvedFileName: modulePath });
                //     }
                // }
            }
        }
        return resolvedModules;
    }
}

export interface TestGenerationContext {
    argumentsValues: ArrayLike<Record<string, any>>

    argumentsNames: Array<string>
    /**
     * The script compile result (in js)
     */
    compileResult: string
}


export function compileAndGenMock(
    script: string,
    officeJsDts: string = officeJsString,
): TestGenerationContext {
    const options: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.None
    }
    const files = {
        'office-js.d.ts': officeJsDts,
        'script.ts': script,
    }
    const host = createCompilerHost(files, options)
    // Build a program using the set of root file names in fileNames
    const program = ts.createProgram(Object.keys(files), options, host);

    // Get the checker, we will use it to find more about classes
    const checker = program.getTypeChecker();

    const scriptSource = program.getSourceFile('script.ts')!
    const argumentsResult: Array<{ name: string; type: ts.Node }> = []

    ts.forEachChild(scriptSource, (node) => {
        if (ts.isFunctionDeclaration(node)) {
            for (const param of node.parameters) {
                argumentsResult.push({
                    type: param.type!,
                    name: param.name.getText(),
                })
            }
        }
    })

    const dtsSource = program.getSourceFile('office-js.d.ts')
    if (!dtsSource) throw new Error()
    const typeRecord: Record<string, ts.Node> = {}
    const classRecord: Record<string, ts.Node> = {}

    function getTypeName(node: ts.ClassDeclaration | ts.InterfaceDeclaration | ts.EnumDeclaration) {
        return `Excel.${node.name!.getText()}`
    }
    function discoverTypes(node: ts.Node) {
        if (ts.isClassDeclaration(node) && node.name) {
            classRecord[getTypeName(node)] = node
        } else if (ts.isInterfaceDeclaration(node) && node.name) {
            typeRecord[getTypeName(node)] = node
            typeRecord[node.name.getText()] = node
        } else if (ts.isEnumDeclaration(node) && node.name) {
            typeRecord[getTypeName(node)] = node
        }
    }
    ts.forEachChild(dtsSource, (node) => {
        if (ts.isModuleDeclaration(node)) {
            if (node.name.text == 'Excel') {
                if (ts.isModuleBlock(node.body!)) {
                    for (const statement of node.body.statements) {
                        discoverTypes(statement)
                    }
                }
            }
        }
    })

    return {
        argumentsNames: argumentsResult.map(a => a.name),
        argumentsValues: getMockForObject(argumentsResult.map(({ name, type }) => [name, getMockData(type)]), ""),
        compileResult: ts.transpile(script, options, ''),
    }


    function getTypes(typeNode: ts.Node): string[] {
        if (ts.isUnionTypeNode(typeNode)) {
            // recursively handle union
            // const type = checker.getTypeAtLocation(typeNode)
            // if (type.isUnion()) {
            //     const allTypes = type.types
            // }
            return typeNode.types.map(getTypes).reduce((a, b) => [...new Set([...a, ...b])])
        } else {
            if (ts.isTypeReferenceNode(typeNode)) {
                if (typeNode.typeName.getText() === 'Array') {
                    // handle array generic
                    if (typeNode.typeArguments) {
                        const paramType = typeNode.typeArguments[0] // array only has one slot

                        // TODO: generate array in richer form
                        return getTypes(paramType) // wrap result as array
                    }
                }
            }
            if (ts.isLiteralTypeNode(typeNode)) {
                // console.log(`${ts.SyntaxKind[typeNode.literal.kind]} ${typeNode.literal.getText()}`)
                return [typeNode.literal.getText()]
            }
            let type: string
            switch (typeNode.kind) {
                case ts.SyntaxKind.NumberKeyword:
                case ts.SyntaxKind.StringKeyword:
                case ts.SyntaxKind.BooleanKeyword:
                case ts.SyntaxKind.TypeReference:
                case ts.SyntaxKind.UndefinedKeyword:
                    type = typeNode.getText()
                    break
                default:
                    throw new Error(`Unsupported syntex ${ts.SyntaxKind[typeNode.kind]}`)
            }
            const node = classRecord[type] || typeRecord[type]
            if (node) {
                if (ts.isEnumDeclaration(node) && node.name) {
                    const types = [] as string[]
                    for (const mem of node.members) {
                        if (mem.initializer) {
                            if (ts.isStringLiteral(mem.initializer) || ts.isNumericLiteral(mem.initializer)) {
                                types.push(mem.initializer.getText())
                            } else {
                                throw new Error(`Unsupported enum member ${node.name.getText()}: ${mem.getText()}`)
                            }
                        }
                    }
                    return types
                }
            }
            return [type]
        }

    }

    function getMockData(typeNode: ts.Node): ArrayLike<any> {
        const types = getTypes(typeNode)
        // const containers: ArrayLike<any>[] = [[null, undefined]]
        const containers: ArrayLike<any>[] = [[]]
        const literals = types.filter(t => /^".+"$/g.test(t))
        if (literals.length > 0) {
            containers.push(literals.map(s => s.substring(1, s.length - 1)))
        }
        for (const type of types.filter(t => !/^".+"$/g.test(t))) {
            // const data = getMockDataBuiltinType(type)
            // if (data) {
                // containers.push(data)
                // continue
            // }

            const node = classRecord[type] || typeRecord[type]
            if (node) {
                if (ts.isClassDeclaration(node) && node.name) {
                    containers.push(visitClass(node))
                    continue
                } else if (ts.isInterfaceDeclaration(node) && node.name) {
                    containers.push(visitInterface(node))
                    continue
                }
            }
            throw new Error(`Unsupported type ${type}`)
        }
        const count = containers.map(c => c.length).reduce((a, b) => a + b, 0)

        const result = new Proxy({}, {
            get(target, key) {
                if (key === 'type') {
                    return types.join(' | ')
                } else if (key === 'length') {
                    return count
                } else {
                    const index = parseInt(key as string, 10)
                    if (Number.isInteger(index)) {
                        let cur = index
                        for (let i = 0; i < containers.length; ++i) {
                            const currentContainer = containers[i]
                            if (cur < currentContainer.length) {
                                return currentContainer[cur]
                            } else {
                                cur -= currentContainer.length
                            }
                        }
                    }
                }
            }
        }) as ArrayLike<any>

        // console.log(`union ${result.type}`)

        return result
    }

    function visitClass(node: ts.ClassDeclaration) {
        const mockData: any[] = []
        for (const mem of node.members) {
            // console.log(ts.SyntaxKind[mem.kind])
        }
        return mockData
    }

    function getMockForObject(properties: Array<[string, ArrayLike<any>]>, type: string) {
        function calculateCount(dimensions: number[]) {
            const counts: number[] = new Array(dimensions.length)
            counts[dimensions.length - 1] = dimensions[dimensions.length - 1]
            for (let i = dimensions.length - 2; i >= 0; --i) {
                counts[i] = counts[i + 1] * dimensions[i]
            }
            return counts
        }
        function getIndices(index: number, counts: number[]) {
            const result: number[] = new Array(counts.length)

            result.fill(0)

            // console.log(`Get index ${index} ${JSON.stringify(counts)}`)

            let remaining = index
            for (let i = 0; i < counts.length - 1; i++) {
                // console.log(`iteration ${i}: remaining ${remaining}`)
                const count = counts[i + 1];
                result[i] = Math.floor(remaining / count)
                // console.log(`${remaining} / ${count} = ${result[i]} mod ${remaining % count}`)
                remaining = remaining % count
            }
            result[counts.length - 1] = remaining
            return result
        }
        const dimensions = properties.map(p => p[1].length)
        const counts = calculateCount(dimensions)
        return new Proxy({}, {
            get(target, key) {
                if (key === 'type') {
                    return type
                } else if (key === 'length') {
                    return counts[0] as number
                } else {
                    const index = parseInt(key as string, 10)
                    if (Number.isInteger(index)) {
                        const indices = getIndices(index, counts)
                        // console.log(`${type} map ${index} -> ${JSON.stringify(indices)}`)
                        const object = {} as any
                        for (let i = 0; i < indices.length; i++) {
                            const [key, values] = properties[i]
                            const value = values[indices[i]]
                            object[key] = value
                        }
                        return object
                    }
                }
            }
        }) as ArrayLike<any>
    }

    function visitInterface(node: ts.InterfaceDeclaration): ArrayLike<any> {
        const properties: Array<[string, ArrayLike<any>]> = []
        for (const mem of node.members) {
            if (ts.isPropertySignature(mem)) {
                properties.push([mem.name.getText(), getMockData(mem.type!)])
            } else if (ts.isMethodSignature(mem)) {
                throw new Error(`Unsupported function in interface ${node.name.getText()}`)
            }
        }
        const result = getMockForObject(properties, node.name.getText())

        console.log(`${node.name.getText()} total ${result.length} with ${properties.length} properties`)

        return result
    }
}


