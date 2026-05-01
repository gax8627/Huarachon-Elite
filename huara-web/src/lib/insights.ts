import { supabase } from './supabase';

export type UserAction = 'view_item' | 'add_to_cart' | 'check_rewards' | 'view_promo';

export async function trackUserInsight(userId: string, action: UserAction, metadata: Record<string, unknown> = {}) {
  try {
    const { error } = await supabase
      .from('user_insights')
      .insert({
        user_id: userId,
        action,
        metadata,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking insight:', error);
  }
}

/**
 * El "Algoritmo" (Lógica sugerida para el Agente)
 * Esta función se llamaría desde una Edge Function de Supabase cada semana.
 * Analiza los insights y genera una oferta usando Gemini.
 */
export async function getPersonalizedRecommendation(_userId: string) {
  // En producción, esto se procesaría en el servidor (Edge Function)
  // 1. Obtener últimos 20 insights del usuario
  // 2. Pasarlos a Gemini: "Analiza qué le gusta a este usuario y crea una promo de 1 línea"
  // 3. Guardar en 'personalized_promos' y disparar Push
}
