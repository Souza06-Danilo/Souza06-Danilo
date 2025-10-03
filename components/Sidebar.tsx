import React from 'react';
import { AllChats } from '../types';
import { PlusIcon, TrashIcon, BotIcon } from './Icons';

interface SidebarProps {
  chats: AllChats;
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onClearHistory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onNewChat, onSelectChat, onClearHistory }) => {
  const chatIds = Object.keys(chats);

  return (
    <div className="w-72 bg-gray-900 flex flex-col h-full border-r border-gray-800">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <BotIcon className="w-7 h-7 text-indigo-400"/>
            <h1 className="text-xl font-bold text-white">CodeMentor AI</h1>
        </div>
      </div>
      <div className="p-2">
        <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors text-sm"
        >
            <PlusIcon className="w-4 h-4" />
            Nova Conversa
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <h2 className="text-xs font-semibold uppercase text-gray-400 px-2 mb-2">Histórico</h2>
        <nav className="flex flex-col gap-1">
          {chatIds.map(id => {
            const firstMessage = chats[id]?.[0]?.text;
            const title = firstMessage ? (firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage) : 'Nova Conversa';
            return (
              <a
                key={id}
                href="#"
                onClick={(e) => { e.preventDefault(); onSelectChat(id); }}
                className={`block px-3 py-2 text-sm rounded-md truncate ${activeChatId === id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
              >
                {title}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onClearHistory}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-red-800/50 rounded-md transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
          Limpar Histórico
        </button>
      </div>
    </div>
  );
};

export default Sidebar;