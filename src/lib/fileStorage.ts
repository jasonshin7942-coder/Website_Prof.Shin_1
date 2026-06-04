// Data layer — backed by Supabase (replaces file-based JSON storage)
// All tables use a hybrid schema: queryable columns (id, published, featured, etc.)
// + a JSONB `data` column that holds the remaining fields unchanged.

import { db } from './supabase';
import type {
  Profile, Research, Publication, Teaching, Activity, SiteSettings,
} from '@/types/content';

// ── helpers ──────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().split('T')[0];

function toResearch(row: any): Research {
  return { id: row.id, published: row.published, featured: row.featured,
           year: row.year, sortOrder: row.sort_order ?? undefined, ...row.data };
}
function toPublication(row: any): Publication {
  return { id: row.id, published: row.published, featured: row.featured,
           year: row.year, sortOrder: row.sort_order ?? undefined, ...row.data };
}
function toTeaching(row: any): Teaching {
  return { id: row.id, published: row.published, featured: row.featured,
           sortOrder: row.sort_order ?? undefined, ...row.data };
}
function toActivity(row: any): Activity {
  return { id: row.id, published: row.published, featured: row.featured,
           sortOrder: row.sort_order ?? undefined, ...row.data };
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile> {
  const { data, error } = await db.from('profile').select('data').eq('id', 'prof-shin').single();
  if (error || !data) throw new Error('Failed to load profile');
  return data.data as Profile;
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const current = await getProfile();
  const merged = { ...current, ...updates };
  const { error } = await db.from('profile').upsert({ id: 'prof-shin', data: merged });
  if (error) throw new Error('Failed to update profile');
  return merged;
}

// ── Research ──────────────────────────────────────────────────────────────────

export async function getResearchList(options?: { published?: boolean; featured?: boolean }): Promise<Research[]> {
  let q = db.from('research').select('*');
  if (options?.published !== undefined) q = q.eq('published', options.published);
  if (options?.featured !== undefined) q = q.eq('featured', options.featured);
  const { data, error } = await q;
  if (error) throw new Error('Failed to load research');
  return (data ?? [])
    .map(toResearch)
    .sort((a, b) => b.year - a.year);
}

export async function getResearchById(id: string): Promise<Research | null> {
  const { data } = await db.from('research').select('*').eq('id', id).single();
  return data ? toResearch(data) : null;
}

export async function createResearch(item: Omit<Research, 'id' | 'createdAt' | 'updatedAt'>): Promise<Research> {
  const id = `res-${Date.now()}`;
  const now = today();
  const { published, featured, year, sortOrder, ...rest } = item as any;
  const row = { id, published, featured, year: year ?? new Date().getFullYear(),
                sort_order: sortOrder ?? null, data: { ...rest, createdAt: now, updatedAt: now } };
  const { error } = await db.from('research').insert(row);
  if (error) throw new Error('Failed to create research');
  return toResearch({ ...row, data: row.data });
}

export async function updateResearch(id: string, updates: Partial<Research>): Promise<Research | null> {
  const { data: row } = await db.from('research').select('*').eq('id', id).single();
  if (!row) return null;
  const current = toResearch(row);
  const merged = { ...current, ...updates, updatedAt: today() };
  const { published, featured, year, sortOrder, id: _id, ...rest } = merged as any;
  await db.from('research').update({
    published, featured, year, sort_order: sortOrder ?? null,
    data: { ...rest },
  }).eq('id', id);
  return merged;
}

export async function deleteResearch(id: string): Promise<boolean> {
  const { error } = await db.from('research').delete().eq('id', id);
  return !error;
}

// ── Publications ──────────────────────────────────────────────────────────────

export async function getPublicationList(options?: {
  published?: boolean; featured?: boolean; category?: string; search?: string;
}): Promise<Publication[]> {
  let q = db.from('publications').select('*');
  if (options?.published !== undefined) q = q.eq('published', options.published);
  if (options?.featured !== undefined) q = q.eq('featured', options.featured);
  const { data, error } = await q;
  if (error) throw new Error('Failed to load publications');
  let items = (data ?? []).map(toPublication);
  if (options?.category) items = items.filter(i => i.category === options.category);
  if (options?.search) {
    const s = options.search.toLowerCase();
    items = items.filter(i =>
      i.title.ko.toLowerCase().includes(s) ||
      i.title.en.toLowerCase().includes(s) ||
      ((i.authors as any)?.ko || '').toLowerCase().includes(s) ||
      ((i.authors as any)?.en || '').toLowerCase().includes(s)
    );
  }
  return items.sort((a, b) => b.year - a.year);
}

export async function getPublicationById(id: string): Promise<Publication | null> {
  const { data } = await db.from('publications').select('*').eq('id', id).single();
  return data ? toPublication(data) : null;
}

export async function createPublication(item: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'>): Promise<Publication> {
  const id = `pub-${Date.now()}`;
  const now = today();
  const { published, featured, year, sortOrder, ...rest } = item as any;
  const row = { id, published, featured, year: year ?? new Date().getFullYear(),
                sort_order: sortOrder ?? null, data: { ...rest, createdAt: now, updatedAt: now } };
  const { error } = await db.from('publications').insert(row);
  if (error) throw new Error('Failed to create publication');
  return toPublication({ ...row, data: row.data });
}

export async function updatePublication(id: string, updates: Partial<Publication>): Promise<Publication | null> {
  const { data: row } = await db.from('publications').select('*').eq('id', id).single();
  if (!row) return null;
  const merged = { ...toPublication(row), ...updates, updatedAt: today() };
  const { published, featured, year, sortOrder, id: _id, ...rest } = merged as any;
  await db.from('publications').update({
    published, featured, year, sort_order: sortOrder ?? null, data: { ...rest },
  }).eq('id', id);
  return merged;
}

export async function deletePublication(id: string): Promise<boolean> {
  const { error } = await db.from('publications').delete().eq('id', id);
  return !error;
}

// ── Teaching ──────────────────────────────────────────────────────────────────

export async function getTeachingList(options?: {
  published?: boolean; featured?: boolean; category?: string;
}): Promise<Teaching[]> {
  let q = db.from('teaching').select('*');
  if (options?.published !== undefined) q = q.eq('published', options.published);
  if (options?.featured !== undefined) q = q.eq('featured', options.featured);
  const { data, error } = await q;
  if (error) throw new Error('Failed to load teaching');
  let items = (data ?? []).map(toTeaching);
  if (options?.category) items = items.filter(i => i.category === options.category);
  return items.sort((a, b) => {
    const aO = a.sortOrder ?? 9999, bO = b.sortOrder ?? 9999;
    if (aO !== bO) return aO - bO;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getTeachingById(id: string): Promise<Teaching | null> {
  const { data } = await db.from('teaching').select('*').eq('id', id).single();
  return data ? toTeaching(data) : null;
}

export async function createTeaching(item: Omit<Teaching, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teaching> {
  const id = `teach-${Date.now()}`;
  const now = today();
  const { published, featured, sortOrder, ...rest } = item as any;
  const row = { id, published, featured, sort_order: sortOrder ?? null,
                data: { ...rest, createdAt: now, updatedAt: now } };
  const { error } = await db.from('teaching').insert(row);
  if (error) throw new Error('Failed to create teaching');
  return toTeaching({ ...row, data: row.data });
}

export async function updateTeaching(id: string, updates: Partial<Teaching>): Promise<Teaching | null> {
  const { data: row } = await db.from('teaching').select('*').eq('id', id).single();
  if (!row) return null;
  const merged = { ...toTeaching(row), ...updates, updatedAt: today() };
  const { published, featured, sortOrder, id: _id, ...rest } = merged as any;
  await db.from('teaching').update({
    published, featured, sort_order: sortOrder ?? null, data: { ...rest },
  }).eq('id', id);
  return merged;
}

export async function deleteTeaching(id: string): Promise<boolean> {
  const { error } = await db.from('teaching').delete().eq('id', id);
  return !error;
}

// ── Activities ────────────────────────────────────────────────────────────────

export async function getActivityList(options?: {
  published?: boolean; featured?: boolean; type?: string;
}): Promise<Activity[]> {
  let q = db.from('activities').select('*');
  if (options?.published !== undefined) q = q.eq('published', options.published);
  if (options?.featured !== undefined) q = q.eq('featured', options.featured);
  const { data, error } = await q;
  if (error) throw new Error('Failed to load activities');
  let items = (data ?? []).map(toActivity);
  if (options?.type) items = items.filter(i => i.type === options.type);
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const { data } = await db.from('activities').select('*').eq('id', id).single();
  return data ? toActivity(data) : null;
}

export async function createActivity(item: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
  const id = `act-${Date.now()}`;
  const now = today();
  const { published, featured, sortOrder, ...rest } = item as any;
  const row = { id, published, featured, sort_order: sortOrder ?? null,
                data: { ...rest, createdAt: now, updatedAt: now } };
  const { error } = await db.from('activities').insert(row);
  if (error) throw new Error('Failed to create activity');
  return toActivity({ ...row, data: row.data });
}

export async function updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | null> {
  const { data: row } = await db.from('activities').select('*').eq('id', id).single();
  if (!row) return null;
  const merged = { ...toActivity(row), ...updates, updatedAt: today() };
  const { published, featured, sortOrder, id: _id, ...rest } = merged as any;
  await db.from('activities').update({
    published, featured, sort_order: sortOrder ?? null, data: { ...rest },
  }).eq('id', id);
  return merged;
}

export async function deleteActivity(id: string): Promise<boolean> {
  const { error } = await db.from('activities').delete().eq('id', id);
  return !error;
}

// ── Settings ──────────────────────────────────────────────────────────────────

const defaultSettings: SiteSettings = {
  siteName: { ko: '', en: '' },
  siteDescription: { ko: '', en: '' },
  defaultLanguage: 'ko',
  contactEmail: '',
};

export async function getSettings(): Promise<SiteSettings> {
  const { data } = await db.from('settings').select('data').eq('id', 'main').single();
  return (data?.data as SiteSettings) ?? defaultSettings;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const merged = { ...current, ...updates };
  await db.from('settings').upsert({ id: 'main', data: merged });
  return merged;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [research, publications, teaching, activities] = await Promise.all([
    db.from('research').select('id, published'),
    db.from('publications').select('id, published'),
    db.from('teaching').select('id, published'),
    db.from('activities').select('id, published'),
  ]);
  const count = (rows: any[]) => rows.length;
  const published = (rows: any[]) => rows.filter(r => r.published).length;
  return {
    research: count(research.data ?? []),
    publications: count(publications.data ?? []),
    teaching: count(teaching.data ?? []),
    activities: count(activities.data ?? []),
    publishedResearch: published(research.data ?? []),
    publishedPublications: published(publications.data ?? []),
    publishedTeaching: published(teaching.data ?? []),
    publishedActivities: published(activities.data ?? []),
  };
}
