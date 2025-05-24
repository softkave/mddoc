import {AnyObject} from 'softkave-js-utils';
import {mfdocConstruct} from './mfdoc.js';
import {BaseEndpointResult, ExternalError} from './types.js';

const errorObject = mfdocConstruct.constructObject<ExternalError>({
  name: 'ExternalError',
  fields: {
    message: mfdocConstruct.constructObjectField({
      required: true,
      data: mfdocConstruct.constructString({
        description: 'Error message',
        example: 'Workspace name is invalid',
      }),
    }),
  },
});

const errorResponseBody = mfdocConstruct.constructObject<BaseEndpointResult>({
  name: 'EndpointErrorResult',
  description: 'Endpoint error result',
  fields: {
    errors: mfdocConstruct.constructObjectField({
      required: false,
      data: mfdocConstruct.constructArray<ExternalError>({
        type: errorObject,
        description: 'Endpoint call response errors',
      }),
    }),
  },
});

const emptySuccessResponseBody = mfdocConstruct.constructObject<AnyObject>({
  name: 'EmptyEndpointResult',
  description: 'Empty endpoint success result',
  fields: {},
});

export const kMfdocHttpResponseItems = {
  errorResponseBody,
  emptySuccessResponseBody,
};
