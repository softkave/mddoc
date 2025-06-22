export interface MfdocEndpointsTableOfContent {
  filepath?: string;
  /** basename with method if item is an endpoint */
  basename: string;
  names: string[];
  children: Record<string, MfdocEndpointsTableOfContent>;
}
