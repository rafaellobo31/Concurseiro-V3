import { Request, Response } from 'express';
import { stripe, APP_URL, stripePriceIdPro } from './_shared.js';

export default async function createCheckoutSession(req: Request, res: Response) {
  console.log('[Stripe] Início da criação da checkout session');
  try {
    const { userId, email } = req.body;

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
      success_url: `${APP_URL}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/profile`,
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
