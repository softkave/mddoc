import {identity} from 'lodash-es';
import {indexArray} from 'softkave-js-utils';
import {MddocHttpEndpointDefinitionTypePrimitive} from './mddoc.js';

export function filterEndpointsByTags(
  endpoints: MddocHttpEndpointDefinitionTypePrimitive[],
  tags: string[]
) {
  const tagsMap = indexArray(tags, {indexer: identity});
  return endpoints.filter(endpoint => {
    return endpoint.tags?.some(tag => tagsMap[tag]);
  });
}
