import { Request, Response } from 'express';
import { stripe, supabase, stripeWebhookSecret } from './_shared.js';
import Stripe from 'stripe';

export default async function stripeWebhook(req: Request, res: Response) {
  console.log('[Stripe Webhook] Recebido novo evento');
  const sig = req.headers['stripe-signature'];
  const webhookSecret = stripeWebhookSecret;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error('[Stripe Webhook] Falha: stripe-signature ou webhook secret ausentes');
      throw new Error('Missing stripe-signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log(`[Stripe Webhook] Evento identificado: ${event.type}`);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Erro na verificação da assinatura: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const customerId = session.customer as string;

        console.log(`[Stripe Webhook] Checkout concluído. UserID: ${userId}, CustomerID: ${customerId}`);

        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .update({ 
              plan: 'pro',
              stripe_customer_id: customerId 
            })
            .eq('id', userId);
          
          if (error) {
            console.error(`[Stripe Webhook] Erro ao atualizar perfil do usuário ${userId}:`, error);
          } else {
            console.log(`[Stripe Webhook] Usuário ${userId} atualizado para o plano PRO com sucesso`);
          }
        } else {
          console.warn('[Stripe Webhook] Checkout concluído mas supabase_user_id não encontrado no metadata');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        console.log(`[Stripe Webhook] Assinatura atualizada. CustomerID: ${customerId}, Status: ${status}`);

        // Find user by stripe_customer_id
        const { data: profile, error: findError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (findError) {
          console.error(`[Stripe Webhook] Erro ao buscar perfil pelo customerId ${customerId}:`, findError);
        } else if (profile) {
          const plan = (status === 'active' || status === 'trialing') ? 'pro' : 'free';
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ plan })
            .eq('id', profile.id);
          
          if (updateError) {
            console.error(`[Stripe Webhook] Erro ao atualizar plano do usuário ${profile.id}:`, updateError);
          } else {
            console.log(`[Stripe Webhook] Usuário ${profile.id} atualizado para o plano ${plan} (status: ${status})`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log(`[Stripe Webhook] Assinatura deletada. CustomerID: ${customerId}`);

        const { data: profile, error: findError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (findError) {
          console.error(`[Stripe Webhook] Erro ao buscar perfil pelo customerId ${customerId}:`, findError);
        } else if (profile) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', profile.id);
          
          if (updateError) {
            console.error(`[Stripe Webhook] Erro ao rebaixar usuário ${profile.id} para FREE:`, updateError);
          } else {
            console.log(`[Stripe Webhook] Usuário ${profile.id} rebaixado para o plano FREE devido ao cancelamento`);
          }
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Evento ignorado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Erro crítico ao processar webhook:', error);
    res.status(500).json({ error: error.message });
  }
}
