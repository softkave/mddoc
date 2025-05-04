import assert from 'assert';
import fse from 'fs-extra';
import path from 'path';
import {findAndReplaceMddocInFilesInDirectory} from './findAndReplace.js';

export async function getMddocJsSdkPath() {
  const jsSdkPath = path.join(__dirname, '..', 'sdk-templates', 'js-sdk');
  assert(await fse.exists(jsSdkPath), `JsSdk path ${jsSdkPath} does not exist`);
  return jsSdkPath;
}

export async function isJsSdkSetup(params: {outputPath: string}) {
  const {outputPath} = params;
  return (
    (await fse.exists(outputPath)) &&
    (await fse.stat(outputPath)).isDirectory() &&
    (await fse.exists(path.join(outputPath, 'package.json')))
  );
}

export async function setupJsSdk(params: {outputPath: string}) {
  const {outputPath} = params;

  if (await isJsSdkSetup({outputPath})) {
    return;
  }

  const jsSdkPath = await getMddocJsSdkPath();
  await fse.ensureDir(outputPath);
  await fse.copy(jsSdkPath, outputPath, {
    filter: (src, dest) => {
      return !src.includes('node_modules');
    },
  });

  await findAndReplaceMddocInFilesInDirectory(outputPath, 'mddoc', {
    ignore: ['node_modules'],
  });
}
