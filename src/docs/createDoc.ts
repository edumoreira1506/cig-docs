import { ObjectSchema } from 'joi';

import createDocPath, { IVariable } from './createDocPath';

export interface IDocOptions {
  version?: number;
  pathVariables?: IVariable[];
}

export interface IDocPath {
  title: string;
  description?: string;
  objectSchema?: ObjectSchema;
  method: string;
  queryParams?: IVariable[];
  headerParams?: IVariable[];
  files?: string[];
}

export default function createDoc(
  route: string,
  tags: string[],
  paths: IDocPath[],
  docOptions?: IDocOptions
): Record<string, any> {
  return {
    [`v${docOptions?.version ?? 1}${route}`]: Object.fromEntries(paths.map(path => ([
      path.method,
      createDocPath({
        description: path.description ?? '',
        tags,
        title: path.title,
        objectSchema: path.objectSchema,
        pathVariables: docOptions?.pathVariables,
        queryParams: path.queryParams,
        headerParams: path.headerParams,
        files: path.files,
      })
    ])))
  };
}
