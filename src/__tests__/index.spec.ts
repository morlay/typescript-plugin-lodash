import * as ts from "typescript"
import { createLodashTransformer } from "../"

const transformer = createLodashTransformer()
const printer = ts.createPrinter()

const cases = [{
  title: "ignore * as _",
  src: `import * as _ from "lodash";`,
  dest: `import * as _ from "lodash";`,
}, {
  title: "ignore interfaces",
  src: `import { Dictionary } from "lodash";`,
  dest: `import { Dictionary } from "lodash";`,
}, {
  title: "test simple named imports",
  src: `import { find, map } from "lodash";
console.log(find, map);`,
  dest: `import * as find from "lodash/find";
import * as map from "lodash/map";
console.log(find, map);`,
}, {
  title: "test named imports with alias",
  src: `import { find as lodashFind, map as lodashMap } from "lodash";`,
  dest: `import * as lodashFind from "lodash/find";
import * as lodashMap from "lodash/map";`,
}, {
  title: "test with lodash-es and lodash/fp",
  src: `import { find } from "lodash-es";
import { map } from "lodash/fp";`,
  dest: `import * as find from "lodash-es/find";
import * as map from "lodash/fp/map";`,
}]

describe("test cases", () => {
  cases.forEach((caseItem) => {
    it(caseItem.title, () => {
      const sourceFile = ts.createSourceFile("test.ts", caseItem.src, ts.ScriptTarget.Latest)
      const transformedFile = ts.transform(sourceFile, [
        transformer,
      ]).transformed[0]
      expect(printer.printFile(transformedFile)).toEqual(caseItem.dest + "\n")
    })
  })
})
