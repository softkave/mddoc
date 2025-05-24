import fse from 'fs-extra';
import {identity} from 'lodash-es';
import path from 'path';
import {indexArray} from 'softkave-js-utils';
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
