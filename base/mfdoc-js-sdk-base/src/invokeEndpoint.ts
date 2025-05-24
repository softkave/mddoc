import assert from 'assert';
import axios, {
  AxiosProgressEvent,
  AxiosResponse,
  Method,
  toFormData,
} from 'axios';
import {AnyObject} from 'softkave-js-utils';
import {MfdocEndpointError, MfdocEndpointErrorItem} from './error.js';
import {MfdocEndpointHeaders} from './types.js';

function isNodeEnv() {
  return typeof window === 'undefined' && typeof process === 'object';
}

// function isBrowserEnv() {
//   return !isNodeEnv();
// }

const kHttpHeaderContentType = 'content-type';
const kHttpHeaderContentLength = 'Content-Length';
const kHttpHeaderAuthorization = 'authorization';
const kContentTypeApplicationJson = 'application/json';

export interface InvokeEndpointParams {
  serverURL?: string;
  path?: string;
  endpointURL?: string;
  bearerToken?: string;
  data?: any;
  formdata?: any;
  headers?: MfdocEndpointHeaders;
  query?: AnyObject;
  method: Method;
  responseType: 'blob' | 'json' | 'stream';
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export async function invokeEndpoint(props: InvokeEndpointParams) {
  const {
    serverURL,
    path,
    data,
    headers,
    method,
    bearerToken,
    formdata,
    responseType,
    query,
    onDownloadProgress,
    onUploadProgress,
    endpointURL: propsEndpointURL,
  } = props;
  const outgoingHeaders = {...headers};
  let contentBody = undefined;

  if (formdata) {
    contentBody = toFormData(formdata);
  } else if (data) {
    const str = JSON.stringify(data);
    contentBody = str;
    outgoingHeaders[kHttpHeaderContentType] = kContentTypeApplicationJson;

    if (
      isNodeEnv() &&
      (!outgoingHeaders[kHttpHeaderContentLength] ||
        !outgoingHeaders[kHttpHeaderContentLength.toLowerCase()])
    ) {
      const textEncoder = new TextEncoder();
      outgoingHeaders[kHttpHeaderContentLength] =
        textEncoder.encode(str).length;
    }
  }

  if (bearerToken) {
    outgoingHeaders[kHttpHeaderAuthorization] = `Bearer ${bearerToken}`;
  }

  let endpointURL = propsEndpointURL;
  if (!endpointURL) {
    assert(serverURL, 'serverURL is required');
    endpointURL = serverURL + path;
  }

  try {
    /**
     * Axios accepts the following:
     * - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
     * - Browser only: FormData, File, Blob
     * - Node only: Stream, Buffer
     *
     * TODO: enforce environment dependent options or have a universal
     * transformRequest
     */
    const result = await axios({
      method,
      responseType,
      onUploadProgress,
      onDownloadProgress,
      params: query,
      url: endpointURL,
      headers: outgoingHeaders,
      data: contentBody,
      maxRedirects: 0, // avoid buffering the entire stream
    });

    return result;
  } catch (axiosError: unknown) {
    let errors: MfdocEndpointErrorItem[] = [];
    let statusCode: number | undefined = undefined;
    let statusText: string | undefined = undefined;
    let responseHeaders: MfdocEndpointHeaders | undefined = undefined;

    if ((axiosError as any).response) {
      // The request was made and the server responded with a status code that
      // falls out of the range of 2xx
      const response = (axiosError as any).response as AxiosResponse;

      statusCode = response.status;
      statusText = response.statusText;
      responseHeaders = response.headers as MfdocEndpointHeaders;

      const contentType = response.headers[kHttpHeaderContentType];
      const isResultJSON =
        typeof contentType === 'string' &&
        contentType.includes(kContentTypeApplicationJson);

      if (isResultJSON && typeof response.data === 'string') {
        const body = JSON.parse(response.data);
        if (Array.isArray(body?.errors)) errors = body.errors;
      } else if (
        typeof response.data === 'object' &&
        Array.isArray(response.data.errors)
      ) {
        errors = response.data.errors;
      }
    } else if ((axiosError as any).request) {
      // The request was made but no response was received `error.request` is an
      // instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', error.message);
    }

    // TODO: show axios and network errors
    throw new MfdocEndpointError(
      errors,
      statusCode,
      statusText,
      responseHeaders
    );
  }
}
