import { promises as fs } from 'fs';
import path from 'path';
import type { Profile, Research, Publication, Teaching, Activity, SiteSettings } from '@/types/content';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

interface ContentData {
  profile: Profile;
  research: Research[];
  publications: Publication[];
  teaching: Teaching[];
  activities: Activity[];
  settings?: SiteSettings;
}

async function readContentFile(): Promise<ContentData> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading content file:', error);
    throw new Error('Failed to read content data');
  }
}

async function writeContentFile(data: ContentData): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing content file:', error);
    throw new Error('Failed to save content data');
  }
}

async function getContentData(): Promise<ContentData> {
  return await readContentFile();
}

// Profile
export async function getProfile(): Promise<Profile> {
  const data = await getContentData();
  return data.profile;
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const data = await getContentData();
  data.profile = { ...data.profile, ...updates };
  await writeContentFile(data);
  return data.profile;
}

// Research
export async function getResearchList(options?: {
  published?: boolean;
  featured?: boolean;
}): Promise<Research[]> {
  const data = await getContentData();
  let items = [...data.research];
  if (options?.published !== undefined) items = items.filter(i => i.published === options.published);
  if (options?.featured !== undefined) items = items.filter(i => i.featured === options.featured);
  return items.sort((a, b) => b.year - a.year);
}

export async function getResearchById(id: string): Promise<Research | null> {
  const data = await getContentData();
  return data.research.find(r => r.id === id) || null;
}

export async function createResearch(item: Omit<Research, 'id' | 'createdAt' | 'updatedAt'>): Promise<Research> {
  const data = await getContentData();
  const now = new Date().toISOString().split('T')[0];
  const newItem: Research = {
    ...item,
    id: `res-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  data.research.push(newItem);
  await writeContentFile(data);
  return newItem;
}

export async function updateResearch(id: string, updates: Partial<Research>): Promise<Research | null> {
  const data = await getContentData();
  const index = data.research.findIndex(r => r.id === id);
  if (index === -1) return null;
  const now = new Date().toISOString().split('T')[0];
  data.research[index] = { ...data.research[index], ...updates, updatedAt: now };
  await writeContentFile(data);
  return data.research[index];
}

export async function deleteResearch(id: string): Promise<boolean> {
  const data = await getContentData();
  const index = data.research.findIndex(r => r.id === id);
  if (index === -1) return false;
  data.research.splice(index, 1);
  await writeContentFile(data);
  return true;
}

// Publications
export async function getPublicationList(options?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
  search?: string;
}): Promise<Publication[]> {
  const data = await getContentData();
  let items = [...data.publications];
  if (options?.published !== undefined) items = items.filter(i => i.published === options.published);
  if (options?.featured !== undefined) items = items.filter(i => i.featured === options.featured);
  if (options?.category) items = items.filter(i => i.category === options.category);
  if (options?.search) {
    const q = options.search.toLowerCase();
    items = items.filter(i =>
      i.title.ko.toLowerCase().includes(q) ||
      i.title.en.toLowerCase().includes(q) ||
      i.authors.toLowerCase().includes(q)
    );
  }
  return items.sort((a, b) => b.year - a.year);
}

export async function getPublicationById(id: string): Promise<Publication | null> {
  const data = await getContentData();
  return data.publications.find(p => p.id === id) || null;
}

export async function createPublication(item: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>): Promise<Publication> {
  const data = await getContentData();
  const now = new Date().toISOString().split('T')[0];
  const newItem: Publication = {
    ...item,
    id: `pub-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  data.publications.push(newItem);
  await writeContentFile(data);
  return newItem;
}

export async function updatePublication(id: string, updates: Partial<Publication>): Promise<Publication | null> {
  const data = await getContentData();
  const index = data.publications.findIndex(p => p.id === id);
  if (index === -1) return null;
  const now = new Date().toISOString().split('T')[0];
  data.publications[index] = { ...data.publications[index], ...updates, updatedAt: now };
  await writeContentFile(data);
  return data.publications[index];
}

export async function deletePublication(id: string): Promise<boolean> {
  const data = await getContentData();
  const index = data.publications.findIndex(p => p.id === id);
  if (index === -1) return false;
  data.publications.splice(index, 1);
  await writeContentFile(data);
  return true;
}

// Teaching
export async function getTeachingList(options?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
}): Promise<Teaching[]> {
  const data = await getContentData();
  let items = [...data.teaching];
  if (options?.published !== undefined) items = items.filter(i => i.published === options.published);
  if (options?.featured !== undefined) items = items.filter(i => i.featured === options.featured);
  if (options?.category) items = items.filter(i => i.category === options.category);
  return items;
}

export async function getTeachingById(id: string): Promise<Teaching | null> {
  const data = await getContentData();
  return data.teaching.find(t => t.id === id) || null;
}

export async function createTeaching(item: Omit<Teaching, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teaching> {
  const data = await getContentData();
  const now = new Date().toISOString().split('T')[0];
  const newItem: Teaching = {
    ...item,
    id: `teach-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  data.teaching.push(newItem);
  await writeContentFile(data);
  return newItem;
}

export async function updateTeaching(id: string, updates: Partial<Teaching>): Promise<Teaching | null> {
  const data = await getContentData();
  const index = data.teaching.findIndex(t => t.id === id);
  if (index === -1) return null;
  const now = new Date().toISOString().split('T')[0];
  data.teaching[index] = { ...data.teaching[index], ...updates, updatedAt: now };
  await writeContentFile(data);
  return data.teaching[index];
}

export async function deleteTeaching(id: string): Promise<boolean> {
  const data = await getContentData();
  const index = data.teaching.findIndex(t => t.id === id);
  if (index === -1) return false;
  data.teaching.splice(index, 1);
  await writeContentFile(data);
  return true;
}

// Activities
export async function getActivityList(options?: {
  published?: boolean;
  featured?: boolean;
  type?: string;
}): Promise<Activity[]> {
  const data = await getContentData();
  let items = [...data.activities];
  if (options?.published !== undefined) items = items.filter(i => i.published === options.published);
  if (options?.featured !== undefined) items = items.filter(i => i.featured === options.featured);
  if (options?.type) items = items.filter(i => i.type === options.type);
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const data = await getContentData();
  return data.activities.find(a => a.id === id) || null;
}

export async function createActivity(item: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
  const data = await getContentData();
  const now = new Date().toISOString().split('T')[0];
  const newItem: Activity = {
    ...item,
    id: `act-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  data.activities.push(newItem);
  await writeContentFile(data);
  return newItem;
}

export async function updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | null> {
  const data = await getContentData();
  const index = data.activities.findIndex(a => a.id === id);
  if (index === -1) return null;
  const now = new Date().toISOString().split('T')[0];
  data.activities[index] = { ...data.activities[index], ...updates, updatedAt: now };
  await writeContentFile(data);
  return data.activities[index];
}

export async function deleteActivity(id: string): Promise<boolean> {
  const data = await getContentData();
  const index = data.activities.findIndex(a => a.id === id);
  if (index === -1) return false;
  data.activities.splice(index, 1);
  await writeContentFile(data);
  return true;
}

// Settings
export async function getSettings(): Promise<SiteSettings> {
  const data = await getContentData();
  return data.settings ?? {
    siteName: { ko: '', en: '' },
    siteDescription: { ko: '', en: '' },
    defaultLanguage: 'ko',
    contactEmail: '',
  };
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const data = await getContentData();
  const current = data.settings ?? {
    siteName: { ko: '', en: '' },
    siteDescription: { ko: '', en: '' },
    defaultLanguage: 'ko' as const,
    contactEmail: '',
  };
  data.settings = { ...current, ...updates };
  await writeContentFile(data);
  return data.settings;
}

// Dashboard stats
export async function getDashboardStats() {
  const data = await getContentData();
  return {
    research: data.research.length,
    publications: data.publications.length,
    teaching: data.teaching.length,
    activities: data.activities.length,
    publishedResearch: data.research.filter(r => r.published).length,
    publishedPublications: data.publications.filter(p => p.published).length,
    publishedTeaching: data.teaching.filter(t => t.published).length,
    publishedActivities: data.activities.filter(a => a.published).length,
  };
}
