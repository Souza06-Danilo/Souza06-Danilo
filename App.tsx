import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import { AllChats, ChatHistory } from './types';
import { getAiTutorResponse } from './services/geminiService';

const App: React.FC = () => {
  const [chats, setChats] = useState<AllChats>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, if there are no chats, create a new one.
    if (Object.keys(chats).length === 0) {
      handleNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewChat = useCallback(() => {
    const newChatId = `chat_${Date.now()}`;
    setChats(prev => ({ ...prev, [newChatId]: [] }));
    setActiveChatId(newChatId);
    setError(null);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
    setError(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Tem certeza de que deseja limpar todo o histórico de conversas?')) {
        setChats({});
        handleNewChat();
    }
  }, [handleNewChat]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!activeChatId) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      role: 'user' as const,
      text: messageText,
    };

    setChats(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), userMessage],
    }));

    setIsLoading(true);
    setError(null);

    try {
      const aiResponseData = await getAiTutorResponse(messageText);
      
      const modelMessage = {
        id: `model_${Date.now()}`,
        role: 'model' as const,
        text: aiResponseData.explanation,
        videos: aiResponseData.videos,
      };

      setChats(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), modelMessage],
      }));
    } catch (e: any) {
      setError(e.message || "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId]);

  const activeChatHistory: ChatHistory = activeChatId ? chats[activeChatId] || [] : [];

  return (
    <div className="flex h-screen w-screen font-sans">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onClearHistory={handleClearHistory}
      />
      <main className="flex-1">
        {activeChatId && (
            <ChatView
              key={activeChatId}
              chatHistory={activeChatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              error={error}
            />
        )}
      </main>
    </div>
  );
};

export default App;