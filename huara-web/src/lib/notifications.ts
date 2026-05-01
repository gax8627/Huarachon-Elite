import { supabase } from './supabase';

// VAPID public key for Web Push (private key is stored as a Supabase secret)
const VAPID_PUBLIC_KEY = 'BDKKXQjDcwGOhpIEsusTMV-RckIcJZ1kc88rvRbSjVtl80AY0sx7gdFdRodhtCRwLDrvZ-Ujkjo4aiUDf6J2DBQ';

export async function registerPushNotifications(userId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return;
  }

  try {
    // 1. Registrar Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('SW Registered');

    // 2. Pedir permiso
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // 3. Obtener suscripción
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // 4. Guardar en Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: subscription.toJSON(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) throw error;
    console.log('Push Subscription saved to Supabase');
    
  } catch (error) {
    console.error('Error registering push:', error);
  }
}

// Helper para convertir la llave VAPID
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
