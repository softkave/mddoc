import {execSync} from 'child_process';
import fse from 'fs-extra';
import path from 'path';
import {
  addScriptToPackageJson,
  hasPackageJson,
  InstallScriptProvider,
  kInstallScripts,
} from './utils.js';

/**
 * setup js sdk
 * - generate from scratch
 * - update existing
 *
 * generate from scratch
 * - clone from template
 * - install js sdk base
 * - update package.json
 *   - name
 *
 * update existing
 * - ensure js sdk base is installed
 * - add "pretty" script to package.json
 * - ensure "AbstractSdkEndpoints", "getDefaultSdkConfig", "SdkConfig",
 *   "endpointsIndex" are present in the src/endpoints folder
 */

async function installMfdocJsSdkBase(params: {
  outputPath: string;
  provider?: InstallScriptProvider;
}) {
  const {outputPath, provider = 'npm'} = params;
  const version = 'latest';
  execSync(`${kInstallScripts[provider]('mfdoc-js-sdk-base@' + version)}`, {
    cwd: outputPath,
    stdio: 'inherit',
  });
}

async function updatePackageJsonName(params: {
  outputPath: string;
  name: string;
}) {
  const {outputPath, name} = params;
  const packageJson = await fse.readJson(path.join(outputPath, 'package.json'));
  packageJson.name = name;
  await fse.writeJson(path.join(outputPath, 'package.json'), packageJson, {
    spaces: 2,
  });
}

async function cloneFromTemplate(params: {outputPath: string}) {
  const {outputPath} = params;
  await fse.ensureDir(outputPath);
  await fse.copy(
    path.join(import.meta.dirname, '..', 'templates', 'mfdoc-js-sdk-template'),
    outputPath,
    {
      filter: (src, dest) => {
        if (src.includes('node_modules')) {
          return false;
        }
        return true;
      },
    }
  );
}

async function ensureEndpointsFolder(params: {outputPath: string}) {
  const {outputPath} = params;
  await fse.ensureDir(path.join(outputPath, 'src', 'endpoints'));

  const filesToCopy = [
    {name: 'AbstractSdkEndpoints.ts', overwrite: true},
    {name: 'getDefaultSdkConfig.ts', overwrite: false},
    {name: 'SdkConfig.ts', overwrite: false},
    {name: 'endpointsIndex.ts', overwrite: true},
  ];

  for (const file of filesToCopy) {
    const srcPath = path.join(
      import.meta.dirname,
      '..',
      'templates',
      'mfdoc-js-sdk-template',
      'src',
      'endpoints',
      file.name
    );
    const destPath = path.join(outputPath, 'src', 'endpoints', file.name);
    if (await fse.pathExists(destPath)) {
      if (file.overwrite) {
        await fse.remove(destPath);
      } else {
        continue;
      }
    }
    console.log('copying', srcPath, 'to', destPath);
    await fse.copy(srcPath, destPath, {
      overwrite: file.overwrite,
      errorOnExist: false,
    });
  }
}

export async function setupJsSdk(params: {
  outputPath: string;
  name: string;
  provider?: InstallScriptProvider;
}) {
  const {outputPath, name, provider = 'npm'} = params;

  console.log('name', name);
  console.log('provider', provider);
  console.log('outputPath', outputPath);
  console.log('--------------------------------');

  if (await hasPackageJson({outputPath})) {
    console.log('updating existing js sdk');
    console.log('installing mfdoc-js-sdk-base');
    await installMfdocJsSdkBase({outputPath, provider});
    console.log('adding "pretty" script to package.json');
    await addScriptToPackageJson({
      outputPath,
      scriptName: 'pretty',
      scriptValue: 'prettier --write',
    });
    console.log('ensuring endpoints folder');
    await ensureEndpointsFolder({outputPath});
    return;
  }

  console.log('cloning from template');
  await cloneFromTemplate({outputPath});
  console.log('updating package.json name');
  await updatePackageJsonName({outputPath, name});
  console.log('installing mfdoc-js-sdk-base');
  await installMfdocJsSdkBase({outputPath, provider});
}
