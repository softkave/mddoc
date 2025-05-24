export type ExternalError = {
  message: string;
};

export interface BaseEndpointResult {
  errors?: ExternalError[];
}
