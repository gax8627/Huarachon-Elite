-- SCRIPT DE CONFIGURACIÓN TOTAL PARA EL HUARACHÓN ELITE
-- Corre este script en el SQL Editor de Supabase

-- 1. Tabla para Notificaciones Push (Web Push API)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  subscription JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla para el Algoritmo de IA (Tracking de Comportamiento)
CREATE TABLE IF NOT EXISTS user_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'view_item', 'add_to_cart', 'check_rewards'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Habilitar Seguridad (RLS)
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own subscriptions') THEN
        CREATE POLICY "Users can manage their own subscriptions" ON push_subscriptions
          FOR ALL USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own insights') THEN
        CREATE POLICY "Users can insert their own insights" ON user_insights
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 5. Publicación para Realtime (Opcional si quieres ver eventos en vivo)
ALTER PUBLICATION supabase_realtime ADD TABLE user_insights;
