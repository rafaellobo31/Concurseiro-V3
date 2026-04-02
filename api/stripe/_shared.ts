import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
export const stripeWebhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
export const stripePriceIdPro = (process.env.STRIPE_PRICE_ID_PRO || '').trim();
export const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').trim();
export const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!stripeSecretKey) {
  console.warn('[Stripe Shared] STRIPE_SECRET_KEY is not set');
} else {
  console.log('[Stripe Shared] Stripe client initialized');
}

if (stripePriceIdPro) {
  console.log('[Stripe Shared] Price ID PRO detected');
}

export const stripe = new Stripe(stripeSecretKey);

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const APP_URL = process.env.APP_URL || 'http://localhost:3000';
