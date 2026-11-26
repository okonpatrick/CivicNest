const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const contractDocument = path.join(root, "docs", "public-contracts.md");
const consumerFixtures = path.join(root, "consumer-fixtures");
const packageEntryPoints = new Map([
  [
    "@civicnest/design-tokens",
    path.join(root, "packages", "design-tokens", "index.ts"),
  ],
  ["@civicnest/ui", path.join(root, "packages", "ui", "index.tsx")],
  ["@civicnest/utils", path.join(root, "packages", "utils", "index.ts")],
]);
const errors = [];

function readDocumentedExports() {
  const documented = new Map(
    Array.from(packageEntryPoints.keys(), (packageName) => [
      packageName,
      new Set(),
    ]),
  );
  const lines = fs.readFileSync(contractDocument, "utf8").split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    if (!line.startsWith("|")) {
      continue;
    }

    const cells = line
      .trim()
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    const packageMatch = /^`(@civicnest\/[^`]+)`$/.exec(cells[0] ?? "");
    const exportMatch = /^`([^`]+)`$/.exec(cells[1] ?? "");
    if (!packageMatch || !exportMatch) {
      continue;
    }

    const packageName = packageMatch[1];
    const exportedName = exportMatch[1];
    const packageExports = documented.get(packageName);
    if (!packageExports) {
      errors.push(
        `${contractDocument}:${index + 1}: undocumented shared package ${packageName}`,
      );
      continue;
    }
    if (packageExports.has(exportedName)) {
      errors.push(
        `${contractDocument}:${index + 1}: duplicate documented export ${packageName}.${exportedName}`,
      );
    }
    packageExports.add(exportedName);
  }

  return documented;
}

function readPackageExports(entryPoint) {
  const configPath = path.join(root, "tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error) {
    errors.push(
      `Could not read tsconfig.json: ${ts.flattenDiagnosticMessageText(config.error.messageText, "\n")}`,
    );
    return new Set();
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    root,
    undefined,
    configPath,
  );
  const program = ts.createProgram(parsedConfig.fileNames, {
    ...parsedConfig.options,
    noEmit: true,
  });
  const sourceFile = program.getSourceFile(entryPoint);
  if (!sourceFile) {
    errors.push(`Package entry point does not exist: ${entryPoint}`);
    return new Set();
  }

  const moduleSymbol = program.getTypeChecker().getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) {
    errors.push(
      `Could not inspect exports from package entry point: ${entryPoint}`,
    );
    return new Set();
  }

  return new Set(
    program
      .getTypeChecker()
      .getExportsOfModule(moduleSymbol)
      .map((exportedSymbol) => exportedSymbol.getName()),
  );
}

function listFixtureFiles(directory) {
  if (!fs.existsSync(directory)) {
    errors.push(`Consumer fixture directory does not exist: ${directory}`);
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? listFixtureFiles(entryPath)
      : /\.(?:ts|tsx)$/.test(entry.name)
        ? [entryPath]
        : [];
  });
}

function verifyFixtureImports() {
  const usedPackages = new Set();
  const approvedPackages = new Set(packageEntryPoints.keys());

  for (const filePath of listFixtureFiles(consumerFixtures)) {
    const sourceFile = ts.createSourceFile(
      filePath,
      fs.readFileSync(filePath, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );

    function visit(node) {
      let specifier;
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        specifier = node.moduleSpecifier.text;
      } else if (
        ts.isImportTypeNode(node) &&
        ts.isLiteralTypeNode(node.argument) &&
        ts.isStringLiteral(node.argument.literal)
      ) {
        specifier = node.argument.literal.text;
      } else if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword &&
        node.arguments.length === 1 &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        specifier = node.arguments[0].text;
      }

      if (specifier?.startsWith("@civicnest/")) {
        if (!approvedPackages.has(specifier)) {
          errors.push(
            `${path.relative(root, filePath)} imports unsupported package path "${specifier}"; use a documented shared package root`,
          );
        } else {
          usedPackages.add(specifier);
        }
      } else if (specifier?.startsWith(".")) {
        const resolvedPath = path.resolve(path.dirname(filePath), specifier);
        for (const internalDirectory of ["packages", "services", "src"]) {
          const internalRoot = path.join(root, internalDirectory);
          const relativePath = path.relative(internalRoot, resolvedPath);
          if (
            relativePath === "" ||
            (!relativePath.startsWith(`..${path.sep}`) &&
              relativePath !== ".." &&
              !path.isAbsolute(relativePath))
          ) {
            errors.push(
              `${path.relative(root, filePath)} imports workspace implementation "${specifier}"; use a documented shared package root`,
            );
            break;
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  for (const packageName of packageEntryPoints.keys()) {
    if (!usedPackages.has(packageName)) {
      errors.push(
        `Consumer fixtures must exercise the documented package entry point ${packageName}`,
      );
    }
  }
}

function main() {
  const documentedExports = readDocumentedExports();

  for (const [packageName, entryPoint] of packageEntryPoints) {
    const expected = documentedExports.get(packageName) ?? new Set();
    const actual = readPackageExports(entryPoint);

    for (const exportedName of expected) {
      if (!actual.has(exportedName)) {
        errors.push(
          `${packageName} is missing documented export "${exportedName}"`,
        );
      }
    }
    for (const exportedName of actual) {
      if (!expected.has(exportedName)) {
        errors.push(
          `${packageName} exports undocumented symbol "${exportedName}"; document it or keep it private`,
        );
      }
    }
    if (expected.size === 0) {
      errors.push(
        `No public exports for ${packageName} were found in ${path.relative(root, contractDocument)}`,
      );
    }
  }

  verifyFixtureImports();

  if (errors.length > 0) {
    console.error("Public contract verification failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  const exportCount = Array.from(documentedExports.values()).reduce(
    (total, names) => total + names.size,
    0,
  );
  console.log(
    `Public contracts passed (${exportCount} documented exports across ${packageEntryPoints.size} shared packages; consumer fixtures use approved entry points).`,
  );
}

main();
