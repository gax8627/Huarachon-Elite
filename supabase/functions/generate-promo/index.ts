import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()

    // 1. Obtener insights del usuario
    const { data: insights } = await supabaseClient
      .from('user_insights')
      .select('action, metadata, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    // 2. Usar Gemini para generar la promo
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') ?? '')
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Analiza los siguientes eventos de un usuario en una taquería y genera una notificación push personalizada (máximo 50 caracteres).
    Eventos: ${JSON.stringify(insights)}
    
    Responde ÚNICAMENTE en formato JSON:
    {"title": "Título corto y llamativo", "body": "Mensaje de la promo", "url": "/menu"}
    Sé creativo, usa emojis de comida mexicana.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const promo = JSON.parse(responseText.substring(responseText.indexOf('{'), responseText.lastIndexOf('}') + 1))

    // 3. Obtener suscripción push
    const { data: subData } = await supabaseClient
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId)
      .single()

    if (subData?.subscription) {
      // 4. Enviar notificación (Aquí usaríamos una librería de Web-Push en Deno o un servicio simple)
      // Por simplicidad en este ejemplo, simulamos el envío exitoso
      console.log('Sending promo:', promo, 'to', userId)
      
      // En un entorno real, aquí llamaríamos al endpoint de Web Push o OneSignal
      return new Response(JSON.stringify({ success: true, promo }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'No subscription found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
