'use client';

import React, { useState, useEffect } from 'react';

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
  likes?: number;
}

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/ciraaya.in';
const INSTAGRAM_HANDLE = '@ciraaya.in';

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInstagramFeed() {
      try {
        const res = await fetch('/api/instagram');
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length > 0) {
            setPosts(data.posts);
          }
        }
      } catch (err) {
        console.error('Failed to load Instagram feed:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInstagramFeed();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#EBE6DF]">
      <div className="container-main text-center">
        <div className="max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAF8] border border-[#EBE6DF] text-[#C5A059] text-[11px] font-bold uppercase tracking-widest">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>Live Social Journal</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-normal text-[#18181B]">
            Follow <span className="italic text-[#C5A059]">{INSTAGRAM_HANDLE}</span> on Instagram
          </h2>
          <p className="text-[#71717A] text-xs uppercase tracking-wider">
            Waterproof • Anti-Tarnish • Skin-Safe Curated Jewellery Drops
          </p>
        </div>

        {/* 6-Grid Instagram Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-[#FAFAF8] rounded-xl border border-[#EBE6DF] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink || INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl bg-[#FAFAF8] block border border-[#EBE6DF] hover:border-[#C5A059] transition-all duration-300 shadow-xs hover:shadow-md"
              >
                <img
                  src={post.media_url}
                  alt={post.caption || 'CIRAAYA Instagram Post'}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Dark Overlay with Instagram SVG Icon and Caption on Hover */}
                <div className="absolute inset-0 bg-[#18181B]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#C5A059]">
                      {INSTAGRAM_HANDLE}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>

                  <p className="text-[11px] text-[#FAFAF8] line-clamp-3 leading-snug font-medium text-left">
                    {post.caption}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#E8D5AA] font-bold uppercase tracking-wider pt-1 border-t border-white/20">
                    <span>View on Instagram</span>
                    <span>↗</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Follow on Instagram CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#FFFFFF' }}
            className="ciraaya-btn ciraaya-btn-primary inline-flex items-center gap-2 px-6 py-3 !text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span style={{ color: '#FFFFFF' }} className="!text-white">Follow {INSTAGRAM_HANDLE} on Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
}
