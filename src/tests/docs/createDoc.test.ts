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

  it('applies the path variables', () => {
    const unformatted = {
      route: '/users/{userId}',
      description: 'description example',
      tags: ['tag example'],
      pathVariables: [{ name: 'userId', type: 'string' }]
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
          },
          parameters: [
            {
              in: 'path',
              name: unformatted.pathVariables[0].name,
              schema: {
                type: unformatted.pathVariables[0].type
              }
            }
          ]
        }
      },
    };

    expect(
      createDoc(unformatted.route, unformatted.tags, unformattedPaths, { pathVariables: unformatted.pathVariables })
    ).toMatchObject(formatted);
  });

  it('applies the query param variables', () => {
    const unformatted = {
      route: '/users/{userId}',
      description: 'description example',
      tags: ['tag example'],
    };
    const unformattedPaths = [
      {
        method: 'post',
        title: 'title example',
        description: 'description example',
        queryParams: [{ name: 'userId', type: 'string' }]
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
              in: 'query',
              name: unformattedPaths[0].queryParams[0].name,
              schema: {
                type: unformattedPaths[0].queryParams[0].type
              }
            }
          ]
        }
      },
    };

    expect(createDoc(unformatted.route, unformatted.tags, unformattedPaths)).toMatchObject(formatted);
  });

  it('applies the header params variables', () => {
    const unformatted = {
      route: '/users/{userId}',
      description: 'description example',
      tags: ['tag example'],
    };
    const unformattedPaths = [
      {
        method: 'post',
        title: 'title example',
        description: 'description example',
        headerParams: [{ name: 'X-Test-id', type: 'safe-do-drafe-do-biruleibe' }]
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
              in: 'header',
              name: unformattedPaths[0].headerParams[0].name,
              schema: {
                type: unformattedPaths[0].headerParams[0].type
              }
            }
          ]
        }
      },
    };

    expect(createDoc(unformatted.route, unformatted.tags, unformattedPaths)).toMatchObject(formatted);
  });
});
