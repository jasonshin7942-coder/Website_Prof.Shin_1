// ============================================
// Content Models - Bilingual Data Architecture
// ============================================

// Base bilingual fields
export interface BilingualText {
  ko: string;
  en: string;
  zh?: string;
}

// Base content item with common fields
export interface BaseContent {
  id: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  featured: boolean;
  sortOrder?: number;
}

// Profile
export interface Profile {
  id: string;
  name: BilingualText;
  title: BilingualText;
  affiliation: BilingualText;
  shortIntro: BilingualText;
  biography: BilingualText;
  keywords: BilingualText;
  email: string;
  phone?: string;
  office?: string;
  website?: string;
  profileImage?: string;
  socialLinks?: {
    scholar?: string;
    researchGate?: string;
    orcid?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Research
export interface Research extends BaseContent {
  title: BilingualText;
  theme: BilingualText;
  summary: BilingualText;
  description: BilingualText;
  year: number;
  keywords: BilingualText;
  imageUrl?: string;
  category?: string;
  keyTopic?: BilingualText;
}

// Publication
export interface Publication extends BaseContent {
  title: BilingualText;
  abstract: BilingualText;
  year: number;
  category: 'journal' | 'conference' | 'book' | 'chapter' | 'thesis' | 'other';
  venue: BilingualText;
  keywords: BilingualText;
  authors: BilingualText;
  pdfUrl?: string;
  externalUrl?: string;
  doi?: string;
}

// Teaching
export interface Teaching extends BaseContent {
  title: BilingualText;
  category: 'undergraduate' | 'graduate' | 'workshop' | 'seminar' | 'other';
  summary: BilingualText;
  description: BilingualText;
  semester?: string;
  courseType?: string;
  keywords: BilingualText;
}

// Activity
export interface Activity extends BaseContent {
  title: BilingualText;
  type: 'conference' | 'talk' | 'workshop' | 'exhibition' | 'collaboration' | 'exchange' | 'other';
  date: string;
  location: BilingualText;
  summary: BilingualText;
  description: BilingualText;
  relatedLink?: string;
  imageUrl?: string;
}

// Media
export interface MediaItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  alt?: string;
  uploadedAt: string;
}

// Chatbot Source
export interface ChatbotSource {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  active: boolean;
  indexed: boolean;
  sourceType: 'document' | 'publication' | 'profile' | 'research' | 'teaching' | 'activity';
}

// Teaching Philosophy (editable from admin)
export interface TeachingPhilosophy {
  paragraph1: BilingualText;
  paragraph2: BilingualText;
  principles: {
    title: BilingualText;
    desc: BilingualText;
  }[];
}

// Research Key Topics (editable from admin)
export interface ResearchKeyTopic {
  title: BilingualText;
}

// Site Settings
export interface SiteSettings {
  siteName: BilingualText;
  siteDescription: BilingualText;
  defaultLanguage: 'ko' | 'en' | 'zh';
  contactEmail: string;
  seoTitle?: BilingualText;
  seoDescription?: BilingualText;
  analyticsId?: string;
  teachingPhilosophy?: TeachingPhilosophy;
  researchKeyTopics?: ResearchKeyTopic[];
  teachingCoursesTitle?: BilingualText;
}

// Chat Message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  timestamp: string;
}

export interface ChatSource {
  title: string;
  type: string;
  excerpt: string;
  url?: string;
}

// Locale type
export type Locale = 'ko' | 'en' | 'zh';

// Helper to get localized text
export function getLocalizedText(text: BilingualText | undefined, locale: Locale): string {
  if (!text) return '';
  return text[locale] || text.en || text.ko || '';
}
