import {AxiosProgressEvent} from 'axios';
import type {Readable} from 'stream';

export type MddocEndpointHeaders = {
  [key: string]: string | string[] | number | boolean | null;
};

export type MddocEndpointResultWithBinaryResponse<
  TResponseType extends 'blob' | 'stream'
> = TResponseType extends 'blob'
  ? Blob
  : TResponseType extends 'stream'
  ? Readable
  : unknown;

export type MddocEndpointProgressEvent = AxiosProgressEvent;

export type MddocEndpointParamsRequired<T> = {
  body: T;
  serverURL?: string;
  authToken?: string;

  /** **NOTE**: doesn't work in Node.js at the moment. */
  onUploadProgress?: (progressEvent: MddocEndpointProgressEvent) => void;
  /** **NOTE**: doesn't work in Node.js at the moment. */
  onDownloadProgress?: (progressEvent: MddocEndpointProgressEvent) => void;
};

export type MddocEndpointOpts = {
  serverURL?: string;
  authToken?: string;
};

export type MddocEndpointUploadBinaryOpts = MddocEndpointOpts & {
  /** **NOTE**: doesn't work in Node.js at the moment. */
  onUploadProgress?: (progressEvent: MddocEndpointProgressEvent) => void;
};

export type MddocEndpointDownloadBinaryOpts<
  TResponseType extends 'blob' | 'stream'
> = MddocEndpointOpts & {
  responseType: TResponseType;
  /** **NOTE**: doesn't work in Node.js at the moment. */
  onDownloadProgress?: (progressEvent: MddocEndpointProgressEvent) => void;
};

export type MddocEndpointWithBinaryResponseParamsRequired<
  T,
  TResponseType extends 'blob' | 'stream'
> = MddocEndpointParamsRequired<T> & {
  responseType: TResponseType;
};

export type MddocEndpointParamsOptional<T> = Partial<
  MddocEndpointParamsRequired<T>
>;

export type MddocEndpointWithBinaryResponseParamsOptional<
  T,
  TResponseType extends 'blob' | 'stream'
> = MddocEndpointParamsOptional<T> & {
  responseType: TResponseType;
};

export interface IRefreshAuthToken {
  getAuthToken(): string | undefined;
}
