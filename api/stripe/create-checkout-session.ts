import { Request, Response } from 'express';
import { stripe, APP_URL, stripePriceIdPro } from './_shared.js';

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
    console.error('[Stripe] Erro ao parsear body manual:', e);
    return {};
  }
}

export default async function createCheckoutSession(req: Request, res: Response) {
  console.log('[Stripe] Início da criação da checkout session');
  console.log('[Stripe] Método:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await getParsedBody(req);
    console.log('[Stripe] Body recebido:', JSON.stringify(body));
    
    const { userId, email } = body;
    console.log('[Stripe] userId:', userId, 'email:', email);

    if (!userId || !email) {
      console.warn('[Stripe] Falha ao criar checkout session: userId ou email ausentes');
      return res.status(400).json({ error: 'Missing userId or email' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceIdPro,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${APP_URL}/profile?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/profile?checkout=cancel`,
      customer_email: email,
      metadata: {
        supabase_user_id: userId,
        plan: 'pro',
      },
    });

    console.log('[Stripe] Sucesso na criação da checkout session:', session.id);
    res.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe] Erro detalhado ao criar checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}
