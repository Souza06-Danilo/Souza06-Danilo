
export interface Video {
  title: string;
  videoId: string;
  startTimeInSeconds: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  videos?: Video[];
}

export type ChatHistory = ChatMessage[];

export type AllChats = Record<string, ChatHistory>;
