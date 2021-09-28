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

export default function createDocPath({
  title,
  description,
  tags,
  objectSchema,
  pathVariables = [],
  queryParams = [],
  headerParams = [],
}: IDocPathOptions): Record<string, any> {
  const formattedPathVariables = pathVariables.map(formatPathVariable);
  const formattedQueryVariables = queryParams.map(formatQueryVariable);
  const formattedHeaderVariables = headerParams.map(formatHeaderVariable);

  return {
    summary: title,
    description,
    tags,
    ...(objectSchema ? ({
      parameters: [
        {
          in: 'body',
          name: 'payload',
          schema: j2s(objectSchema).swagger
        },
        ...formattedPathVariables,
        ...formattedQueryVariables,
        ...formattedHeaderVariables
      ],
    }) : ({
      parameters: [...formattedPathVariables, ...formattedQueryVariables, ...formattedHeaderVariables]
    })),
    responses: {
      200: {
        description : 'OK'
      },
      400: {
        description : 'Error'
      }
    }
  };
}
