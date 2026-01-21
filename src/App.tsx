import React, { useState } from 'react';
import { Authenticator, View, Heading, Text, Card, TextField, Button, Flex } from '@aws-amplify/ui-react';
import { useCustomChat } from './client';
import './App.css';

import React, { useState } from 'react';
import { Authenticator, View, Heading, Text, Card, TextField, Button, Flex } from '@aws-amplify/ui-react';
import { useCustomChat } from './client';
import './App.css';

function ChatInterface() {
  const { messages, isLoading, sendMessage } = useCustomChat();
  const [inputValue, setInputValue] = useState('');

  const handleSend = async () => {
    if (inputValue.trim()) {
      await sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <View className="chat-container">
      <Card className="chat-card">
        <View className="chat-header">
          <Heading level={2}>AI Chatbot Assistant</Heading>
          <Text>Ask me anything! I'm here to help.</Text>
        </View>
        <View className="chat-messages">
          {messages.map((message) => (
            <View key={message.id} className={`message ${message.role}`}>
              <Text>{message.content}</Text>
            </View>
          ))}
          {isLoading && (
            <View className="message assistant">
              <Text>Typing...</Text>
            </View>
          )}
        </View>
        <Flex direction="row" gap="10px" padding="20px">
          <TextField
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            flex="1"
          />
          <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
            Send
          </Button>
        </Flex>
      </Card>
    </View>
  );
}

export default function App() {
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
        {({ signOut, user }) => {
          console.log('User object:', user);
          return (
          <View className="authenticated-app">
            <View className="app-header">
              <Heading level={1}>Welcome to AI Chatbot</Heading>
              <View className="user-info">
                <Text>Hello, {user?.signInDetails?.loginId?.split('@')[0] || 'User'}!</Text>
                <button onClick={signOut} className="sign-out-btn">
                  Sign Out
                </button>
              </View>
            </View>
            <ChatInterface />
          </View>
        );
        }}
      </Authenticator>
    </View>
  );
}