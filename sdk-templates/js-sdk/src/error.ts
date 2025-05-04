import {MddocEndpointHeaders} from './types.js';

export type MddocEndpointErrorItem = {
  name: string;
  field?: string;
  message: string;

  // TODO: find a way to include in generated doc for when we add new
  // recommended actions
  action?: 'logout' | 'loginAgain' | 'requestChangePassword';
};

export class MddocEndpointError extends Error {
  name = 'MddocEndpointError';
  isMddocEndpointError = true;

  constructor(
    public errors: Array<MddocEndpointErrorItem>,
    public statusCode?: number,
    public statusText?: string,
    public headers?: MddocEndpointHeaders
  ) {
    super(
      errors.map(item => item.message).join('\n') ||
        'mddoc endpoint error. ' +
          'This could be because the client is not able to connect to the server. ' +
          'Please check your internet connection or check with Support if the issue persists.'
    );
  }
}
