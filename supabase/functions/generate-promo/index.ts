import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0"
import webpush from "https://esm.sh/web-push@3.6.6"

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://huarachon-marketing.vercel.app',
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

    // 1. Get user insights
    const { data: insights } = await supabaseClient
      .from('user_insights')
      .select('action, metadata, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    // 2. Use Gemini to generate promo
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

    // 3. Get push subscription
    const { data: subData } = await supabaseClient
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId)
      .single()

    if (subData?.subscription) {
      // 4. Send actual Push Notification
      const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') ?? ''
      const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
      
      webpush.setVapidDetails(
        'mailto:admin@elhuarachon.mx',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
      )

      await webpush.sendNotification(
        subData.subscription,
        JSON.stringify(promo)
      )

      console.log('Push sent successfully to:', userId)
      
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
