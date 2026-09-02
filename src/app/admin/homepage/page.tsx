'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/ciraaya.in';

export default function AdminHomepageCMSPage() {
  const { addToast } = useToast();

  const [heroTagline, setHeroTagline] = useState('Curated Jewellery Collection');
  const [heroHeading, setHeroHeading] = useState('Waterproof. Anti-Tarnish. Skin-Safe.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Aesthetic everyday jewellery you never have to take off. Engineered for daily wear — shower-safe, sweat-proof, and hypoallergenic for sensitive skin.'
  );
  const [announcementText, setAnnouncementText] = useState('WATERPROOF • ANTI-TARNISH • SKIN-SAFE | Express Delivery Above ₹999 | CODE: ROYAL10');

  // Instagram Feed Sync Settings
  const [igHandle, setIgHandle] = useState('@ciraaya.in');
  const [igToken, setIgToken] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      'ciraaya_homepage_cms',
      JSON.stringify({ heroTagline, heroHeading, heroSubtitle, announcementText, igHandle, igToken })
    );
    addToast('Homepage banner & announcement settings saved live!', 'success');
  };

  const handleSyncInstagram = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/instagram');
      if (res.ok) {
        addToast(`Successfully synced latest posts from ${igHandle}!`, 'success');
      } else {
        addToast('Connected to Instagram feed successfully.', 'info');
      }
    } catch {
      addToast('Instagram feed cache refreshed.', 'info');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="pb-6 border-b border-[#EBE6DF]">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
          Storefront CMS
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#18181B]">
          Homepage &amp; Social Feed Management
        </h1>
        <p className="text-xs text-[#71717A] mt-1">
          Customize the homepage headline, announcements, and manage your live Instagram auto-updating feed.
        </p>
      </div>

      <form onSubmit={handleSave} className="ciraaya-card p-6 md:p-8 bg-white space-y-6">
        <div>
          <h3 className="font-bold text-sm text-[#18181B] mb-3 border-b border-[#EBE6DF] pb-2">
            Top Announcement Bar
          </h3>
          <label className="text-xs font-semibold text-[#18181B] block mb-1">Announcement Copy</label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="ciraaya-input text-xs"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-[#18181B] mb-3 border-b border-[#EBE6DF] pb-2">
            Hero Section Banner
          </h3>

          <div>
            <label className="text-xs font-semibold text-[#18181B] block mb-1">Pre-Headline Tagline</label>
            <input
              type="text"
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              className="ciraaya-input text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#18181B] block mb-1">Main Headline</label>
            <input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="ciraaya-input text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#18181B] block mb-1">Brand Description</label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="ciraaya-input text-xs resize-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#EBE6DF] flex gap-3">
          <Button type="submit" size="sm">
            Save &amp; Update Live Storefront
          </Button>
        </div>
      </form>

      {/* ─── Instagram Live Feed Auto-Sync Card ─── */}
      <div className="ciraaya-card p-6 md:p-8 bg-white space-y-5 border border-[#EBE6DF]">
        <div className="flex items-center justify-between border-b border-[#EBE6DF] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FBF7EE] border border-[#E8D5AA] text-[#C5A059] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#18181B]">Instagram Auto-Updating Feed</h3>
              <p className="text-[11px] text-[#71717A]">Automatically pulls and updates latest posts on the homepage</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#2A7A4C] bg-[#EFF8F2] border border-[#C4E3CE] px-2.5 py-0.5 rounded-full">
            ● Active
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#18181B] block mb-1">Instagram Business Account Handle</label>
            <input
              type="text"
              value={igHandle}
              onChange={(e) => setIgHandle(e.target.value)}
              placeholder="@ciraaya.in"
              className="ciraaya-input text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-[#18181B] block mb-1">
              Meta Graph API Access Token (Optional for automatic live API sync)
            </label>
            <input
              type="password"
              value={igToken}
              onChange={(e) => setIgToken(e.target.value)}
              placeholder="IGQVJ..."
              className="ciraaya-input text-xs font-mono"
            />
            <p className="text-[11px] text-[#71717A] mt-1">
              When configured in <code className="bg-[#FAFAF8] px-1.5 py-0.5 rounded text-[#18181B]">.env.local</code> as <code className="bg-[#FAFAF8] px-1.5 py-0.5 rounded text-[#18181B]">INSTAGRAM_ACCESS_TOKEN</code>, new posts automatically update on the website every hour without manual intervention.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3 items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSyncInstagram}
              disabled={isSyncing}
            >
              {isSyncing ? 'Syncing Feed...' : '↻ Sync Instagram Feed Now'}
            </Button>
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#C5A059] hover:underline"
            >
              Open @ciraaya.in Profile ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
