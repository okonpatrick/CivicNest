const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const ownedRoots = ["packages", "services"].flatMap((area) => {
  const areaPath = path.join(root, area);
  return fs.readdirSync(areaPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      kind: area === "packages" ? "package" : "service",
      name: entry.name,
      path: path.join(areaPath, entry.name),
    }));
});

function findOwner(filePath) {
  const absolutePath = path.resolve(filePath);
  return ownedRoots.find((owner) => {
    const relativePath = path.relative(owner.path, absolutePath);
    return relativePath === "" ||
      (!relativePath.startsWith(`..${path.sep}`) &&
        relativePath !== ".." &&
        !path.isAbsolute(relativePath));
  });
}

function resolveImport(sourcePath, specifier) {
  const alias = /^@civicnest\/([^/]+)(?:\/.*)?$/.exec(specifier);
  if (alias) {
    return ownedRoots.find((owner) => owner.name === alias[1]);
  }

  if (!specifier.startsWith(".")) {
    return undefined;
  }

  return findOwner(path.resolve(path.dirname(sourcePath), specifier));
}

function collectImports(sourceFile) {
  const imports = [];
  function visit(node) {
    let specifier;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifier = node.moduleSpecifier.text;
    } else if (ts.isImportTypeNode(node)) {
      const argument = node.argument;
      if (
        ts.isLiteralTypeNode(argument) &&
        ts.isStringLiteral(argument.literal)
      ) {
        specifier = argument.literal.text;
      }
    } else if (
      ts.isCallExpression(node) &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0]) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))
    ) {
      specifier = node.arguments[0].text;
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      node.moduleReference.expression &&
      ts.isStringLiteral(node.moduleReference.expression)
    ) {
      specifier = node.moduleReference.expression.text;
    }

    if (specifier !== undefined) {
      imports.push({
        specifier,
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports;
}

function inspectSource(filePath, content) {
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const sourceOwner = findOwner(filePath);
  const diagnostics = [];

  for (const { specifier, line } of collectImports(sourceFile)) {
    const targetOwner = resolveImport(filePath, specifier);
    if (!targetOwner) {
      continue;
    }

    if (
      sourceOwner?.kind === "service" &&
      targetOwner.kind === "service" &&
      sourceOwner.name !== targetOwner.name
    ) {
      diagnostics.push({
        line,
        message: `service "${sourceOwner.name}" cannot import service "${targetOwner.name}"`,
      });
    } else if (
      sourceOwner?.kind === "package" &&
      targetOwner.kind === "service"
    ) {
      diagnostics.push({
        line,
        message: `shared package "${sourceOwner.name}" cannot import service "${targetOwner.name}"`,
      });
    }

    const isAnotherOwnedModule = targetOwner !== sourceOwner;
    if (
      isAnotherOwnedModule &&
      specifier !== `@civicnest/${targetOwner.name}`
    ) {
      diagnostics.push({
        line,
        message: `import "${specifier}" reaches ${targetOwner.kind} "${targetOwner.name}" outside its supported public-entry-point import`,
      });
    }
  }

  return diagnostics;
}

function runSelfTests() {
  const cases = [
    {
      name: "shared package root import is allowed",
      sourcePath: "services/resident-support/index.tsx",
      source: 'import { ServiceCard } from "@civicnest/ui";',
      expected: [],
    },
    {
      name: "host service entry-point alias is allowed",
      sourcePath: "src/app/App.tsx",
      source: 'import { PermitsModule } from "@civicnest/permits";',
      expected: [],
    },
    {
      name: "same-service relative import is allowed",
      sourcePath: "services/resident-support/index.tsx",
      source: 'import { helper } from "./helper";',
      expected: [],
    },
    {
      name: "cross-service package-root import is rejected",
      sourcePath: "services/resident-support/index.tsx",
      source: 'import { PermitsModule } from "@civicnest/permits";',
      expected: ["cannot import service"],
    },
    {
      name: "cross-service relative import is rejected",
      sourcePath: "services/resident-support/index.tsx",
      source: 'export { PermitsModule } from "../../services/permits/index";',
      expected: [
        "cannot import service",
        "outside its supported public-entry-point import",
      ],
    },
    {
      name: "shared package service import is rejected",
      sourcePath: "packages/ui/index.tsx",
      source: 'import { PermitsModule } from "@civicnest/permits";',
      expected: ["cannot import service"],
    },
    {
      name: "package deep alias import is rejected",
      sourcePath: "services/resident-support/index.tsx",
      source: 'import { Internal } from "@civicnest/ui/internal";',
      expected: ["outside its supported public-entry-point import"],
    },
    {
      name: "package relative deep import is rejected",
      sourcePath: "services/resident-support/index.tsx",
      source: 'import { Internal } from "../../packages/ui/internal";',
      expected: ["outside its supported public-entry-point import"],
    },
    {
      name: "host package relative deep import is rejected",
      sourcePath: "src/main.tsx",
      source: 'import { Internal } from "../packages/ui/internal";',
      expected: ["outside its supported public-entry-point import"],
    },
    {
      name: "host service deep alias is rejected",
      sourcePath: "src/app/App.tsx",
      source: 'import { Internal } from "@civicnest/permits/internal";',
      expected: ["outside its supported public-entry-point import"],
    },
    {
      name: "host service relative deep import is rejected",
      sourcePath: "src/app/App.tsx",
      source: 'import { Internal } from "../../services/permits/internal";',
      expected: ["outside its supported public-entry-point import"],
    },
    {
      name: "another service deep import is rejected",
      sourcePath: "services/resident-support/index.tsx",
      source: 'import { Internal } from "../../services/permits/internal";',
      expected: [
        "cannot import service",
        "outside its supported public-entry-point import",
      ],
    },
  ];

  for (const testCase of cases) {
    const diagnostics = inspectSource(
      path.resolve(root, testCase.sourcePath),
      testCase.source,
    );
    assert.equal(
      diagnostics.length,
      testCase.expected.length,
      `${testCase.name}: ${JSON.stringify(diagnostics)}`,
    );
    for (const expected of testCase.expected) {
      assert(
        diagnostics.some((diagnostic) => diagnostic.message.includes(expected)),
        `${testCase.name}: expected diagnostic containing "${expected}"`,
      );
    }
  }
  return cases.length;
}

function listSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(filePath);
    }
    return /\.(?:ts|tsx)$/.test(entry.name) ? [filePath] : [];
  });
}

const selfTestCount = runSelfTests();

const sourceFiles = ["src", "packages", "services"]
  .flatMap((directory) => listSourceFiles(path.join(root, directory)));
const failures = sourceFiles.flatMap((filePath) =>
  inspectSource(filePath, fs.readFileSync(filePath, "utf8")).map(
    ({ line, message }) => ({
      filePath: path.relative(root, filePath),
      line,
      message,
    }),
  ),
);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(
      `${failure.filePath}:${failure.line}: ${failure.message}`,
    );
  }
  process.exitCode = 1;
} else {
  console.log(
    `Dependency boundaries passed (${sourceFiles.length} source files; ${selfTestCount} controlled self-tests).`,
  );
}
