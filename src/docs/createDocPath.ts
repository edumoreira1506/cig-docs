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

export default function createDocPath({
  title,
  description,
  tags,
  objectSchema,
  pathVariables = [],
  queryParams = []
}: IDocPathOptions): Record<string, any> {
  const formattedPathVariables = pathVariables.map(formatPathVariable);
  const formattedQueryVariables = queryParams.map(formatQueryVariable);

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
        ...formattedQueryVariables
      ],
    }) : ({
      parameters: [...formattedPathVariables, ...formattedQueryVariables]
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
