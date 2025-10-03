import React, { useRef, useEffect } from 'react';
import { ChatHistory } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { BotIcon } from './Icons';

interface ChatViewProps {
  chatHistory: ChatHistory;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ChatView: React.FC<ChatViewProps> = ({ chatHistory, onSendMessage, isLoading, error }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4">
            {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <BotIcon className="w-24 h-24 mb-4 text-indigo-500" />
                    <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo ao CodeMentor AI</h2>
                    <p>Estou aqui para ajudar em sua jornada de programação.</p>
                    <p>Pergunte-me sobre conceitos, erros ou qualquer coisa em que esteja travado!</p>
                </div>
            ) : (
                <>
                    {chatHistory.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
      </div>
        {error && (
            <div className="bg-red-500/20 border-t border-b border-red-500 text-red-300 px-4 py-3 max-w-4xl mx-auto w-full" role="alert">
                <p className="font-bold">Ocorreu um erro:</p>
                <p className="text-sm">{error}</p>
            </div>
        )}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatView;