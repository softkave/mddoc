import * as caseFns from 'case';
import {promises as fs} from 'fs';

const kReplaceMddocRegex = /(mddoc)([\w-]*)/gi;

export function findAndReplaceMddoc(input: string, replacement: string) {
  return input.replace(kReplaceMddocRegex, (match, p1, p2) => {
    const caseOfP1 = caseFns.of(p1);
    let casedReplacement = replacement;

    switch (caseOfP1) {
      case 'pascal':
        casedReplacement = caseFns.pascal(replacement);
        break;
      case 'camel':
        casedReplacement = caseFns.camel(replacement);
        break;
      case 'snake':
        casedReplacement = caseFns.snake(replacement);
        break;
      case 'kebab':
        casedReplacement = caseFns.kebab(replacement);
        break;
      case 'header':
        casedReplacement = caseFns.header(replacement);
        break;
      case 'constant':
        casedReplacement = caseFns.constant(replacement);
        break;
      case 'upper':
        casedReplacement = caseFns.upper(replacement);
        break;
      case 'lower':
        casedReplacement = caseFns.lower(replacement);
        break;
      case 'capital':
        casedReplacement = caseFns.capital(replacement);
        break;
      default:
        casedReplacement = replacement;
    }

    const newString = `${casedReplacement}${p2}`;
    return newString;
  });
}

export async function findAndReplaceMddocInFile(
  filePath: string,
  replacement: string
) {
  const content = await fs.readFile(filePath, 'utf8');
  const newContent = findAndReplaceMddoc(content, replacement);
  await fs.writeFile(filePath, newContent);
}

export async function findAndReplaceMddocInFiles(
  filePaths: string[],
  replacement: string
) {
  for (const filePath of filePaths) {
    await findAndReplaceMddocInFile(filePath, replacement);
  }
}

export async function findAndReplaceMddocInFilesInDirectory(
  directoryPath: string,
  replacement: string,
  opts: {
    ignore?: string[];
    recursive?: boolean;
  } = {recursive: true}
) {
  const fileDirents = await fs.readdir(directoryPath, {
    withFileTypes: true,
  });

  const shouldIgnore = (path: string) => {
    if (!opts?.ignore) return false;
    return opts.ignore.some(pattern => path.includes(pattern));
  };

  const filePathsToProcess: string[] = [];

  for (const fileDirent of fileDirents) {
    if (shouldIgnore(fileDirent.name)) continue;

    if (fileDirent.isFile()) {
      const fullPath = `${directoryPath}/${fileDirent.name}`;
      filePathsToProcess.push(fullPath);
    } else if (fileDirent.isDirectory() && opts?.recursive) {
      const fullPath = `${directoryPath}/${fileDirent.name}`;
      await findAndReplaceMddocInFilesInDirectory(fullPath, replacement, opts);
    }
  }

  await findAndReplaceMddocInFiles(filePathsToProcess, replacement);
}
