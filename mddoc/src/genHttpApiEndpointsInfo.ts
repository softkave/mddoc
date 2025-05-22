import fse from 'fs-extra';
import {forEach} from 'lodash-es';
import {posix} from 'path';
import {kMddocHttpHeaderItems} from './headers.js';
import {
  mddocConstruct,
  MddocHttpEndpointDefinitionTypePrimitive,
} from './mddoc.js';
import {kMddocHttpResponseItems} from './response.js';
import {filterEndpointsByTags} from './utils.js';

function generateEndpointInfoFromEndpoints(params: {
  endpoints: MddocHttpEndpointDefinitionTypePrimitive[];
  tags: string[];
}) {
  const {endpoints, tags} = params;
  const infoMap = new Map<
    MddocHttpEndpointDefinitionTypePrimitive<any>,
    string
  >();

  const pickedEndpoints = filterEndpointsByTags(endpoints, tags);
  forEach(pickedEndpoints, endpoint => {
    const inf = mddocConstruct.constructHttpEndpointDefinition({
      ...endpoint,
      errorResponseHeaders:
        endpoint.errorResponseHeaders ??
        kMddocHttpHeaderItems.responseHeaders_JsonContentType,
      errorResponseBody:
        endpoint.errorResponseBody ?? kMddocHttpResponseItems.errorResponseBody,
    });

    infoMap.set(
      endpoint as any,
      JSON.stringify(inf, /** replacer */ undefined, /** spaces */ 4)
    );
  });

  return infoMap;
}

async function writeEndpointInfoToFile(endpointPath: string, info: string) {
  await fse.ensureFile(endpointPath);
  return fse.writeFile(endpointPath, info, {encoding: 'utf-8'});
}

export async function genHttpApiEndpointsInfo(params: {
  endpoints: MddocHttpEndpointDefinitionTypePrimitive[];
  tags: string[];
  outputPath: string;
}) {
  const {endpoints, tags, outputPath} = params;
  const infoMap = generateEndpointInfoFromEndpoints({endpoints, tags});
  const promises: Promise<any>[] = [];

  await fse.remove(outputPath);
  infoMap.forEach((info, endpoint) => {
    const pathname = endpoint.name
      .split('/')
      .filter(p => !p.startsWith(':'))
      .join('/');
    const method = endpoint.method;
    const filename = `${pathname}__${method}.json`;
    const endpointPath = posix.normalize(outputPath + filename);
    promises.push(writeEndpointInfoToFile(endpointPath, info));
  });

  return Promise.all(promises);
}
