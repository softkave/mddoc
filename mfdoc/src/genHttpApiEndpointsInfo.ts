import fse from 'fs-extra';
import {forEach} from 'lodash-es';
import {posix} from 'path';
import {getEndpointsFromSrcPath} from './getEndpointsFromSrcPath.js';
import {kMfdocHttpHeaderItems} from './headers.js';
import {
  mfdocConstruct,
  MfdocHttpEndpointDefinitionTypePrimitive,
} from './mfdoc.js';
import {kMfdocHttpResponseItems} from './response.js';
import {filterEndpointsByTags} from './utils.js';

function generateEndpointInfoFromEndpoints(params: {
  endpoints: MfdocHttpEndpointDefinitionTypePrimitive[];
  tags: string[];
}) {
  const {endpoints, tags} = params;
  const infoMap = new Map<
    MfdocHttpEndpointDefinitionTypePrimitive<any>,
    string
  >();

  const pickedEndpoints = filterEndpointsByTags(endpoints, tags);
  forEach(pickedEndpoints, endpoint => {
    const inf = mfdocConstruct.constructHttpEndpointDefinition({
      ...endpoint,
      errorResponseHeaders:
        endpoint.errorResponseHeaders ??
        kMfdocHttpHeaderItems.responseHeaders_JsonContentType,
      errorResponseBody:
        endpoint.errorResponseBody ?? kMfdocHttpResponseItems.errorResponseBody,
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
  endpoints: MfdocHttpEndpointDefinitionTypePrimitive[];
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
    const endpointPath = posix.normalize(outputPath + '/' + filename);
    promises.push(writeEndpointInfoToFile(endpointPath, info));
  });

  return Promise.all(promises);
}

export async function genHttpApiEndpointsInfoCmd(params: {
  srcPath: string;
  tags: string[];
  outputPath: string;
}) {
  const {srcPath, tags, outputPath} = params;
  const endpoints = await getEndpointsFromSrcPath({srcPath});
  await genHttpApiEndpointsInfo({endpoints, tags, outputPath});
}
