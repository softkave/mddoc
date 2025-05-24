import * as caseFns from 'case';
import {promises as fs} from 'fs';

const kReplaceMfdocRegex = /(mfdoc)([\w-]*)/gi;

export function findAndReplaceMfdoc(input: string, replacement: string) {
  return input.replace(kReplaceMfdocRegex, (match, p1, p2) => {
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

export async function findAndReplaceMfdocInFile(
  filePath: string,
  replacement: string
) {
  const content = await fs.readFile(filePath, 'utf8');
  const newContent = findAndReplaceMfdoc(content, replacement);
  await fs.writeFile(filePath, newContent);
}

export async function findAndReplaceMfdocInFiles(
  filePaths: string[],
  replacement: string
) {
  for (const filePath of filePaths) {
    await findAndReplaceMfdocInFile(filePath, replacement);
  }
}

export async function findAndReplaceMfdocInFilesInDirectory(
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
      await findAndReplaceMfdocInFilesInDirectory(fullPath, replacement, opts);
    }
  }

  await findAndReplaceMfdocInFiles(filePathsToProcess, replacement);
}
