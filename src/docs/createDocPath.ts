import { ObjectSchema } from 'joi';
import j2s from 'joi-to-swagger';

export interface IDocPathOptions {
  title: string;
  description: string;
  tags: string[];
  objectSchema?: ObjectSchema;
}

export default function createDocPath({ title, description, tags, objectSchema }: IDocPathOptions): Record<string, any> {
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
        }
      ],
    }) : ({})),
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
