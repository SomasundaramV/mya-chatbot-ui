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
      const response = await client.mutations.sendMessage({ prompt: content });
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response.data || 'No response',
        role: 'assistant' as const
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