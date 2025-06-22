// This file is auto-generated, do not modify directly.
// Reach out to a code owner to suggest changes.

export type GetUserRequestBody = {
  /**
   * The user id
   */
  userId: string;
};
export type User = {
  /**
   * The user id
   */
  id: string;
};
/**
 * The response body for the user info endpoint
 * @example
 * ```json
 * {
 *   "user": {
 *     "id": "1234567890"
 *   }
 * }
 * ```
 */
export type GetUserResponseBody = {
  user: User;
};
