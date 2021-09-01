import { ObjectSchema } from 'joi';
import j2s from 'joi-to-swagger';

export interface IPathVariable {
  name: string;
  type: string;
  description?: string;
}

export interface IDocPathOptions {
  title: string;
  description: string;
  tags: string[];
  objectSchema?: ObjectSchema;
  pathVariables?: IPathVariable[];
}

export default function createDocPath({ title, description, tags, objectSchema, pathVariables = [] }: IDocPathOptions): Record<string, any> {
  const formattedPathVariables = pathVariables.map(pathVariable => ({
    in: 'path',
    name: pathVariable.name,
    schema: {
      type: pathVariable.type
    },
    description: pathVariable.description ?? ''
  }));

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
        ...formattedPathVariables
      ],
    }) : ({
      parameters: [...formattedPathVariables]
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
