export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string; // ISO string for dates
}

export interface Conversation {
  id: string;
  title: string; // Typically the first user query
  messages: Message[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
