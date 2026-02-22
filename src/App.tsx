/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  Plus, 
  Heart, 
  Repeat2, 
  MessageCircle, 
  Coins, 
  User as UserIcon,
  Wallet,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MoreHorizontal,
  Share2,
  Sparkles,
  RefreshCw,
  X,
  Image as ImageIcon,
  Send,
  Users,
  CheckCircle2,
  ArrowLeft,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow, format } from 'date-fns';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";
import { cn } from './types';
import type { Post, User, Chat, Message, Community, Comment } from './types';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mock Data
const MOCK_USER: User = {
  name: "bughacker",
  handle: "bughacker.skr",
  address: "Saga...4x9p",
  avatar: "https://picsum.photos/seed/bughacker/200/200",
  bio: "Hardware-attested Solana Seeker. Building on the edge of mobile Web3.",
  followers: 128,
  following: 84,
  nfts: ["https://picsum.photos/seed/nft1/100/100", "https://picsum.photos/seed/nft2/100/100"]
};

const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    participant: {
      name: "Captain Jack",
      handle: "jack.skr",
      avatar: "https://picsum.photos/seed/jack/200/200",
      isVerified: true
    },
    lastMessage: "[Locked Transmission]",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unread: true
  },
  {
    id: 'c2',
    participant: {
      name: "Rose Tyler",
      handle: "rose.skr",
      avatar: "https://picsum.photos/seed/rose/200/200",
      isVerified: true
    },
    lastMessage: "[Locked Transmission]",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  }
];

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'jack', text: "Hello! This is a secure channel between us.", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'm2', senderId: 'jack', text: "TARDIS ACCESS GRANTED: This transmission is 100% hardware-encrypted.", timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString() },
  { id: 'm3', senderId: 'me', text: "The stuff is that I have to be able to get a new phone number for the karibu", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: {
      name: "bughacker.skr",
      handle: "bughacker.skr",
      avatar: "https://picsum.photos/seed/bughacker/200/200",
      isVerified: true,
      address: "bug...sol",
      isHardwareSigned: true
    },
    content: "BJ's and I have a lot of work and cyber security is not working on the phone 😔 I have no idea 💡 😟 or the seed phrase and private key or the seed phrase and private",
    timestamp: "2026-02-20T10:00:00Z",
    likes: 0,
    reposts: 0,
    replies: 1,
    tips: 0,
    comments: [
      {
        id: 'c1',
        author: {
          name: "Saga Enthusiast",
          handle: "saga.skr",
          avatar: "https://picsum.photos/seed/saga/200/200",
          isVerified: true,
          isHardwareSigned: true
        },
        content: "I had the same issue! Try resetting the Secure Element.",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        likes: 5
      }
    ]
  },
  {
    id: '2',
    author: {
      name: "bughacker.skr",
      handle: "bughacker.skr",
      avatar: "https://picsum.photos/seed/bughacker/200/200",
      isVerified: true,
      address: "bug...sol",
      isHardwareSigned: true
    },
    content: "Trying guy to get a new phone number for the karibu stuff I have to be able to it now and I have to go to the store 😟😟 and get a your exams to get the code to the app 😁 to get",
    timestamp: "2026-02-20T09:30:00Z",
    likes: 0,
    reposts: 0,
    replies: 0,
    tips: 0
  },
  {
    id: '3',
    author: {
      name: "Anatoly Yakovenko",
      handle: "aeyakovenko.skr",
      avatar: "https://picsum.photos/seed/toly/200/200",
      isVerified: true,
      address: "toly...sol",
      isHardwareSigned: true
    },
    content: "The Solana Seeker is looking incredible. Mobile-first crypto is the only way we reach a billion users. 🚀",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 1240,
    reposts: 450,
    replies: 89,
    tips: 15.5,
    image: "https://picsum.photos/seed/seeker/800/450"
  }
];

const MOCK_TRENDING = [
  { tag: "#SolanaSummer", posts: "12.5K", category: "Trending" },
  { tag: "$JUP", posts: "8.2K", category: "DeFi" },
  { tag: "Saga Seeker", posts: "5.1K", category: "Hardware" },
  { tag: "#Bonk", posts: "25.9K", category: "Memes" },
];

const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'com1',
    name: "Solana Mobile",
    description: "The official hub for Saga and Seeker owners. Hardware-attested discussions.",
    members: 12400,
    avatar: "https://picsum.photos/seed/solanamobile/200/200",
    banner: "https://picsum.photos/seed/solanabanner/800/200",
    isJoined: true
  },
  {
    id: 'com2',
    name: "DeFi Degens",
    description: "High-speed trading, yield farming, and the latest on Jupiter & Raydium.",
    members: 45200,
    avatar: "https://picsum.photos/seed/defi/200/200",
    banner: "https://picsum.photos/seed/defibanner/800/200"
  },
  {
    id: 'com3',
    name: "Seeker Builders",
    description: "Developers building the next generation of mobile-first dApps.",
    members: 3100,
    avatar: "https://picsum.photos/seed/builders/200/200",
    banner: "https://picsum.photos/seed/buildbanner/800/200"
  }
];

const MOCK_STORIES = [
  { id: 's1', name: 'Toly', avatar: 'https://picsum.photos/seed/toly/100/100', active: true },
  { id: 's2', name: 'Mert', avatar: 'https://picsum.photos/seed/mert/100/100', active: true },
  { id: 's3', name: 'Raj', avatar: 'https://picsum.photos/seed/raj/100/100', active: false },
  { id: 's4', name: 'Lily', avatar: 'https://picsum.photos/seed/lily/100/100', active: true },
  { id: 's5', name: 'Saga', avatar: 'https://picsum.photos/seed/saga/100/100', active: false },
];

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 transition-colors",
      active ? "text-solana-green" : "text-white/50 hover:text-white"
    )}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

const PostCard = ({ post, onClick }: { post: Post, onClick?: () => void }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    if (!liked) {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#9945FF', '#14F195']
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-solana-purple flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {post.author.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold truncate">{post.author.name}</span>
                {post.author.isHardwareSigned && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-solana-green/10 rounded text-[10px] text-solana-green font-bold">
                    <CheckCircle2 size={10} />
                    Hardware Signed
                  </div>
                )}
              </div>
            </div>
            <span className="text-white/20 text-xs">
              {format(new Date(post.timestamp), 'M/d/yyyy')}
            </span>
          </div>
          
          <p className="mt-2 text-[15px] leading-relaxed text-white/90">
            {post.content}
          </p>

          {post.image && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/10">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between max-w-[200px]">
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 transition-colors",
                liked ? "text-white" : "text-white/40 hover:text-white"
              )}
            >
              <Heart size={16} fill={liked ? "white" : "none"} />
              <span className="text-xs">{likeCount}</span>
            </button>
            <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
              <Repeat2 size={16} />
              <span className="text-xs">{post.reposts}</span>
            </button>
            <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
              <MessageCircle size={16} />
              <span className="text-xs">{post.replies}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [newPostText, setNewPostText] = useState('');
  const [commentText, setCommentText] = useState('');
  
  // State for data
  const [user, setUser] = useState<User>(MOCK_USER);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    
    // Update last message in chat list
    setChats(prev => prev.map(c => 
      c.id === selectedChat.id ? { ...c, lastMessage: newMessage, timestamp: msg.timestamp } : c
    ));
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        isVerified: true,
        address: user.address,
        isHardwareSigned: true
      },
      content: newPostText,
      timestamp: new Date().toISOString(),
      likes: 0,
      reposts: 0,
      replies: 0,
      tips: 0
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setIsCreatingPost(false);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;

    setUser(prev => ({ ...prev, name, bio }));
    setIsEditingProfile(false);
  };

  const toggleJoinCommunity = (id: string) => {
    setCommunities(prev => prev.map(c => 
      c.id === id ? { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 } : c
    ));
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !activePost) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        isVerified: true,
        isHardwareSigned: true
      },
      content: commentText,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    const updatedPost = {
      ...activePost,
      replies: activePost.replies + 1,
      comments: [newComment, ...(activePost.comments || [])]
    };

    setPosts(prev => prev.map(p => p.id === activePost.id ? updatedPost : p));
    setActivePost(updatedPost);
    setCommentText('');
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Generate a short, punchy 2-sentence summary of the current trending topics in the Solana ecosystem for a mobile social app. Focus on Saga, Seeker, and DeFi.",
      });
      setAiSummary(response.text || "Solana ecosystem is buzzing with the new Seeker mobile device and Jupiter's latest updates.");
    } catch (error) {
      setAiSummary("Solana ecosystem is buzzing with the new Seeker mobile device and Jupiter's latest updates.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'explore' && !aiSummary) {
      generateSummary();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-saga-black flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-saga-black min-h-screen flex flex-col relative border-x border-white/5 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-20 bg-saga-black/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
          {activeTab === 'profile' ? (
            <h1 className="text-xl font-bold tracking-tight w-full text-center">Your Seeker Profile</h1>
          ) : activeTab === 'communities' ? (
            <h1 className="text-xl font-bold tracking-tight">Communities</h1>
          ) : activePost ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setActivePost(null)} className="text-white/60">
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold tracking-tight">Thread</h1>
            </div>
          ) : activeTab === 'messages' && selectedChat ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedChat(null)} className="text-white/60">
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <img src={selectedChat.participant.avatar} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                <div>
                  <h2 className="text-sm font-bold">{selectedChat.participant.name}</h2>
                  <p className="text-[10px] text-white/40">Hardware Attested</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg solana-gradient flex items-center justify-center font-display font-bold text-xs">
                  S
                </div>
                <h1 className="text-xl font-bold tracking-tight">Seeker</h1>
              </div>
              <button 
                onClick={() => setIsWalletConnected(!isWalletConnected)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2",
                  isWalletConnected 
                    ? "bg-white/10 text-solana-green border border-solana-green/30" 
                    : "solana-gradient text-white"
                )}
              >
                <Wallet size={14} />
                {isWalletConnected ? "Saga...4x9p" : "Connect"}
              </button>
            </>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          <AnimatePresence mode="wait">
            {activePost ? (
              <motion.div key="thread" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {/* Original Post */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex gap-3 mb-4">
                    <img src={activePost.author.avatar} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{activePost.author.name}</span>
                        {activePost.author.isHardwareSigned && <CheckCircle2 size={14} className="text-solana-green" />}
                      </div>
                      <span className="text-xs text-white/40">@{activePost.author.handle}</span>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed mb-4">{activePost.content}</p>
                  {activePost.image && (
                    <img src={activePost.image} className="w-full rounded-2xl mb-4 border border-white/10" referrerPolicy="no-referrer" />
                  )}
                  <div className="text-xs text-white/40 pb-4 border-b border-white/5">
                    {format(new Date(activePost.timestamp), 'h:mm a · MMM d, yyyy')}
                  </div>
                  <div className="flex gap-6 py-4 border-b border-white/5">
                    <div className="flex gap-1 text-sm"><span className="font-bold">{activePost.replies}</span> <span className="text-white/40">Replies</span></div>
                    <div className="flex gap-1 text-sm"><span className="font-bold">{activePost.reposts}</span> <span className="text-white/40">Reposts</span></div>
                    <div className="flex gap-1 text-sm"><span className="font-bold">{activePost.likes}</span> <span className="text-white/40">Likes</span></div>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="p-4 border-b border-white/5 flex gap-3">
                  <img src={user.avatar} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <textarea 
                      placeholder="Post your reply" 
                      className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none h-20"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className="px-6 py-1.5 bg-solana-green text-black font-bold rounded-full disabled:opacity-50"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="divide-y divide-white/5">
                  {(activePost.comments || []).map(comment => (
                    <div key={comment.id} className="p-4 flex gap-3">
                      <img src={comment.author.avatar} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm">{comment.author.name}</span>
                            {comment.author.isHardwareSigned && <CheckCircle2 size={12} className="text-solana-green" />}
                            <span className="text-xs text-white/40">@{comment.author.handle}</span>
                          </div>
                          <span className="text-[10px] text-white/20">{formatDistanceToNow(new Date(comment.timestamp))} ago</span>
                        </div>
                        <p className="text-sm mt-1 text-white/90">{comment.content}</p>
                        <div className="mt-3 flex items-center gap-4 text-white/40">
                          <button className="flex items-center gap-1 text-[10px] hover:text-white transition-colors">
                            <Heart size={12} />
                            {comment.likes}
                          </button>
                          <button className="flex items-center gap-1 text-[10px] hover:text-white transition-colors">
                            <Repeat2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : activeTab === 'home' && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Stories / Active Now */}
                <div className="flex gap-4 overflow-x-auto p-4 no-scrollbar border-b border-white/5">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center relative">
                      <img src={user.avatar} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-0 right-0 bg-solana-green rounded-full p-0.5 border-2 border-saga-black">
                        <Plus size={10} className="text-black" />
                      </div>
                    </div>
                    <span className="text-[10px] text-white/40">You</span>
                  </div>
                  {MOCK_STORIES.map(story => (
                    <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className={cn(
                        "w-14 h-14 rounded-full p-0.5 flex items-center justify-center relative",
                        story.active ? "solana-gradient" : "bg-white/10"
                      )}>
                        <div className="w-full h-full rounded-full border-2 border-saga-black overflow-hidden">
                          <img src={story.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        {story.active && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-solana-green rounded-full border-2 border-saga-black" />
                        )}
                      </div>
                      <span className="text-[10px] text-white/60">{story.name}</span>
                    </div>
                  ))}
                </div>

                <div className="divide-y divide-white/5">
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} onClick={() => setActivePost(post)} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'explore' && (
              <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="text" placeholder="Search .skr IDs..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-solana-green/50 transition-colors" />
                </div>
                <div className="glass-card p-5 mb-8 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-solana-purple" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-solana-purple">Gemini Pulse</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed italic">"{aiSummary || "Analyzing the blockchain..."}"</p>
                </div>
                <h3 className="font-display font-bold text-xl mb-4">Trending</h3>
                <div className="space-y-6">
                  {MOCK_TRENDING.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider">{item.category}</span>
                        <h4 className="text-lg font-bold group-hover:text-solana-green transition-colors">{item.tag}</h4>
                        <span className="text-xs text-white/40">{item.posts} posts</span>
                      </div>
                      <TrendingUp size={18} className="text-white/20" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {!selectedChat ? (
                  <div className="p-4 space-y-4">
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input type="text" placeholder="Search .skr IDs..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none" />
                    </div>
                    {chats.map(chat => (
                      <button 
                        key={chat.id} 
                        onClick={() => setSelectedChat(chat)}
                        className="w-full flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <img src={chat.participant.avatar} className="w-12 h-12 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="font-bold">{chat.participant.name}</span>
                              {chat.participant.isVerified && <ShieldCheck size={14} className="text-solana-green" />}
                            </div>
                            <span className="text-[10px] text-white/40">{formatDistanceToNow(new Date(chat.timestamp))} ago</span>
                          </div>
                          <p className={cn("text-sm truncate", chat.unread ? "text-solana-green font-bold" : "text-white/40")}>
                            {chat.lastMessage}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col h-[calc(100vh-144px)]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map(msg => (
                        <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.senderId === 'me' ? "ml-auto items-end" : "items-start")}>
                          {msg.senderId !== 'me' && (
                            <div className="flex items-center gap-2 mb-1">
                              <img src={selectedChat.participant.avatar} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                              <span className="text-xs font-bold">{selectedChat.participant.name}</span>
                            </div>
                          )}
                          <div className={cn(
                            "p-3 rounded-2xl text-sm",
                            msg.senderId === 'me' ? "bg-solana-purple text-white rounded-tr-none" : "bg-white/10 text-white rounded-tl-none"
                          )}>
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-white/20 mt-1">{format(new Date(msg.timestamp), 'h:mm a')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-white/5 flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="p-2 rounded-full bg-solana-green text-black"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'communities' && (
              <motion.div key="communities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-6">
                {communities.map(community => (
                  <div key={community.id} className="glass-card overflow-hidden">
                    <div className="h-24 w-full relative">
                      <img src={community.banner} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute -bottom-6 left-4">
                        <img src={community.avatar} className="w-12 h-12 rounded-xl border-2 border-saga-black" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <div className="p-4 pt-8">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{community.name}</h3>
                          <p className="text-xs text-white/40">{community.members.toLocaleString()} Members</p>
                        </div>
                        <button 
                          onClick={() => toggleJoinCommunity(community.id)}
                          className={cn(
                            "px-6 py-1.5 rounded-full text-xs font-bold transition-all",
                            community.isJoined 
                              ? "bg-white/10 text-white border border-white/20" 
                              : "bg-solana-green text-black"
                          )}
                        >
                          {community.isJoined ? "Joined" : "Join"}
                        </button>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {community.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-center">
                <p className="text-solana-green font-bold text-lg mb-4">{user.handle}</p>
                <div className="w-32 h-32 rounded-full border-2 border-solana-green mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <p className="text-white/60 text-sm mb-6 max-w-[250px] mx-auto">{user.bio}</p>
                <div className="flex justify-center gap-12 mb-8">
                  <div>
                    <p className="font-bold text-xl">{user.followers}</p>
                    <p className="text-white/40 text-xs uppercase tracking-widest">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold text-xl">{user.following}</p>
                    <p className="text-white/40 text-xs uppercase tracking-widest">Following</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-8 py-2 bg-solana-green text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  EDIT PROFILE
                </button>
                <div className="mt-12 pt-8 border-t border-white/5 text-white/20 italic text-sm">
                  [Placeholder for Posts | Activity | Media | Communities Tabs]
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Floating Action Button */}
        {!selectedChat && (
          <button 
            onClick={() => setIsCreatingPost(true)}
            className="absolute bottom-24 right-6 w-14 h-14 rounded-full solana-gradient shadow-xl shadow-solana-purple/40 flex items-center justify-center text-white z-30 active:scale-95 transition-transform"
          >
            <Plus size={28} />
          </button>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-saga-black/80 backdrop-blur-xl border-t border-white/5 h-20 px-8 flex items-center justify-between z-40">
          <NavItem icon={Home} label="" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={MessageCircle} label="" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
          <NavItem icon={Users} label="" active={activeTab === 'communities'} onClick={() => setActiveTab('communities')} />
          <NavItem icon={UserIcon} label="" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        {/* Post Creation Overlay */}
        <AnimatePresence>
          {isCreatingPost && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-0 bg-saga-black z-50 flex flex-col"
            >
              <header className="h-16 px-4 flex items-center justify-between border-b border-white/5">
                <button onClick={() => setIsCreatingPost(false)} className="text-white/60 font-medium">Cancel</button>
                <button 
                  onClick={handleCreatePost}
                  className="px-6 py-1.5 bg-solana-green text-black font-bold rounded-full disabled:opacity-50"
                  disabled={!newPostText.trim()}
                >
                  Post
                </button>
              </header>
              <div className="p-4 flex gap-4">
                <img src={MOCK_USER.avatar} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                <textarea 
                  autoFocus
                  placeholder="What's happening?"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-lg resize-none h-64"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                />
              </div>
              <footer className="mt-auto p-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4 text-solana-green">
                  <ImageIcon size={20} />
                  <Camera size={20} />
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-solana-green">
                  <Plus size={16} />
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Edit Overlay */}
        <AnimatePresence>
          {isEditingProfile && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-0 bg-saga-black z-50 flex flex-col"
            >
              <header className="h-16 flex items-center justify-between px-4 border-b border-white/5">
                <button onClick={() => setIsEditingProfile(false)} className="text-white/60">Cancel</button>
                <h2 className="text-lg font-bold">Edit Profile</h2>
                <div className="w-12" /> {/* Spacer */}
              </header>
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest">Name</label>
                  <input name="name" type="text" defaultValue={user.name} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-solana-green" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-widest">Bio</label>
                  <textarea name="bio" rows={4} defaultValue={user.bio} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-solana-green resize-none" />
                </div>
                <div className="pt-6 space-y-3">
                  <button type="submit" className="w-full py-3 bg-solana-green text-black font-bold rounded-lg">SAVE CHANGES</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
