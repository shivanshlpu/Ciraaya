'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface QueueItem {
  id: string;
  orderNumber: string;
  phone: string;
  type: string;
  message: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  priority: number;
  attempts: number;
  scheduledAt: string;
}

export default function AdminWhatsAppQueuePage() {
  const { addToast } = useToast();

  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: 'msg-1',
      orderNumber: 'CIR-2026-8891',
      phone: '+91 98765 43210',
      type: 'order_confirmation',
      message: '✨ Namaste Pooja! Your CIRAAYA order #CIR-2026-8891 for Celestial Aurora Kundan Choker Set is confirmed! We will update you once dispatched.',
      status: 'sent',
      priority: 2,
      attempts: 1,
      scheduledAt: '2 mins ago',
    },
    {
      id: 'msg-2',
      orderNumber: 'CIR-2026-8891',
      phone: '+91 98765 43210',
      type: 'tracking_id',
      message: '🚚 Your CIRAAYA parcel is on its way! Track live with Delhivery ID: DLHV-889192. Tap here: https://shiprocket.co/tracking/DLHV-889192',
      status: 'pending',
      priority: 3,
      attempts: 0,
      scheduledAt: 'Ready for send',
    },
    {
      id: 'msg-3',
      orderNumber: 'CIR-2026-4421',
      phone: '+91 98200 11223',
      type: 'thank_you',
      message: '💖 Thank you for adorning CIRAAYA fine jewels. We hope you love your new pieces! Tag us @ciraaya on Instagram for a chance to be featured.',
      status: 'pending',
      priority: 5,
      attempts: 0,
      scheduledAt: 'Scheduled (in 10m)',
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateDispatch = () => {
    setIsProcessing(true);
    addToast('Worker started throttled dispatch (~1 msg / 700ms with jitter)...', 'info');

    setTimeout(() => {
      setQueue((prev) =>
        prev.map((item) => (item.status === 'pending' ? { ...item, status: 'sent', attempts: 1 } : item))
      );
      setIsProcessing(false);
      addToast('All queued WhatsApp transactional messages delivered safely! ✓', 'success');
    }, 1500);
  };

  const handleAddSampleNotification = () => {
    const newMsg: QueueItem = {
      id: `msg-${Date.now()}`,
      orderNumber: `CIR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: '+91 98765 43210',
      type: 'order_confirmation',
      message: '✨ Order confirmation message queued for customer notification.',
      status: 'pending',
      priority: 2,
      attempts: 0,
      scheduledAt: 'Just now',
    };
    setQueue([newMsg, ...queue]);
    addToast('New message added to queue', 'info');
  };

  const pendingCount = queue.filter((q) => q.status === 'pending').length;
  const sentCount = queue.filter((q) => q.status === 'sent').length;
  const failedCount = queue.filter((q) => q.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
            Outbound Messaging Worker
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
            WhatsApp Dispatch Queue
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Automated customer order confirmations, tracking alerts, and concierge notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleAddSampleNotification}>
            + Enqueue Sample
          </Button>
          <Button size="sm" loading={isProcessing} onClick={handleSimulateDispatch}>
            Run Dispatch
          </Button>
        </div>
      </div>

      {/* Queue Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="ciraaya-card p-5 bg-white">
          <p className="text-xs text-[#71717A] font-semibold">Pending Queue</p>
          <p className="text-2xl font-bold text-[#9E7B32] mt-1">{pendingCount} msgs</p>
        </div>
        <div className="ciraaya-card p-5 bg-white">
          <p className="text-xs text-[#71717A] font-semibold">Delivered Today</p>
          <p className="text-2xl font-bold text-[#2A7A4C] mt-1">{sentCount} sent</p>
        </div>
        <div className="ciraaya-card p-5 bg-white">
          <p className="text-xs text-[#71717A] font-semibold">Failed / Retry</p>
          <p className="text-2xl font-bold text-[#C53030] mt-1">{failedCount} failed</p>
        </div>
        <div className="ciraaya-card p-5 bg-white">
          <p className="text-xs text-[#71717A] font-semibold">Throttling Rate</p>
          <p className="text-2xl font-bold text-[#18181B] mt-1">1.4 msg/s</p>
        </div>
      </div>

      {/* Live Queue Table */}
      <div className="ciraaya-card p-6 bg-white overflow-hidden space-y-4">
        <h3 className="font-semibold text-sm text-[#18181B] border-b border-[#EBE6DF] pb-3">
          Live Transactional Message Stream
        </h3>

        <div className="divide-y divide-[#EBE6DF]">
          {queue.map((item) => (
            <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#18181B]">{item.orderNumber}</span>
                  <span className="text-[#71717A]">→ {item.phone}</span>
                  <span className="uppercase text-[10px] font-bold bg-[#FAFAF8] border border-[#EBE6DF] px-2 py-0.5 rounded-md text-[#71717A]">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-[#9E7B32] font-bold">
                    P{item.priority}
                  </span>
                </div>
                <p className="text-[#71717A] italic bg-[#FAFAF8] p-2.5 rounded-xl border border-[#EBE6DF] text-[11px]">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`uppercase text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                    item.status === 'sent'
                      ? 'bg-[#EFF8F2] text-[#2A7A4C] border-[#C4E3CE]'
                      : item.status === 'pending'
                      ? 'bg-[#FBF7EE] text-[#9E7B32] border-[#E8D5AA]'
                      : 'bg-[#FDF2F2] text-[#C53030] border-[#F8D7DA]'
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-[#A1A1AA] text-[11px]">{item.scheduledAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
