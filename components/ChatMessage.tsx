
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import YouTubePlayer from './YouTubePlayer';
import { UserIcon, BotIcon } from './Icons';

interface ChatMessageProps {
  message: ChatMessageType;
}

const formatText = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(
                <p key={lastIndex} className="whitespace-pre-wrap leading-relaxed">
                    {text.substring(lastIndex, match.index)}
                </p>
            );
        }
        
        const language = match[1] || 'plaintext';
        const code = match[2];
        
        parts.push(
            <div key={match.index} className="bg-gray-950 rounded-md my-4">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-800 rounded-t-md">
                    <span className="text-sm text-gray-400">{language}</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                    <code>{code}</code>
                </pre>
            </div>
        );
        
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(
            <p key={lastIndex} className="whitespace-pre-wrap leading-relaxed">
                {text.substring(lastIndex)}
            </p>
        );
    }

    return parts;
};


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-4 py-6 ${isModel ? 'bg-gray-800/50' : ''}`}>
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-700">
        {isModel ? <BotIcon className="w-6 h-6 text-indigo-400" /> : <UserIcon className="w-6 h-6 text-gray-400" />}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="prose prose-invert prose-sm max-w-none">
          {formatText(message.text)}
        </div>
        {message.videos && message.videos.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {message.videos.map((video) => (
              <YouTubePlayer key={video.videoId} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
