import { Request, Response } from 'express';
import { stripe, supabase, stripeWebhookSecret } from './_shared.js';
import Stripe from 'stripe';

export default async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = stripeWebhookSecret;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      throw new Error('Missing stripe-signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const customerId = session.customer as string;

        if (userId) {
          await supabase
            .from('profiles')
            .update({ 
              plan: 'pro',
              stripe_customer_id: customerId 
            })
            .eq('id', userId);
          console.log(`User ${userId} upgraded to PRO via checkout`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const plan = (status === 'active' || status === 'trialing') ? 'pro' : 'free';
          await supabase
            .from('profiles')
            .update({ plan })
            .eq('id', profile.id);
          console.log(`User ${profile.id} subscription updated to ${plan} (status: ${status})`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', profile.id);
          console.log(`User ${profile.id} subscription deleted, downgraded to FREE`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: error.message });
  }
}
