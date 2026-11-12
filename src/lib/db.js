/**
 * db.js — single abstraction layer for all Supabase operations.
 * Swap the backend by editing only this file.
 */
import { supabase } from './supabase';

// ─── Auth ─────────────────────────────────────────────────────
export const auth = {
  signIn: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (cb) => supabase.auth.onAuthStateChange(cb),
  updatePassword: (new_password) =>
    supabase.auth.updateUser({ password: new_password }),
};

// ─── Blog posts ───────────────────────────────────────────────
export const posts = {
  list: async ({ published = true, includeUnpublished = false, engine = null, search = null, limit = 50, offset = 0 } = {}) => {
    let q = supabase
      .from('posts')
      .select('id, title, slug, excerpt, engine_tag, author_name, is_published, published_at, created_at, cover_image_url')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (!includeUnpublished && published) q = q.eq('is_published', true);
    if (engine !== null) q = q.eq('engine_tag', engine);
    if (search) q = q.ilike('title', `%${search}%`);
    return q;
  },
  get: (slug) => supabase.from('posts').select('*').eq('slug', slug).single(),
  getBySlug: (slug) => supabase.from('posts').select('*').eq('slug', slug).single(),
  getById: (id) => supabase.from('posts').select('*').eq('id', id).single(),
  create: (data) => supabase.from('posts').insert(data).select().single(),
  update: (id, data) => supabase.from('posts').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single(),
  delete: (id) => supabase.from('posts').delete().eq('id', id),
  togglePublish: (id, is_published) =>
    supabase.from('posts').update({ is_published, published_at: is_published ? new Date().toISOString() : null }).eq('id', id),
};

// ─── Inquiries ────────────────────────────────────────────────
export const inquiries = {
  list: async ({ status = null, engine = null, limit = 50, offset = 0 } = {}) => {
    let q = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (status) q = q.eq('status', status);
    if (engine) q = q.eq('engine_id', engine);
    return q;
  },
  get: (id) => supabase.from('inquiries').select('*').eq('id', id).single(),
  create: (data) => supabase.from('inquiries').insert(data).select().single(),
  updateStatus: (id, status) =>
    supabase.from('inquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', id),
  update: (id, data) =>
    supabase.from('inquiries').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id),
};

// ─── Team ─────────────────────────────────────────────────────
export const team = {
  list: (visibleOnly = true) => {
    let q = supabase.from('team').select('*').order('display_order');
    if (visibleOnly) q = q.eq('is_visible', true);
    return q;
  },
  get: (id) => supabase.from('team').select('*').eq('id', id).single(),
  create: (data) => supabase.from('team').insert(data).select().single(),
  update: (id, data) => supabase.from('team').update(data).eq('id', id).select().single(),
  delete: (id) => supabase.from('team').delete().eq('id', id),
  toggleVisible: (id, is_visible) =>
    supabase.from('team').update({ is_visible }).eq('id', id),
};

// ─── Case studies ─────────────────────────────────────────────
export const caseStudies = {
  list: async ({ engine = null, industry = null, published = true, includeUnpublished = false, limit = 50 } = {}) => {
    let q = supabase
      .from('case_studies')
      .select('*')
      .order('display_order')
      .limit(limit);
    if (!includeUnpublished && published) q = q.eq('is_published', true);
    if (engine !== null) q = q.eq('engine_id', engine);
    if (industry) q = q.eq('client_industry', industry);
    return q;
  },
  get: (slug) => supabase.from('case_studies').select('*').eq('slug', slug).single(),
  getById: (id) => supabase.from('case_studies').select('*').eq('id', id).single(),
  create: (data) => supabase.from('case_studies').insert(data).select().single(),
  update: (id, data) => supabase.from('case_studies').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single(),
  delete: (id) => supabase.from('case_studies').delete().eq('id', id),
};

// ─── Newsletter ───────────────────────────────────────────────
export const newsletter = {
  subscribe: (email, name = null) =>
    supabase.from('newsletter_subscribers').upsert({ email, name, subscribed_at: new Date().toISOString() }, { onConflict: 'email' }),
  list: () => supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
};

// ─── Site settings (key/value) ────────────────────────────────
export const settings = {
  getAll: () => supabase.from('settings').select('*'),
  get: (key) => supabase.from('settings').select('value').eq('key', key).single(),
  set: (key, value) =>
    supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' }),
  setMany: (pairs) =>
    supabase.from('settings').upsert(
      Object.entries(pairs).map(([key, value]) => ({ key, value })),
      { onConflict: 'key' }
    ),
};

// ─── Site content (admin-editable content blocks) ─────────────
export const siteContent = {
  getAll: () => supabase.from('site_content').select('*').order('section').order('key'),
  getBySection: (section) => supabase.from('site_content').select('*').eq('section', section),
  get: (key) => supabase.from('site_content').select('value').eq('key', key).single(),
  set: (key, value) =>
    supabase.from('site_content').update({ value, updated_at: new Date().toISOString() }).eq('key', key),
  setMany: async (updates) => {
    const promises = Object.entries(updates).map(([key, value]) =>
      supabase.from('site_content').update({ value }).eq('key', key)
    );
    return Promise.all(promises);
  },
};

// ─── Engine configs (admin visibility overrides) ──────────────
export const engineConfigs = {
  getAll: () => supabase.from('engine_configs').select('*').order('display_order'),
  get: (engineId) => supabase.from('engine_configs').select('*').eq('engine_id', engineId).single(),
  update: (engineId, data) =>
    supabase.from('engine_configs')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('engine_id', engineId),
  upsert: (engineId, data) =>
    supabase.from('engine_configs')
      .upsert({ engine_id: engineId, ...data, updated_at: new Date().toISOString() }, { onConflict: 'engine_id' }),
};

// ─── Service configs (admin visibility overrides) ─────────────
export const serviceConfigs = {
  getAll: () => supabase.from('service_configs').select('*').order('display_order'),
  get: (slug) => supabase.from('service_configs').select('*').eq('service_slug', slug).single(),
  update: (slug, data) =>
    supabase.from('service_configs')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('service_slug', slug),
  upsert: (slug, data) =>
    supabase.from('service_configs')
      .upsert({ service_slug: slug, ...data }, { onConflict: 'service_slug' }),
};

// ─── Social links ─────────────────────────────────────────────
export const socialLinks = {
  list: (visibleOnly = true) => {
    let q = supabase.from('social_links').select('*').order('display_order');
    if (visibleOnly) q = q.eq('is_visible', true);
    return q;
  },
  create: (data) => supabase.from('social_links').insert(data).select().single(),
  update: (id, data) =>
    supabase.from('social_links').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single(),
  delete: (id) => supabase.from('social_links').delete().eq('id', id),
  toggleVisible: (id, is_visible) =>
    supabase.from('social_links').update({ is_visible }).eq('id', id),
  reorder: (updates) =>
    supabase.from('social_links').upsert(updates, { onConflict: 'id' }),
};

// ─── Events (awareness events / webinars) ─────────────────────
export const events = {
  list: async ({ activeOnly = true, limit = 20, offset = 0 } = {}) => {
    let q = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (activeOnly) q = q.eq('is_active', true);
    return q;
  },
  get: (id) => supabase.from('events').select('*').eq('id', id).single(),
  create: (data) => supabase.from('events').insert(data).select().single(),
  update: (id, data) =>
    supabase.from('events').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id).select().single(),
  delete: (id) => supabase.from('events').delete().eq('id', id),
  toggleActive: (id, is_active) =>
    supabase.from('events').update({ is_active, updated_at: new Date().toISOString() }).eq('id', id),
};

// ─── Dashboard stats ──────────────────────────────────────────
export const dashboard = {
  getStats: async () => {
    const [inquiriesRes, postsRes, teamRes, caseStudiesRes, eventsRes] = await Promise.all([
      supabase.from('inquiries').select('id, status').eq('status', 'new'),
      supabase.from('posts').select('id').eq('is_published', true),
      supabase.from('team').select('id'),
      supabase.from('case_studies').select('id').eq('is_published', true),
      supabase.from('events').select('id').eq('is_active', true),
    ]);
    return {
      data: {
        openInquiries: (inquiriesRes.data || []).length,
        publishedPosts: (postsRes.data || []).length,
        teamMembers: (teamRes.data || []).length,
        caseStudies: (caseStudiesRes.data || []).length,
        activeEvents: (eventsRes.data || []).length,
      },
      error: null,
    };
  },
};
