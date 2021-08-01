import Joi from 'joi';

import createDoc from '@Docs/createDoc';

describe('createDoc', () => {
  it('format the documment correctly', () => {
    const unformatted = {
      route: '/example',
      description: 'description example',
      tags: ['tag example'],
    };
    const unformattedPaths = [
      {
        method: 'post',
        title: 'title example',
        description: 'description example',
      }
    ];
    const formatted = {
      [`v1${unformatted.route}`]: {
        post: {
          summary: unformattedPaths[0].title,
          description: unformattedPaths[0].description,
          tags: unformatted.tags,
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
    };

    expect(
      createDoc(unformatted.route, unformatted.tags, unformattedPaths)
    ).toMatchObject(formatted);
  });

  it('updates doc version', () => {
    const options = {
      version: 2
    };
    const unformatted = {
      route: '/example',
      description: 'description example',
      tags: ['tag example'],
    };
    const unformattedPaths = [
      {
        method: 'post',
        title: 'title example',
        description: 'description example',
      }
    ];
    const formatted = {
      [`v${options.version}${unformatted.route}`]: {
        post: {
          summary: unformattedPaths[0].title,
          description: unformattedPaths[0].description,
          tags: unformatted.tags,
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
    };

    expect(
      createDoc(unformatted.route, unformatted.tags, unformattedPaths, options)
    ).toMatchObject(formatted);
  });

  it('converts joi schema to doc object', () => {
    const mockSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const unformatted = {
      route: '/example',
      description: 'description example',
      tags: ['tag example'],
    };
    const unformattedPaths = [
      {
        method: 'post',
        title: 'title example',
        description: 'description example',
        objectSchema: mockSchema
      }
    ];
    const formatted = {
      [`v1${unformatted.route}`]: {
        post: {
          summary: unformattedPaths[0].title,
          description: unformattedPaths[0].description,
          tags: unformatted.tags,
          responses:{
            200: {
              description : 'OK'
            },
            400: {
              description : 'Error'
            }
          },
          parameters: [
            {
              in: 'body',
              name: 'payload',
              schema: {
                additionalProperties: false,
                properties: {
                  email: {
                    format: 'email',
                    type: 'string',
                  },
                  password: {
                    type: 'string'
                  }
                },
                type: 'object'
              }
            }
          ]
        }
      },
    };

    expect(
      createDoc(unformatted.route, unformatted.tags, unformattedPaths)
    ).toMatchObject(formatted);
  });
});
