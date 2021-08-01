export interface IDocsConfig {
  title: string;
  description: string;
  host: string;
}

export interface ISwaggerDocument {
  swagger :string;
  title : string;
  description : string;
  version: string;
  host: string;
  basePath: string;
  schemes: string[];
  consumes: string[];
  produces: string[];
  paths: Record<string, any>;
}
