import { ObjectSchema } from 'joi';
import createDocPath from './createDocPath';

export interface IDocOptions {
  version?: number;
}

export interface IDocPath {
  title: string;
  description: string;
  objectSchema?: ObjectSchema;
  method: string;
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
        description: path.description,
        tags,
        title: path.title,
        objectSchema: path.objectSchema,
      })
    ])))
  };
}
