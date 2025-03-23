import {AnyObject} from 'softkave-js-utils';
import {mddocConstruct} from './mddoc.js';
import {BaseEndpointResult, ExternalError} from './types.js';

const errorObject = mddocConstruct.constructObject<ExternalError>({
  name: 'ExternalError',
  fields: {
    name: mddocConstruct.constructObjectField({
      required: true,
      data: mddocConstruct.constructString({
        description: 'Error name',
        example: 'ValidationError',
      }),
    }),
    message: mddocConstruct.constructObjectField({
      required: true,
      data: mddocConstruct.constructString({
        description: 'Error message',
        example: 'Workspace name is invalid',
      }),
    }),
  },
});

const errorResponseBody = mddocConstruct.constructObject<BaseEndpointResult>({
  name: 'EndpointErrorResult',
  description: 'Endpoint error result',
  fields: {
    errors: mddocConstruct.constructObjectField({
      required: false,
      data: mddocConstruct.constructArray<ExternalError>({
        type: errorObject,
        description: 'Endpoint call response errors',
      }),
    }),
  },
});

const emptySuccessResponseBody = mddocConstruct.constructObject<AnyObject>({
  name: 'EmptyEndpointResult',
  description: 'Empty endpoint success result',
  fields: {},
});

export const kMddocEndpointHttpResponseItems = {
  errorResponseBody,
  emptySuccessResponseBody,
};
