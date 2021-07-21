import { IDocsConfig } from "@Types/docs";

export default function createSwaggerDocument(docsConfig: IDocsConfig, paths: Record<string, any>) {
  return {
    swagger: '2.0',
    title : docsConfig.title,
    description : docsConfig.description,
    version: '1.0.0',
    host: docsConfig.host,
    basePath: '/',
    schemes: [ 'http', 'https' ],
    consumes: [ 'application/json' ],
    produces: [ 'application/json' ],
    paths
  }
}
