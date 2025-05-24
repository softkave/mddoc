import fse from 'fs-extra';
import {forEach} from 'lodash-es';
import {getEndpointsFromSrcPath} from './getEndpointsFromSrcPath.js';
import {MddocHttpEndpointDefinitionTypePrimitive} from './mddoc.js';
import {filterEndpointsByTags} from './utils.js';

function generateTableOfContentFromMddoc(params: {
  endpoints: MddocHttpEndpointDefinitionTypePrimitive[];
  tags: string[];
}) {
  const {endpoints, tags} = params;
  const tableOfContent: Array<[string, string]> = [];
  const pickedEndpoints = filterEndpointsByTags(endpoints, tags);

  forEach(pickedEndpoints, e1 => {
    tableOfContent.push([e1.name, e1.method]);
  });

  return tableOfContent;
}

export async function genHttpApiTableOfContent(params: {
  endpoints: MddocHttpEndpointDefinitionTypePrimitive[];
  tags: string[];
  outputPath: string;
}) {
  const {endpoints, tags, outputPath} = params;
  const tableOfContent = generateTableOfContentFromMddoc({
    endpoints,
    tags,
  });

  await fse.ensureFile(outputPath);
  return fse.writeFile(
    outputPath,
    JSON.stringify(tableOfContent, /** replacer */ undefined, /** space */ 4),
    {encoding: 'utf-8'}
  );
}

export async function genHttpApiTableOfContentCmd(params: {
  srcPath: string;
  tags: string[];
  outputPath: string;
}) {
  const {srcPath, tags, outputPath} = params;
  const endpoints = await getEndpointsFromSrcPath({srcPath});
  await genHttpApiTableOfContent({endpoints, tags, outputPath});
}
