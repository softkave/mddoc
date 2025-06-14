import fse from 'fs-extra';

export async function addCodeLinesToIndex(params: {
  indexPath: string;
  codeLines: string[];
}) {
  const {indexPath, codeLines} = params;
  await fse.ensureFile(indexPath);
  const indexText = await fse.readFile(indexPath, {encoding: 'utf-8'});
  const codeLinesNotFound = codeLines.filter(line => !indexText.includes(line));
  if (codeLinesNotFound.length) {
    await fse.writeFile(indexPath, indexText + codeLinesNotFound.join('\n'), {
      encoding: 'utf-8',
    });
  }
}
