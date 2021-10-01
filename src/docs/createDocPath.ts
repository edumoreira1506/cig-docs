import { ObjectSchema } from 'joi';
import j2s from 'joi-to-swagger';

export interface IVariable {
  name: string;
  type: string;
  description?: string;
}

export interface IDocPathOptions {
  title: string;
  description: string;
  tags: string[];
  objectSchema?: ObjectSchema;
  pathVariables?: IVariable[];
  queryParams?: IVariable[];
  headerParams?: IVariable[];
}

const formatVariable = (variable: IVariable, type: string) => ({
  in: type,
  name: variable.name,
  schema: {
    type: variable.type
  },
  description: variable.description ?? ''
});

const formatPathVariable = (variable: IVariable) => formatVariable(variable, 'path');
const formatQueryVariable = (variable: IVariable) => formatVariable(variable, 'query');
const formatHeaderVariable = (variable: IVariable) => formatVariable(variable, 'header');
const formatFileVariable = (fieldName: string) => formatVariable({ name: fieldName, type: 'file' }, 'formData');

export default function createDocPath({
  title,
  description,
  tags,
  objectSchema,
  pathVariables = [],
  queryParams = [],
  headerParams = [],
  files = []
}: IDocPathOptions & { files?: string[] }): Record<string, any> {
  const formattedPathVariables = pathVariables.map(formatPathVariable);
  const formattedQueryVariables = queryParams.map(formatQueryVariable);
  const formattedHeaderVariables = headerParams.map(formatHeaderVariable);
  const formattedFileVariables = files?.map(formatFileVariable) ?? [];
  const hasFiles = Boolean(files?.length);

  const commonSwagger = {
    summary: title,
    description,
    tags,
    ...(hasFiles ? ({
      consumes: [
        'multipart/form-data'
      ]
    }) : ({})),
    responses: {
      200: {
        description : 'OK'
      },
      400: {
        description : 'Error'
      }
    },
  };

  if (objectSchema) {
    const swaggerSchema = j2s(objectSchema).swagger;
    const bodyParams = !hasFiles ? ([
      {
        in: 'body',
        name: 'payload',
        schema: swaggerSchema
      }
    ]) : Object.entries(swaggerSchema.properties).map(([key, value]: [string, any]) => ({
      in: 'formData',
      name: key,
      type: value.type
    }));

    return {
      ...commonSwagger,
      parameters: [
        ...bodyParams,
        ...formattedFileVariables,
        ...formattedPathVariables,
        ...formattedQueryVariables,
        ...formattedHeaderVariables
      ],
    };
  }
  
  return {
    ...commonSwagger,
    parameters: [...formattedFileVariables, ...formattedPathVariables, ...formattedQueryVariables, ...formattedHeaderVariables],
  };
}
