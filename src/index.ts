import * as lodash from "lodash"
import * as ts from "typescript"

const lodashExposables = lodash.keys(lodash)

const isExposableLodashMethod = (method: string): boolean => lodashExposables.indexOf(method) > -1

const isLodashModule = (s: string): boolean => {
  return ["lodash", "lodash-es", "lodash/fp"].indexOf(s) > -1
}

export const createLodashTransformer = (): ts.TransformerFactory<ts.SourceFile> => {
  return (context: ts.TransformationContext) => {
    const visitor: ts.Visitor = (node) => {
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        isLodashModule((node.moduleSpecifier as ts.StringLiteral).text)) {
        const moduleName = (node.moduleSpecifier as ts.StringLiteral).text
        const namedBindings = node.importClause!.namedBindings

        if ((namedBindings as ts.NamedImports).elements && (namedBindings as ts.NamedImports).elements.length > 0) {
          const elements = (namedBindings as ts.NamedImports).elements

          return elements.map((element) => {
              const name = element.name.text
              const propertyName = element.propertyName ? element.propertyName!.text : name

              if (isExposableLodashMethod(propertyName)) {
                return ts.createImportDeclaration(
                  undefined,
                  undefined,
                  ts.createImportClause(undefined, ts.createNamespaceImport(ts.createIdentifier(name))),
                  ts.createLiteral(
                    moduleName === "lodash-es"
                      ? `lodash/${propertyName}`
                      : `${moduleName}/${propertyName}`,
                  ),
                )
              }

              return ts.createImportDeclaration(
                undefined,
                undefined,
                ts.createImportClause(undefined, ts.createNamedImports([
                  element,
                ])),
                ts.createLiteral(`${moduleName}`),
              )
            },
          )
        }
      }
      return ts.visitEachChild(node, visitor, context)
    }

    return (node) => ts.visitNode(node, visitor)
  }
}
