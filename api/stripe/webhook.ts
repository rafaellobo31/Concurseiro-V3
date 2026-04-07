import { Request, Response } from 'express';
import { stripe, supabaseAdmin, stripeWebhookSecret } from './_shared.js';
import Stripe from 'stripe';

// Desabilita o body parser do Vercel para este endpoint
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper para ler o corpo bruto da requisição
async function getRawBody(req: Request): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }
  
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function stripeWebhook(req: Request, res: Response) {
  console.log('[Stripe Webhook] Recebido novo evento');
  console.log('[Stripe Webhook] Método:', req.method);
  
  const sig = req.headers['stripe-signature'];
  const webhookSecret = stripeWebhookSecret.trim();

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error('[Stripe Webhook] Falha: stripe-signature ou webhook secret ausentes');
      throw new Error('Missing stripe-signature or webhook secret');
    }

    // Obtém o corpo bruto da requisição
    const rawBody = await getRawBody(req);
    
    console.log('[Stripe Webhook] Raw body recebido (tamanho):', rawBody.length);
    console.log('[Stripe Webhook] Buffer.isBuffer(rawBody):', Buffer.isBuffer(rawBody));
    console.log('[Stripe Webhook] Assinatura recebida:', sig);

    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log(`[Stripe Webhook] Evento validado com sucesso: ${event.type}`);
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
        
        // Garante que pegamos o ID da assinatura mesmo se estiver expandido
        const subscriptionId = typeof session.subscription === 'string' 
          ? session.subscription 
          : (session.subscription as any)?.id;

        console.log(`[Stripe Webhook] Checkout concluído. UserID: ${userId}, CustomerID: ${customerId}, SubID: ${subscriptionId}`);
        console.log(`[Stripe Webhook] Metadata:`, JSON.stringify(session.metadata));

        if (userId) {
          console.log(`[Stripe Webhook] Iniciando update do plan para o usuário ${userId} usando Service Role Client`);
          
          let subscriptionStatus = 'active';
          let currentPeriodEnd = null;

          if (subscriptionId) {
            try {
              console.log(`[Stripe Webhook] Buscando detalhes da assinatura ${subscriptionId}...`);
              const sub = await stripe.subscriptions.retrieve(subscriptionId);
              subscriptionStatus = sub.status || 'active';
              currentPeriodEnd = new Date((sub as any).current_period_end * 1000).toISOString();
              console.log(`[Stripe Webhook] Assinatura recuperada: Status=${subscriptionStatus}, PeriodEnd=${currentPeriodEnd}`);
            } catch (e) {
              console.error('[Stripe Webhook] Erro ao buscar assinatura:', e);
            }
          } else {
            console.warn('[Stripe Webhook] subscriptionId ausente no checkout.session.completed');
          }

          const updatePayload = { 
            plan: 'pro',
            stripe_customer_id: customerId,
            subscription_status: subscriptionStatus,
            subscription_current_period_end: currentPeriodEnd
          };
          
          console.log(`[Stripe Webhook] Enviando payload ao Supabase para o usuário ${userId}:`, JSON.stringify(updatePayload));

          const { data, error, count } = await supabaseAdmin
            .from('profiles')
            .update(updatePayload)
            .eq('id', userId)
            .select(); // Retorna os dados para verificação
          
          console.log(`[Stripe Webhook] Update retornado. Erro: ${error ? JSON.stringify(error) : 'null'}, Linhas afetadas: ${count ?? (data?.length || 0)}`);
          
          if (error) {
            console.error(`[Stripe Webhook] Erro ao atualizar perfil do usuário ${userId}:`, error);
          } else if (!data || data.length === 0) {
            console.warn(`[Stripe Webhook] Nenhuma linha foi atualizada para o usuário ${userId}. Verifique se o ID existe na tabela profiles.`);
          } else {
            const updatedProfile = data[0];
            console.log(`[Stripe Webhook] Usuário ${userId} atualizado com sucesso.`);
            console.log(`[Stripe Webhook] Profile final no banco:`, JSON.stringify(updatedProfile));
            
            if (updatedProfile.plan === 'pro' && updatedProfile.subscription_status === subscriptionStatus) {
              console.log(`[Stripe Webhook] Verificação de sucesso: Plan=pro e Status=${subscriptionStatus} confirmados no banco.`);
            } else {
              console.error(`[Stripe Webhook] Verificação de falha: Dados no banco não batem com o esperado. Plan=${updatedProfile.plan}, Status=${updatedProfile.subscription_status}`);
            }
          }
        } else {
          console.warn('[Stripe Webhook] Checkout concluído mas supabase_user_id não encontrado no metadata');
        }
        break;
      }
      // ... rest of the cases ...

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;
        const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000).toISOString();

        console.log(`[Stripe Webhook] Assinatura atualizada. CustomerID: ${customerId}, Status: ${status}, PeriodEnd: ${currentPeriodEnd}`);

        // Find user by stripe_customer_id
        const { data: profile, error: findError } = await supabaseAdmin
          .from('profiles')
          .select('id, plan, subscription_status')
          .eq('stripe_customer_id', customerId)
          .single();

        if (findError) {
          console.error(`[Stripe Webhook] Erro ao buscar perfil pelo customerId ${customerId}:`, findError);
        } else if (profile) {
          const plan = (status === 'active' || status === 'trialing') ? 'pro' : 'free';
          console.log(`[Stripe Webhook] Usuário encontrado: ${profile.id}. Plano atual: ${profile.plan}. Novo plano: ${plan}`);
          
          const updatePayload = { 
            plan,
            subscription_status: status,
            subscription_current_period_end: currentPeriodEnd
          };
          
          console.log(`[Stripe Webhook] Enviando payload ao Supabase (update) para o usuário ${profile.id}:`, JSON.stringify(updatePayload));

          const { data, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update(updatePayload)
            .eq('id', profile.id)
            .select();
          
          if (updateError) {
            console.error(`[Stripe Webhook] Erro ao atualizar plano do usuário ${profile.id}:`, updateError);
          } else {
            console.log(`[Stripe Webhook] Usuário ${profile.id} atualizado com sucesso. Dados retornados do banco:`, JSON.stringify(data));
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log(`[Stripe Webhook] Assinatura deletada. CustomerID: ${customerId}`);

        const { data: profile, error: findError } = await supabaseAdmin
          .from('profiles')
          .select('id, plan')
          .eq('stripe_customer_id', customerId)
          .single();

        if (findError) {
          console.error(`[Stripe Webhook] Erro ao buscar perfil pelo customerId ${customerId}:`, findError);
        } else if (profile) {
          console.log(`[Stripe Webhook] Rebaixando usuário ${profile.id} para FREE. Plano atual: ${profile.plan}`);
          
          const updatePayload = { 
            plan: 'free',
            subscription_status: 'canceled',
            subscription_current_period_end: null
          };

          console.log(`[Stripe Webhook] Enviando payload ao Supabase (delete) para o usuário ${profile.id}:`, JSON.stringify(updatePayload));

          const { data, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update(updatePayload)
            .eq('id', profile.id)
            .select();
          
          if (updateError) {
            console.error(`[Stripe Webhook] Erro ao rebaixar usuário ${profile.id} para FREE:`, updateError);
          } else {
            console.log(`[Stripe Webhook] Usuário ${profile.id} rebaixado com sucesso. Dados retornados do banco:`, JSON.stringify(data));
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
