import assert from 'assert';
import fse from 'fs-extra';
import {compact, identity, isArray, isUndefined} from 'lodash-es';
import path from 'path';
import {indexArray, pathSplit} from 'softkave-js-utils';
import {
  isMfdocFieldArray,
  isMfdocFieldBase,
  isMfdocFieldObjectField,
  isMfdocFieldOrCombination,
  MfdocHttpEndpointDefinitionTypePrimitive,
} from './mfdoc.js';

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
  assert.ok(names.length > 0, 'names is required');
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

type DescriptionOrExample =
  | string
  | unknown
  | undefined
  | (string | undefined | unknown)[];

export function gatherDescriptionAndExample(item: unknown) {
  const descriptions: (string | undefined | unknown)[] = [];
  const examples: (string | undefined | unknown)[] = [];

  if (isMfdocFieldArray(item)) {
    const {descriptions: typeDescriptions, examples: typeExamples} =
      gatherDescriptionAndExample(item.type);

    if (item.description) {
      descriptions.push(item.description);
    } else {
      descriptions.push(
        ...typeDescriptions.map(description =>
          description ? `[Array] ${description}` : undefined
        )
      );
    }

    if (!isUndefined(item.example)) {
      examples.push(item.example);
    } else {
      examples.push(
        ...typeExamples.map(example => (example ? [example] : example))
      );
    }
  } else if (isMfdocFieldOrCombination(item)) {
    if (item.description) {
      descriptions.push(item.description);
    }
    if (!isUndefined(item.example)) {
      examples.push(item.example);
    }

    item.types.forEach((type: unknown) => {
      const {descriptions: typeDescriptions, examples: typeExamples} =
        gatherDescriptionAndExample(type);
      if (!descriptions.length) {
        descriptions.push(...typeDescriptions);
      }
      if (!examples.length) {
        examples.push(...typeExamples);
      }
    });
  } else if (isMfdocFieldObjectField(item)) {
    const {descriptions: dataDescriptions, examples: dataExamples} =
      gatherDescriptionAndExample(item.data);

    if (item.description) {
      descriptions.push(item.description);
    } else {
      descriptions.push(...dataDescriptions);
    }

    if (!isUndefined(item.example)) {
      examples.push(item.example);
    } else {
      examples.push(...dataExamples);
    }
  } else if (isMfdocFieldBase(item)) {
    descriptions.push(item.description);
    examples.push(item.example);
  }

  return {descriptions, examples};
}

export function getDescriptionForEndpointInfo(
  inputDescriptions: DescriptionOrExample,
  inputExamples?: DescriptionOrExample
) {
  const descriptions = compact(
    Array.isArray(inputDescriptions) ? inputDescriptions : [inputDescriptions]
  );
  const examples = compact(
    Array.isArray(inputExamples) ? inputExamples : [inputExamples]
  );
  let comment = descriptions.join('\n');
  if (examples) {
    comment += `\n\nExamples:\n${examples.join('\n')}`;
  }
  return comment;
}

export function getDescriptionForJsDoc(
  inputDescriptions: DescriptionOrExample,
  inputExamples?: DescriptionOrExample
) {
  const descriptions = compact(
    Array.isArray(inputDescriptions) ? inputDescriptions : [inputDescriptions]
  );
  const examples = compact(
    Array.isArray(inputExamples) ? inputExamples : [inputExamples]
  );

  let comment = '';
  const descriptionText = descriptions.join('&emsp; ·&emsp;\n');
  const examplesText = examples
    ?.map(example =>
      isArray(example) || typeof example === 'object'
        ? `\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\``
        : example
        ? `\`\`\`\n${example.toString()}\n\`\`\``
        : ''
    )
    .join('\n\n');
  if (descriptionText) {
    comment += descriptionText;
  }
  if (examplesText) {
    comment += `\n\n@example\n${examplesText}`;
  }
  return comment;
}

export function stringToJsDoc(input?: string) {
  if (!input) {
    return '';
  }
  const lines = input.split('\n').filter(line => line.trim() !== '');
  const comment = lines.map(line => ` * ${line}`).join('\n');
  return `/**\n${comment}\n */`;
}
