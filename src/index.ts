import 'module-alias/register';

import swaggerUi from 'swagger-ui-express'

import { IDocsConfig } from '@Types/docs';
import createSwaggerDocument from '@Docs/createSwaggerDocument'

export { default as createDoc } from '@Docs/createDoc'

export default function createDocs(docsConfig: IDocsConfig, paths: Record<string, any>) {
  const swaggerDocument = createSwaggerDocument(docsConfig, paths)

  return [swaggerUi.serve, swaggerUi.setup(swaggerDocument)]
}
