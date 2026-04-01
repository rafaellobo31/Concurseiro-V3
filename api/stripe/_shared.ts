import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripePriceIdPro = process.env.STRIPE_PRICE_ID_PRO;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-01-27' as any,
});

export const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

export const APP_URL = process.env.APP_URL || 'http://localhost:3000';
