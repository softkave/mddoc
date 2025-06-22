import fse from 'fs-extra';

export async function addCodeLinesToIndex(params: {
  indexPath: string;
  codeLines: {line: string; keywords: string[]}[];
}) {
  const {indexPath, codeLines} = params;
  await fse.ensureFile(indexPath);
  const indexText = await fse.readFile(indexPath, {encoding: 'utf-8'});
  const codeLinesNotFound = codeLines.filter(
    ({line, keywords}) =>
      !indexText.includes(line) &&
      !keywords.some(keyword => indexText.includes(keyword))
  );
  if (codeLinesNotFound.length) {
    await fse.writeFile(
      indexPath,
      indexText + codeLinesNotFound.map(l => l.line).join('\n'),
      {
        encoding: 'utf-8',
      }
    );
  }
}
