import {mfdocConstruct, MfdocHttpEndpointMethod} from 'mfdoc';

export const endpoint01 = mfdocConstruct.constructHttpEndpointDefinition({
  method: MfdocHttpEndpointMethod.Get,
  path: '/user/:userId/info',
  description: 'Get user',
  tags: ['user'],
  requestHeaders: mfdocConstruct.constructObject<{
    'x-api-key': string;
  }>({
    name: 'GetUserRequestHeaders',
    fields: {
      'x-api-key': mfdocConstruct.constructObjectField({
        required: true,
        data: mfdocConstruct.constructString({
          description: 'The API key',
        }),
      }),
    },
  }),
  responseHeaders: mfdocConstruct.constructObject<{
    'x-api-key': string;
  }>({
    name: 'GetUserResponseHeaders',
    fields: {
      'x-api-key': mfdocConstruct.constructObjectField({
        required: true,
        data: mfdocConstruct.constructString({
          description: 'The API key',
        }),
      }),
    },
  }),
  responseBody: mfdocConstruct.constructObject<{
    user: {
      id: string;
    };
  }>({
    name: 'GetUserResponseBody',
    fields: {
      user: mfdocConstruct.constructObjectField({
        required: true,
        data: mfdocConstruct.constructObject({
          name: 'User',
          fields: {
            id: mfdocConstruct.constructObjectField({
              required: true,
              data: mfdocConstruct.constructString({
                description: 'The user id',
              }),
            }),
          },
        }),
      }),
    },
  }),
  pathParamaters: mfdocConstruct.constructObject<{
    userId: string;
  }>({
    name: 'GetUserPathParamaters',
    fields: {
      userId: mfdocConstruct.constructObjectField({
        required: true,
        data: mfdocConstruct.constructString({
          description: 'The user id',
        }),
      }),
    },
  }),
  query: mfdocConstruct.constructObject<{
    userId: string;
  }>({
    name: 'GetUserQuery',
    fields: {
      userId: mfdocConstruct.constructObjectField({
        required: true,
        data: mfdocConstruct.constructString({
          description: 'The user id',
        }),
      }),
    },
  }),
  requestBody: mfdocConstruct.constructObject<{
    userId: string;
  }>({
    name: 'GetUserRequestBody',
    fields: {
      userId: mfdocConstruct.constructObjectField({
        required: true,
        data: mfdocConstruct.constructString({
          description: 'The user id',
        }),
      }),
    },
  }),
  errorResponseHeaders: mfdocConstruct.constructObject<{
    'Content-Type': string;
    'Content-Length': string;
  }>({
    name: 'GetUserErrorResponseHeaders',
    fields: {
      'Content-Type': mfdocConstruct.constructObjectField({
        required: true,
        data: mfdocConstruct.constructString({
          description: 'The API key',
        }),
      }),
      'Content-Length': mfdocConstruct.constructObjectField({
        required: true,
        data: mfdocConstruct.constructString({
          description: 'The content length',
        }),
      }),
    },
  }),
  errorResponseBody: mfdocConstruct.constructObject<{
    errors?: {
      message: string;
    }[];
  }>({
    name: 'GetUserErrorResponseBody',
    fields: {
      errors: mfdocConstruct.constructObjectField({
        required: false,
        data: mfdocConstruct.constructArray({
          type: mfdocConstruct.constructObject<{
            message: string;
          }>({
            name: 'Error',
            fields: {
              message: mfdocConstruct.constructObjectField({
                required: true,
                data: mfdocConstruct.constructString({
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
