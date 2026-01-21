import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  sendMessage: a.mutation()
    .arguments({
      prompt: a.string().required(),
    })
    .returns(a.string())
    .handler(a.handler.custom({
      entry: './sendMessage.js'
    }))
    .authorization((allow) => allow.authenticated()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
