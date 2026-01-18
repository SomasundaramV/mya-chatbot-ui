import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3 Sonnet'),
    systemPrompt: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses to user questions.',
  })
  .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
