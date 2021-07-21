import { ObjectSchema } from 'joi'
import j2s from 'joi-to-swagger'

export default function createDoc(route: string, title: string, description: string, tags: string[], objectSchema: ObjectSchema): Record<string, any> {
  return {
    [route]: {
      post: {
        summary: title,
        description,
        tags,
        parameters: [
          {
            in: 'body',
            name: 'payload',
            schema: j2s(objectSchema).swagger
          }
        ],
        responses:{
          200: {
            description : 'OK'
          },
          400: {
            description : 'Error'
          }
        }
      }
    },
  }
}
