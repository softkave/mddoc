export type ExternalError = {
  name: string;
  message: string;
};

export interface BaseEndpointResult {
  errors?: ExternalError[];
}
