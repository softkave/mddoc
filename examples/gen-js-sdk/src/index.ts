import {mddocConstruct, MddocHttpEndpointMethod} from 'mddoc';

export const endpoint01 = mddocConstruct.constructHttpEndpointDefinition({
  name: 'get-user',
  method: MddocHttpEndpointMethod.Get,
  basePathname: '/user/:userId/info',
  description: 'Get user',
  tags: ['user'],
  requestHeaders: mddocConstruct.constructObject<{
    'x-api-key': string;
  }>({
    name: 'GetUserRequestHeaders',
    fields: {
      'x-api-key': mddocConstruct.constructObjectField({
        required: true,
        data: mddocConstruct.constructString({
          description: 'The API key',
        }),
      }),
    },
  }),
  responseHeaders: mddocConstruct.constructObject<{
    'x-api-key': string;
  }>({
    name: 'GetUserResponseHeaders',
    fields: {
      'x-api-key': mddocConstruct.constructObjectField({
        required: true,
        data: mddocConstruct.constructString({
          description: 'The API key',
        }),
      }),
    },
  }),
  responseBody: mddocConstruct.constructObject<{
    user: {
      id: string;
    };
  }>({
    name: 'GetUserResponseBody',
    fields: {
      user: mddocConstruct.constructObjectField({
        required: true,
        data: mddocConstruct.constructObject({
          name: 'User',
          fields: {
            id: mddocConstruct.constructObjectField({
              required: true,
              data: mddocConstruct.constructString({
                description: 'The user id',
              }),
            }),
          },
        }),
      }),
    },
  }),
  pathParamaters: mddocConstruct.constructObject<{
    userId: string;
  }>({
    name: 'GetUserPathParamaters',
    fields: {
      userId: mddocConstruct.constructObjectField({
        required: true,
        data: mddocConstruct.constructString({
          description: 'The user id',
        }),
      }),
    },
  }),
  query: mddocConstruct.constructObject<{
    userId: string;
  }>({
    name: 'GetUserQuery',
    fields: {
      userId: mddocConstruct.constructObjectField({
        required: true,
        data: mddocConstruct.constructString({
          description: 'The user id',
        }),
      }),
    },
  }),
  requestBody: mddocConstruct.constructObject<{
    userId: string;
  }>({
    name: 'GetUserRequestBody',
    fields: {
      userId: mddocConstruct.constructObjectField({
        required: true,
        data: mddocConstruct.constructString({
          description: 'The user id',
        }),
      }),
    },
  }),
  errorResponseHeaders: mddocConstruct.constructObject<{
    'Content-Type': string;
    'Content-Length': string;
  }>({
    name: 'GetUserErrorResponseHeaders',
    fields: {
      'Content-Type': mddocConstruct.constructObjectField({
        required: true,
        data: mddocConstruct.constructString({
          description: 'The API key',
        }),
      }),
      'Content-Length': mddocConstruct.constructObjectField({
        required: true,
        data: mddocConstruct.constructString({
          description: 'The content length',
        }),
      }),
    },
  }),
  errorResponseBody: mddocConstruct.constructObject<{
    errors?: {
      message: string;
    }[];
  }>({
    name: 'GetUserErrorResponseBody',
    fields: {
      errors: mddocConstruct.constructObjectField({
        required: false,
        data: mddocConstruct.constructArray({
          type: mddocConstruct.constructObject<{
            message: string;
          }>({
            name: 'Error',
            fields: {
              message: mddocConstruct.constructObjectField({
                required: true,
                data: mddocConstruct.constructString({
                  description: 'The error message',
                }),
              }),
            },
          }),
        }),
      }),
    },
  }),
});
