import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Comment {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
    isHardwareSigned?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
    address: string;
    isHardwareSigned?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
  tips: number;
  image?: string;
  comments?: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  avatar: string;
  banner: string;
  isJoined?: boolean;
}

export interface User {
  name: string;
  handle: string;
  address: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  nfts: string[];
}

export interface Chat {
  id: string;
  participant: {
    name: string;
    handle: string;
    avatar: string;
    isVerified: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}
