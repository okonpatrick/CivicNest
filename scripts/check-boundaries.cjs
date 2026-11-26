const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

const defaultRoot = path.resolve(__dirname, "..");
const rootArgument = process.argv.indexOf("--root");
const root = rootArgument === -1
  ? defaultRoot
  : path.resolve(process.argv[rootArgument + 1]);
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

function getFixedString(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
    ? node.text
    : undefined;
}

function collectImports(sourceFile) {
  const imports = [];
  function visit(node) {
    let specifier;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier
    ) {
      specifier = getFixedString(node.moduleSpecifier);
    } else if (ts.isImportTypeNode(node)) {
      if (ts.isLiteralTypeNode(node.argument)) {
        specifier = getFixedString(node.argument.literal);
      }
    } else if (
      ts.isCallExpression(node) &&
      node.arguments.length === 1 &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))
    ) {
      specifier = getFixedString(node.arguments[0]);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      node.moduleReference.expression
    ) {
      specifier = getFixedString(node.moduleReference.expression);
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
    ...["resident-support", "permits", "community-services"].map((service) => ({
      name: `shared package fixed-template dynamic import of ${service} is rejected`,
      sourcePath: "packages/ui/index.tsx",
      source: `void import(\`@civicnest/${service}\`);`,
      expected: ["cannot import service"],
    })),
    {
      name: "fixed-template cross-service dynamic import is rejected",
      sourcePath: "services/resident-support/index.tsx",
      source: 'void import(`@civicnest/permits`);',
      expected: ["cannot import service"],
    },
    {
      name: "same-service fixed-template relative dynamic import is allowed",
      sourcePath: "services/resident-support/index.tsx",
      source: "void import(`./helper`);",
      expected: [],
    },
    {
      name: "substituted template dynamic import is not treated as fixed",
      sourcePath: "services/resident-support/index.tsx",
      source: 'void import(`@civicnest/${"permits"}`);',
      expected: [],
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
    {
      name: "fixed-template dynamic package deep import is rejected",
      sourcePath: "services/resident-support/index.tsx",
      source: 'void import(`@civicnest/ui/internal`);',
      expected: ["outside its supported public-entry-point import"],
    },
    {
      name: "fixed-template dynamic service deep import is rejected",
      sourcePath: "src/app/App.tsx",
      source: 'void import(`../../services/permits/internal`);',
      expected: ["outside its supported public-entry-point import"],
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

function runCommandSelfTest() {
  const fixtureRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "civicnest-boundary-command-"),
  );
  const hostDirectory = path.join(fixtureRoot, "src", "app");
  const serviceDirectory = path.join(fixtureRoot, "services", "permits");

  try {
    fs.mkdirSync(path.join(fixtureRoot, "packages"), { recursive: true });
    fs.mkdirSync(hostDirectory, { recursive: true });
    fs.mkdirSync(serviceDirectory, { recursive: true });
    fs.writeFileSync(
      path.join(hostDirectory, "host.ts"),
      "void import(`../../services/permits/internal`);\n",
    );
    fs.writeFileSync(
      path.join(serviceDirectory, "internal.ts"),
      "export const Internal = true;\n",
    );

    const result = spawnSync(
      process.execPath,
      [__filename, "--root", fixtureRoot],
      { encoding: "utf8" },
    );
    const output = `${result.stdout}\n${result.stderr}`;

    assert.equal(result.error, undefined, "boundary command starts");
    assert.notEqual(result.status, 0, "boundary command rejects the fixture");
    assert.match(
      output,
      /src[\\/]app[\\/]host\.ts:1: import .* reaches service "permits"/,
      "boundary command reports the prohibited import",
    );
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

const isFixtureScan = rootArgument !== -1;
const selfTestCount = isFixtureScan ? 0 : runSelfTests();
if (!isFixtureScan) {
  runCommandSelfTest();
}

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
    `Dependency boundaries passed (${sourceFiles.length} source files; ${selfTestCount} controlled rule tests and ${isFixtureScan ? 0 : 1} command-level test).`,
  );
}
