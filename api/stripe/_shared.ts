import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
export const stripeWebhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
export const stripePriceIdPro = (process.env.STRIPE_PRICE_ID_PRO || '').trim();
export const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').trim();
export const supabaseAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').trim();
export const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl) console.warn('[Stripe Shared] VITE_SUPABASE_URL is not set');
if (!supabaseServiceKey) console.warn('[Stripe Shared] SUPABASE_SERVICE_ROLE_KEY is not set - Webhook updates may fail');

export const stripe = new Stripe(stripeSecretKey);

// Client padrão (anon)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin (service role) - para tarefas de backend que ignoram RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

if (supabaseServiceKey) {
  console.log('[Stripe Shared] Supabase Admin client initialized with Service Role Key');
} else {
  console.warn('[Stripe Shared] Supabase Admin client falling back to Anon Key');
}

const rawAppUrl = process.env.APP_URL || 'http://localhost:3000';
export const APP_URL = rawAppUrl.endsWith('/') ? rawAppUrl.slice(0, -1) : rawAppUrl;
