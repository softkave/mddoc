import {AxiosProgressEvent} from 'axios';
import type {Readable} from 'stream';

export type MfdocEndpointHeaders = {
  [key: string]: string | string[] | number | boolean | null;
};

export type MfdocEndpointResultWithBinaryResponse<
  TResponseType extends 'blob' | 'stream'
> = TResponseType extends 'blob'
  ? Blob
  : TResponseType extends 'stream'
  ? Readable
  : unknown;

export type MfdocEndpointProgressEvent = AxiosProgressEvent;

export type MfdocEndpointParamsRequired<T> = {
  body: T;
  serverURL?: string;
  authToken?: string;

  /** **NOTE**: doesn't work in Node.js at the moment. */
  onUploadProgress?: (progressEvent: MfdocEndpointProgressEvent) => void;
  /** **NOTE**: doesn't work in Node.js at the moment. */
  onDownloadProgress?: (progressEvent: MfdocEndpointProgressEvent) => void;
};

export type MfdocEndpointOpts = {
  serverURL?: string;
  authToken?: string;
};

export type MfdocEndpointUploadBinaryOpts = MfdocEndpointOpts & {
  /** **NOTE**: doesn't work in Node.js at the moment. */
  onUploadProgress?: (progressEvent: MfdocEndpointProgressEvent) => void;
};

export type MfdocEndpointDownloadBinaryOpts<
  TResponseType extends 'blob' | 'stream'
> = MfdocEndpointOpts & {
  responseType: TResponseType;
  /** **NOTE**: doesn't work in Node.js at the moment. */
  onDownloadProgress?: (progressEvent: MfdocEndpointProgressEvent) => void;
};

export type MfdocEndpointWithBinaryResponseParamsRequired<
  T,
  TResponseType extends 'blob' | 'stream'
> = MfdocEndpointParamsRequired<T> & {
  responseType: TResponseType;
};

export type MfdocEndpointParamsOptional<T> = Partial<
  MfdocEndpointParamsRequired<T>
>;

export type MfdocEndpointWithBinaryResponseParamsOptional<
  T,
  TResponseType extends 'blob' | 'stream'
> = MfdocEndpointParamsOptional<T> & {
  responseType: TResponseType;
};

export interface IRefreshAuthToken {
  getBearerToken(): string | undefined;
}
