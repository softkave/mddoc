// This file is auto-generated, do not modify directly.
// Reach out to a code owner to suggest changes.

import {
  type MfdocEndpointResultWithBinaryResponse,
  type MfdocEndpointOpts,
  type MfdocEndpointDownloadBinaryOpts,
  type MfdocEndpointUploadBinaryOpts,
} from 'mfdoc-js-sdk-base';
import {AbstractSdkEndpoints} from './AbstractSdkEndpoints.js';
import {
  type GetUserRequestBody,
  type GetUserResponseBody,
} from './publicTypes.js';

export class UserEndpoints extends AbstractSdkEndpoints {
  /**
   * Get user info
   */
  info = async (
    props: GetUserRequestBody,
    opts?: MfdocEndpointOpts,
  ): Promise<GetUserResponseBody> => {
    return this.executeJson(
      {
        data: props,
        path: '/user/:userId/info',
        method: 'GET',
      },
      opts,
    );
  };
}
