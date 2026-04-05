import { Request, Response } from 'express';
import { stripe, APP_URL, supabase } from './_shared.js';

// Helper para ler o corpo da requisição se não estiver parseado
async function getParsedBody(req: Request): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      // ignore
    }
  }

  // Se req.body estiver vazio, tenta ler o stream
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');
  
  if (!rawBody) return {};
  
  try {
    return JSON.parse(rawBody);
  } catch (e) {
    console.error('[Stripe Portal] Erro ao parsear body manual:', e);
    return {};
  }
}

export default async function createCustomerPortalSession(req: Request, res: Response) {
  console.log('[Stripe Portal] Início da criação da portal session');
  console.log('[Stripe Portal] Método:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await getParsedBody(req);
    const { userId } = body;

    if (!userId) {
      console.warn('[Stripe Portal] userId ausente');
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Find customerId from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!profile?.stripe_customer_id) {
      console.warn('[Stripe Portal] stripe_customer_id não encontrado para o usuário:', userId);
      return res.status(400).json({ error: 'No Stripe customer found for this user' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${APP_URL}/profile`,
    });

    console.log('[Stripe Portal] Sucesso na criação da portal session:', session.id);
    res.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe Portal] Erro ao criar portal session:', error);
    res.status(500).json({ error: error.message });
  }
}
