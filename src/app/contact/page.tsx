"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function ContactPage() {
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    addToast("Message dispatched! Our styling concierge will respond within 2 hours.", "success");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container-main py-10 md:py-16 max-w-4xl mx-auto bg-[#FAFAF8]">
      <div className="text-center mb-10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">
          Concierge Assistance
        </span>
        <h1 className="font-serif-luxury text-3xl md:text-4xl font-normal text-[#18181B] mb-2">
          Contact the Maison
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-md mx-auto leading-relaxed">
          Need sizing advice, custom bridal styling, or order assistance? Reach out to our dedicated concierge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Form */}
        <div className="ciraaya-card p-6 md:p-8 bg-white">
          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold text-[#18181B] block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ciraaya-input text-xs"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="font-semibold text-[#18181B] block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ciraaya-input text-xs"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="font-semibold text-[#18181B] block mb-1">Your Message or Query *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="ciraaya-input text-xs resize-none"
                placeholder="How may our concierge assist you today?"
              />
            </div>
            <Button type="submit" fullWidth size="sm">
              Dispatch Message
            </Button>
          </form>
        </div>

        {/* Contact Channels */}
        <div className="space-y-4">
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="ciraaya-card p-5 bg-white flex items-center justify-between gap-4 hover:border-[#C5A059] transition-all group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFF8F2] border border-[#C4E3CE] text-[#25D366] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#18181B] group-hover:text-[#C5A059] transition-colors">WhatsApp Concierge</h4>
                <p className="text-[11px] text-[#71717A]">Instant styling &amp; order support</p>
              </div>
            </div>
            <span className="text-xs text-[#C5A059] font-bold shrink-0">Start Chat →</span>
          </a>

          <a
            href="https://instagram.com/ciraaya"
            target="_blank"
            rel="noopener noreferrer"
            className="ciraaya-card p-5 bg-white flex items-center justify-between gap-4 hover:border-[#C5A059] transition-all group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FBF7EE] border border-[#E8D5AA] text-[#C5A059] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#18181B] group-hover:text-[#C5A059] transition-colors">Instagram Journal</h4>
                <p className="text-[11px] text-[#71717A]">Follow @ciraaya for new drops</p>
              </div>
            </div>
            <span className="text-xs text-[#C5A059] font-bold shrink-0">Follow →</span>
          </a>

          <a
            href="mailto:care@ciraaya.com"
            className="ciraaya-card p-5 bg-white flex items-center justify-between gap-4 hover:border-[#C5A059] transition-all group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAFAF8] border border-[#EBE6DF] text-[#71717A] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#18181B] group-hover:text-[#C5A059] transition-colors">Official Email</h4>
                <p className="text-[11px] text-[#71717A]">care@ciraaya.com</p>
              </div>
            </div>
            <span className="text-xs text-[#C5A059] font-bold shrink-0">Send Email →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
