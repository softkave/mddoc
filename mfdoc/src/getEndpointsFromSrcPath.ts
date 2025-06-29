import assert from 'assert';
import path, {isAbsolute} from 'path';
import {tsImport} from 'tsx/esm/api';
import {
  isMfdocEndpoint,
  MfdocHttpEndpointDefinitionTypePrimitive,
} from './mfdoc.js';

export async function getEndpointsFromSrcPath(params: {srcPath: string}) {
  const {srcPath} = params;
  assert.ok(
    isAbsolute(srcPath),
    `srcPath must be an absolute path: ${srcPath}`
  );
  const tsconfigPath = path.join(
    import.meta.dirname,
    '..',
    'other',
    'tsconfig.tsx.json'
  );

  const exported = await tsImport(srcPath, {
    parentURL: import.meta.url,
    tsconfig: tsconfigPath,
  });

  const exportedList = Object.values(exported);
  const endpoints = exportedList.filter(item =>
    isMfdocEndpoint(item)
  ) as MfdocHttpEndpointDefinitionTypePrimitive[];

  return endpoints;

  // const code = await fse.readFile(srcPath, 'utf-8');
  // const strippedCode = stripTypeScriptTypes(code, {
  //   mode: 'transform',
  //   sourceMap: true,
  // });

  // const filename = path.basename(srcPath);
  // const script = new vm.Script(strippedCode, {
  //   filename,
  //   importModuleDynamically: vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  // });
  // const exported = script.runInThisContext();

  // const exportedList = Object.values(exported);
  // const endpoints = exportedList.filter(item =>
  //   isMfdocEndpoint(item)
  // ) as MfdocHttpEndpointDefinitionTypePrimitive[];

  // return endpoints;
}
