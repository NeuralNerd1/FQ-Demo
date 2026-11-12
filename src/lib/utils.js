import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function truncate(str, length = 120) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

export function readingTime(text) {
  if (!text) return 1;
  const words = text.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const ENGINE_COLOR_MAP = {
  e1: { bg: 'bg-engine-1/10', text: 'text-engine-1', border: 'border-engine-1/30', hex: '#0D9488' },
  e2: { bg: 'bg-engine-2/10', text: 'text-engine-2', border: 'border-engine-2/30', hex: '#9333EA' },
  e3: { bg: 'bg-engine-3/10', text: 'text-engine-3', border: 'border-engine-3/30', hex: '#EC4899' },
  e4: { bg: 'bg-engine-4/10', text: 'text-engine-4', border: 'border-engine-4/30', hex: '#2563EB' },
  e5: { bg: 'bg-engine-5/10', text: 'text-engine-5', border: 'border-engine-5/30', hex: '#7C3AED' },
  e6: { bg: 'bg-engine-6/10', text: 'text-engine-6', border: 'border-engine-6/30', hex: '#D97706' },
};

export function getEngineColors(engineId) {
  return ENGINE_COLOR_MAP[engineId] || ENGINE_COLOR_MAP['e4'];
}

export const COMPANY_SIZES = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–500 employees',
  '500+ employees',
];

export const BUDGET_RANGES = [
  'Under ₹5 Lakhs',
  '₹5–25 Lakhs',
  '₹25–75 Lakhs',
  '₹75 Lakhs – ₹2 Crore',
  '₹2 Crore+',
  'Not sure yet',
];

export const TIMELINE_OPTIONS = [
  'Urgent — this month',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Just exploring',
];
