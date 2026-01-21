import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { useState } from "react";

export const client = generateClient<Schema>({
  authMode: "userPool",
});

export function useCustomChat() {
  const [messages, setMessages] = useState<Array<{id: string, content: string, role: 'user' | 'assistant'}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage = { id: Date.now().toString(), content, role: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Direct API call since custom handler isn't working
      const response = await fetch('https://4uhmzo67p8.execute-api.us-east-1.amazonaws.com/dev/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: content }),
      });
      
      const data = await response.json();
      
      // Extract role and text content from the API response
      let responseText = '';
      let responseRole = 'assistant';
      
      if (data.result) {
        responseRole = data.result.role || 'assistant';
        if (data.result.content && Array.isArray(data.result.content)) {
          responseText = data.result.content.map((item: any) => item.text).join('\n');
        }
      } else {
        responseText = data.response || data.message || JSON.stringify(data);
      }
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: responseRole as 'assistant'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error.',
        role: 'assistant' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
}