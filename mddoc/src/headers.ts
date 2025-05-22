import {mddocConstruct} from './mddoc.js';
import {kMddocHttpStatusCodes} from './statusCodes.js';

export const kMddocHTTPHeaderNames = {
  Authorization: 'Authorization',
  ContentType: 'Content-Type',
  ContentLength: 'Content-Length',
} as const;

export const kMddocEndpointStatusCodes = {
  success: `${kMddocHttpStatusCodes.ok}`,
  error: '4XX or 5XX',
} as const;

export type HttpEndpointRequestHeaders_AuthOptional = {
  Authorization?: string;
};

export type HttpEndpointRequestHeaders_AuthRequired =
  Required<HttpEndpointRequestHeaders_AuthOptional>;

export type HttpEndpointRequestHeaders_ContentType = {
  'Content-Type': string;
};

export type HttpEndpointRequestHeaders_AuthOptional_ContentType =
  HttpEndpointRequestHeaders_ContentType &
    HttpEndpointRequestHeaders_AuthOptional;

export type HttpEndpointRequestHeaders_AuthRequired_ContentType =
  Required<HttpEndpointRequestHeaders_AuthOptional_ContentType>;

export type HttpEndpointResponseHeaders_ContentType_ContentLength = {
  'Content-Type': string;
  'Content-Length': string;
};

const requestHeaderItem_JsonContentType = mddocConstruct.constructString({
  description: 'HTTP JSON request content type',
  example: 'application/json',
});

const requestHeaderItem_MultipartFormdataContentType =
  mddocConstruct.constructString({
    description: 'HTTP multipart form-data request content type',
    example: 'multipart/form-data',
    valid: ['multipart/form-data'],
  });

const responseHeaderItem_JsonContentType = mddocConstruct.constructString({
  description: 'HTTP JSON response content type',
  example: 'application/json',
});

const responseHeaderItem_ContentLength = mddocConstruct.constructString({
  description: 'HTTP response content length in bytes',
});

const responseHeaderItem_ContentDisposition = mddocConstruct.constructString({
  description: 'HTTP response content disposition',
});

const requestHeaderItem_Authorization = mddocConstruct.constructString({
  description: 'Access token',
  example: 'Bearer <token>',
});

const requestHeaderItem_ContentType = mddocConstruct.constructString({
  description: 'HTTP request content type',
  example: 'application/json or multipart/form-data',
});

const requestHeaders_AuthRequired_JsonContentType =
  mddocConstruct.constructObject<HttpEndpointRequestHeaders_AuthRequired_ContentType>(
    {
      name: 'HttpEndpointRequestHeaders_AuthRequired_JsonContentType',
      fields: {
        [kMddocHTTPHeaderNames.Authorization]:
          mddocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_Authorization,
          }),
        [kMddocHTTPHeaderNames.ContentType]:
          mddocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_JsonContentType,
          }),
      },
    }
  );

const requestHeaders_AuthOptional_JsonContentType =
  mddocConstruct.constructObject<HttpEndpointRequestHeaders_AuthOptional_ContentType>(
    {
      name: 'HttpEndpointRequestHeaders_AuthOptional_JsonContentType',
      fields: {
        [kMddocHTTPHeaderNames.Authorization]:
          mddocConstruct.constructObjectField({
            required: false,
            data: requestHeaderItem_Authorization,
          }),
        [kMddocHTTPHeaderNames.ContentType]:
          mddocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_JsonContentType,
          }),
      },
    }
  );

const requestHeaders_JsonContentType =
  mddocConstruct.constructObject<HttpEndpointRequestHeaders_ContentType>({
    name: 'HttpEndpointRequestHeaders_JsonContentType',
    fields: {
      [kMddocHTTPHeaderNames.ContentType]: mddocConstruct.constructObjectField({
        required: true,
        data: requestHeaderItem_JsonContentType,
      }),
    },
  });

const requestHeaders_AuthRequired_MultipartContentType =
  mddocConstruct.constructObject<HttpEndpointRequestHeaders_AuthRequired_ContentType>(
    {
      name: 'HttpEndpointRequestHeaders_AuthRequired_MultipartContentType',
      fields: {
        [kMddocHTTPHeaderNames.Authorization]:
          mddocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_Authorization,
          }),
        [kMddocHTTPHeaderNames.ContentType]:
          mddocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_MultipartFormdataContentType,
          }),
      },
    }
  );

const requestHeaders_AuthOptional_MultipartContentType =
  mddocConstruct.constructObject<HttpEndpointRequestHeaders_AuthOptional_ContentType>(
    {
      name: 'HttpEndpointRequestHeaders_AuthOptional_MultipartContentType',
      fields: {
        [kMddocHTTPHeaderNames.Authorization]:
          mddocConstruct.constructObjectField({
            required: false,
            data: requestHeaderItem_Authorization,
          }),
        [kMddocHTTPHeaderNames.ContentType]:
          mddocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_MultipartFormdataContentType,
          }),
      },
    }
  );

const requestHeaders_MultipartContentType =
  mddocConstruct.constructObject<HttpEndpointRequestHeaders_ContentType>({
    name: 'HttpEndpointRequestHeaders_MultipartContentType',
    fields: {
      [kMddocHTTPHeaderNames.ContentType]: mddocConstruct.constructObjectField({
        required: true,
        data: requestHeaderItem_MultipartFormdataContentType,
      }),
    },
  });

const requestHeaders_AuthRequired =
  mddocConstruct.constructObject<HttpEndpointRequestHeaders_AuthRequired>({
    name: 'HttpEndpointRequestHeaders_AuthRequired',
    fields: {
      [kMddocHTTPHeaderNames.Authorization]:
        mddocConstruct.constructObjectField({
          required: true,
          data: requestHeaderItem_Authorization,
        }),
    },
  });

const requestHeaders_AuthOptional =
  mddocConstruct.constructObject<HttpEndpointRequestHeaders_AuthOptional>({
    name: 'HttpEndpointRequestHeaders_AuthOptional',
    fields: {
      [kMddocHTTPHeaderNames.Authorization]:
        mddocConstruct.constructObjectField({
          required: false,
          data: requestHeaderItem_Authorization,
        }),
    },
  });

const responseHeaders_JsonContentType =
  mddocConstruct.constructObject<HttpEndpointResponseHeaders_ContentType_ContentLength>(
    {
      name: 'HttpEndpointResponseHeaders_ContentType_ContentLength',
      fields: {
        [kMddocHTTPHeaderNames.ContentType]:
          mddocConstruct.constructObjectField({
            required: true,
            data: responseHeaderItem_JsonContentType,
          }),
        [kMddocHTTPHeaderNames.ContentLength]:
          mddocConstruct.constructObjectField({
            required: true,
            data: responseHeaderItem_ContentLength,
          }),
      },
    }
  );

export const kMddocHttpHeaderItems = {
  requestHeaderItem_Authorization,
  requestHeaderItem_ContentType,
  responseHeaderItem_JsonContentType,
  requestHeaderItem_JsonContentType,
  requestHeaderItem_MultipartFormdataContentType,
  requestHeaders_AuthRequired_JsonContentType,
  requestHeaders_AuthRequired,
  requestHeaders_JsonContentType,
  requestHeaders_AuthOptional,
  requestHeaders_MultipartContentType,
  requestHeaders_AuthOptional_MultipartContentType,
  requestHeaders_AuthRequired_MultipartContentType,
  requestHeaders_AuthOptional_JsonContentType,
  responseHeaderItem_ContentLength,
  responseHeaders_JsonContentType,
  responseHeaderItem_ContentDisposition,
};
