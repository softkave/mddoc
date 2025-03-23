import fse from 'fs-extra';
import {forEach} from 'lodash-es';
import {MddocHttpEndpointDefinitionTypePrimitive} from './mddoc.js';
import {filterEndpointsByTags} from './utils.js';

function generateTableOfContentFromFimidaraPublicEndpoints(params: {
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
  const tableOfContent = generateTableOfContentFromFimidaraPublicEndpoints({
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
