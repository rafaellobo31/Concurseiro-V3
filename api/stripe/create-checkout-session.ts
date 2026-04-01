import { Request, Response } from 'express';
import { stripe, APP_URL } from './_shared.js';

export default async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing userId or email' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PRO,
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

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}
