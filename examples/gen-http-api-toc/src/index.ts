import path from 'path';
import {
  genHttpApiTableOfContent,
  mddocConstruct,
  MddocHttpEndpointDefinitionTypePrimitive,
  MddocHttpEndpointMethod,
} from '../../../mddoc/src/index.js';

const endpoint01 = mddocConstruct.constructHttpEndpointDefinition({
  name: 'get-user',
  method: MddocHttpEndpointMethod.Get,
  basePathname: '/user',
  description: 'Get user',
  tags: ['user'],
  requestHeaders: mddocConstruct.constructObject({
    'x-api-key': mddocConstruct.constructString({
      description: 'The API key',
    }),
  }),
  responseHeaders: mddocConstruct.constructObject({
    'x-api-key': mddocConstruct.constructString({
      description: 'The API key',
    }),
  }),
  responseBody: mddocConstruct.constructObject({
    user: mddocConstruct.constructObject({
      id: mddocConstruct.constructString({
        description: 'The user id',
      }),
    }),
  }),
  pathParamaters: mddocConstruct.constructObject({
    userId: mddocConstruct.constructString({
      description: 'The user id',
    }),
  }),
  query: mddocConstruct.constructObject({
    userId: mddocConstruct.constructString({
      description: 'The user id',
    }),
  }),
  requestBody: mddocConstruct.constructObject({
    userId: mddocConstruct.constructString({
      description: 'The user id',
    }),
  }),
  errorResponseHeaders: mddocConstruct.constructObject({
    'x-api-key': mddocConstruct.constructString({
      description: 'The API key',
    }),
  }),
  errorResponseBody: mddocConstruct.constructObject({
    error: mddocConstruct.constructObject({
      message: mddocConstruct.constructString({
        description: 'The error message',
      }),
    }),
  }),
});

const endpoints: MddocHttpEndpointDefinitionTypePrimitive[] = [endpoint01];
const tags: string[] = ['user'];
const outputPath = path.join(
  __dirname,
  '..',
  'output',
  'table-of-content.json',
);

async function main() {
  await genHttpApiTableOfContent({
    endpoints,
    tags,
    outputPath,
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
