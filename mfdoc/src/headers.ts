import {mfdocConstruct} from './mfdoc.js';
import {kMfdocHttpStatusCodes} from './statusCodes.js';

export const kMfdocHTTPHeaderNames = {
  Authorization: 'Authorization',
  ContentType: 'Content-Type',
  ContentLength: 'Content-Length',
} as const;

export const kMfdocEndpointStatusCodes = {
  success: `${kMfdocHttpStatusCodes.ok}`,
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

const requestHeaderItem_JsonContentType = mfdocConstruct.constructString({
  description: 'HTTP JSON request content type',
  example: 'application/json',
});

const requestHeaderItem_MultipartFormdataContentType =
  mfdocConstruct.constructString({
    description: 'HTTP multipart form-data request content type',
    example: 'multipart/form-data',
    valid: ['multipart/form-data'],
  });

const responseHeaderItem_JsonContentType = mfdocConstruct.constructString({
  description: 'HTTP JSON response content type',
  example: 'application/json',
});

const responseHeaderItem_ContentLength = mfdocConstruct.constructString({
  description: 'HTTP response content length in bytes',
});

const responseHeaderItem_ContentDisposition = mfdocConstruct.constructString({
  description: 'HTTP response content disposition',
});

const requestHeaderItem_Authorization = mfdocConstruct.constructString({
  description: 'Access token',
  example: 'Bearer <token>',
});

const requestHeaderItem_ContentType = mfdocConstruct.constructString({
  description: 'HTTP request content type',
  example: 'application/json or multipart/form-data',
});

const requestHeaders_AuthRequired_JsonContentType =
  mfdocConstruct.constructObject<HttpEndpointRequestHeaders_AuthRequired_ContentType>(
    {
      name: 'HttpEndpointRequestHeaders_AuthRequired_JsonContentType',
      fields: {
        [kMfdocHTTPHeaderNames.Authorization]:
          mfdocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_Authorization,
          }),
        [kMfdocHTTPHeaderNames.ContentType]:
          mfdocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_JsonContentType,
          }),
      },
    }
  );

const requestHeaders_AuthOptional_JsonContentType =
  mfdocConstruct.constructObject<HttpEndpointRequestHeaders_AuthOptional_ContentType>(
    {
      name: 'HttpEndpointRequestHeaders_AuthOptional_JsonContentType',
      fields: {
        [kMfdocHTTPHeaderNames.Authorization]:
          mfdocConstruct.constructObjectField({
            required: false,
            data: requestHeaderItem_Authorization,
          }),
        [kMfdocHTTPHeaderNames.ContentType]:
          mfdocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_JsonContentType,
          }),
      },
    }
  );

const requestHeaders_JsonContentType =
  mfdocConstruct.constructObject<HttpEndpointRequestHeaders_ContentType>({
    name: 'HttpEndpointRequestHeaders_JsonContentType',
    fields: {
      [kMfdocHTTPHeaderNames.ContentType]: mfdocConstruct.constructObjectField({
        required: true,
        data: requestHeaderItem_JsonContentType,
      }),
    },
  });

const requestHeaders_AuthRequired_MultipartContentType =
  mfdocConstruct.constructObject<HttpEndpointRequestHeaders_AuthRequired_ContentType>(
    {
      name: 'HttpEndpointRequestHeaders_AuthRequired_MultipartContentType',
      fields: {
        [kMfdocHTTPHeaderNames.Authorization]:
          mfdocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_Authorization,
          }),
        [kMfdocHTTPHeaderNames.ContentType]:
          mfdocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_MultipartFormdataContentType,
          }),
      },
    }
  );

const requestHeaders_AuthOptional_MultipartContentType =
  mfdocConstruct.constructObject<HttpEndpointRequestHeaders_AuthOptional_ContentType>(
    {
      name: 'HttpEndpointRequestHeaders_AuthOptional_MultipartContentType',
      fields: {
        [kMfdocHTTPHeaderNames.Authorization]:
          mfdocConstruct.constructObjectField({
            required: false,
            data: requestHeaderItem_Authorization,
          }),
        [kMfdocHTTPHeaderNames.ContentType]:
          mfdocConstruct.constructObjectField({
            required: true,
            data: requestHeaderItem_MultipartFormdataContentType,
          }),
      },
    }
  );

const requestHeaders_MultipartContentType =
  mfdocConstruct.constructObject<HttpEndpointRequestHeaders_ContentType>({
    name: 'HttpEndpointRequestHeaders_MultipartContentType',
    fields: {
      [kMfdocHTTPHeaderNames.ContentType]: mfdocConstruct.constructObjectField({
        required: true,
        data: requestHeaderItem_MultipartFormdataContentType,
      }),
    },
  });

const requestHeaders_AuthRequired =
  mfdocConstruct.constructObject<HttpEndpointRequestHeaders_AuthRequired>({
    name: 'HttpEndpointRequestHeaders_AuthRequired',
    fields: {
      [kMfdocHTTPHeaderNames.Authorization]:
        mfdocConstruct.constructObjectField({
          required: true,
          data: requestHeaderItem_Authorization,
        }),
    },
  });

const requestHeaders_AuthOptional =
  mfdocConstruct.constructObject<HttpEndpointRequestHeaders_AuthOptional>({
    name: 'HttpEndpointRequestHeaders_AuthOptional',
    fields: {
      [kMfdocHTTPHeaderNames.Authorization]:
        mfdocConstruct.constructObjectField({
          required: false,
          data: requestHeaderItem_Authorization,
        }),
    },
  });

const responseHeaders_JsonContentType =
  mfdocConstruct.constructObject<HttpEndpointResponseHeaders_ContentType_ContentLength>(
    {
      name: 'HttpEndpointResponseHeaders_ContentType_ContentLength',
      fields: {
        [kMfdocHTTPHeaderNames.ContentType]:
          mfdocConstruct.constructObjectField({
            required: true,
            data: responseHeaderItem_JsonContentType,
          }),
        [kMfdocHTTPHeaderNames.ContentLength]:
          mfdocConstruct.constructObjectField({
            required: true,
            data: responseHeaderItem_ContentLength,
          }),
      },
    }
  );

export const kMfdocHttpHeaderItems = {
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
