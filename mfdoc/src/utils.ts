import assert from 'assert';
import fse from 'fs-extra';
import {identity} from 'lodash-es';
import path from 'path';
import {indexArray, pathSplit} from 'softkave-js-utils';
import {MfdocHttpEndpointDefinitionTypePrimitive} from './mfdoc.js';

export function filterEndpointsByTags(
  endpoints: MfdocHttpEndpointDefinitionTypePrimitive[],
  tags: string[]
) {
  if (tags.length === 0) {
    return endpoints;
  }

  const tagsMap = indexArray(tags, {indexer: identity});
  return endpoints.filter(endpoint => {
    return endpoint.tags?.some(tag => tagsMap[tag]);
  });
}

export async function hasPackageJson(params: {outputPath: string}) {
  const {outputPath} = params;
  const pkgJsonPath = path.join(outputPath, 'package.json');
  return (
    (await fse.exists(pkgJsonPath)) && (await fse.stat(pkgJsonPath)).isFile()
  );
}

export const kInstallScripts = {
  npm: (pkgName: string) => `npm install ${pkgName}`,
  yarn: (pkgName: string) => `yarn add ${pkgName}`,
  pnpm: (pkgName: string) => `pnpm add ${pkgName}`,
  bun: (pkgName: string) => `bun add ${pkgName}`,
  deno: (pkgName: string) => `deno add ${pkgName}`,
} as const;

export type InstallScriptProvider = keyof typeof kInstallScripts;

export async function hasPkgInstalled(params: {
  outputPath: string;
  pkgName: string;
}) {
  const {outputPath, pkgName} = params;
  return (
    (await fse.exists(path.join(outputPath, 'node_modules', pkgName))) &&
    (
      await fse.stat(path.join(outputPath, 'node_modules', pkgName))
    ).isDirectory()
  );
}

export function getEndpointNames(
  endpoint: MfdocHttpEndpointDefinitionTypePrimitive
) {
  const endpointName = endpoint.name
    ? pathSplit({input: endpoint.name}).filter(p => p.length > 0)
    : undefined;
  const pathname = endpoint.path
    .split('/')
    .filter(p => !p.startsWith(':') && p.length > 0);
  const names = endpointName || pathname;
  assert(names.length > 0, 'names is required');
  return names;
}

export async function addScriptToPackageJson(params: {
  outputPath: string;
  scriptName: string;
  scriptValue: string;
}) {
  const {outputPath, scriptName, scriptValue} = params;
  const pkgJsonPath = path.join(outputPath, 'package.json');
  await fse.ensureFile(pkgJsonPath);
  const pkgJson = await fse.readJson(pkgJsonPath);
  pkgJson.scripts = pkgJson.scripts || {};
  pkgJson.scripts[scriptName] = scriptValue;
  await fse.writeJson(pkgJsonPath, pkgJson, {spaces: 2});
}
