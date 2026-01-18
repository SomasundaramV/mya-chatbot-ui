import React from 'react';
import { Authenticator, View, Heading, Text, useTheme, Card } from '@aws-amplify/ui-react';
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from './client';
import './App.css';

function ChatInterface() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');

  console.log('Messages:', messages);
  console.log('IsLoading:', isLoading);

  return (
    <View className="chat-container">
      <Card className="chat-card">
        <View className="chat-header">
          <Heading level={2}>AI Chatbot Assistant</Heading>
          <Text>Ask me anything! I'm here to help.</Text>
        </View>
        <AIConversation
          messages={messages}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
          variant="bubble"
          className="chat-conversation"
        />
      </Card>
    </View>
  );
}

export default function App() {
  const { tokens } = useTheme();
  
  return (
    <View className="app-container">
      <Authenticator
        signUpAttributes={['email', 'given_name', 'family_name']}
        formFields={{
          signUp: {
            email: {
              order: 1,
              placeholder: 'Enter your email address',
            },
            given_name: {
              order: 2,
              placeholder: 'Enter your first name',
            },
            family_name: {
              order: 3,
              placeholder: 'Enter your last name',
            },
            password: {
              order: 4,
              placeholder: 'Enter your password',
            },
            confirm_password: {
              order: 5,
              placeholder: 'Confirm your password',
            },
          },
        }}
      >
        {({ signOut, user }) => (
          <View className="authenticated-app">
            <View className="app-header">
              <Heading level={1}>Welcome to AI Chatbot</Heading>
              <View className="user-info">
                <Text>Hello, {user?.attributes?.given_name || user?.attributes?.email}!</Text>
                <button onClick={signOut} className="sign-out-btn">
                  Sign Out
                </button>
              </View>
            </View>
            <ChatInterface />
          </View>
        )}
      </Authenticator>
    </View>
  );
}