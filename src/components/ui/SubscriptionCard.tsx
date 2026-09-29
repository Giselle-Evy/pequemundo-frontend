import { useEffect, useState } from 'react';
import {
  getSubscriptionStatus,
  createCheckoutSession,
  getPortalUrl,
  type SubscriptionStatus,
} from '../../services/subscription';

export default function SubscriptionCard() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const data = await getSubscriptionStatus();
        if (!cancelled) setStatus(data);
      } catch (err) {
        console.error('Error cargando suscripción:', err);
        if (!cancelled) setError('No pudimos cargar tu suscripción.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubscribe() {
    setProcessing(true);
    setError(null);
    try {
      const { url } = await createCheckoutSession();
      window.location.assign(url);
    } catch (err) {
      console.error('Error al crear checkout:', err);
      setError('No pudimos iniciar el pago.');
      setProcessing(false);
    }
  }

  async function handleManage() {
    setProcessing(true);
    setError(null);
    try {
      const url = await getPortalUrl();
      window.location.assign(url);
    } catch (err) {
      console.error('Error al abrir portal:', err);
      setError('No pudimos abrir el portal.');
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl px-4 py-3 bg-white/60 text-center">
        <p className="text-xs font-bold text-[#59413A]">
          Cargando suscripción...
        </p>
      </div>
    );
  }

  if (status?.subscribed) {
    return (
      <div className="rounded-2xl px-4 py-3 bg-[#ABF4AC] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-xs font-black text-[#003D12] leading-tight">
              Suscripción Activa
            </p>
            <p className="text-[10px] font-bold text-[#003D12] leading-tight">
              PequeMundo Premium
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleManage}
          disabled={processing}
          className="text-[11px] font-black text-white bg-[#286B33] hover:brightness-110 px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
          style={{ boxShadow: '0 2px 0 #003D12' }}
        >
          {processing ? '...' : 'Mi suscripción'}
        </button>
        {error && (
          <p className="text-[10px] font-bold text-rose-700 w-full text-right">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl px-4 py-3 bg-[#FFF3C4] flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🌟</span>
        <div>
          <p className="text-xs font-black text-[#AC3509] leading-tight">
            PequeMundo Premium
          </p>
          <p className="text-[10px] font-bold text-[#59413A] leading-tight">
            $99 MXN / mes · Cancela cuando quieras
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={processing}
        className="text-[11px] font-black text-white bg-[#FF7043] hover:brightness-110 px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
        style={{ boxShadow: '0 2px 0 #AC3509' }}
      >
        {processing ? '...' : '✨ Suscribirse'}
      </button>
      {error && (
        <p className="text-[10px] font-bold text-rose-700 w-full text-right">
          {error}
        </p>
      )}
    </div>
  );
}