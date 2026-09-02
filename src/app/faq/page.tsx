"use client";

import React, { useState } from "react";

const faqs = [
  {
    q: "Is CIRAAYA jewellery really 100% waterproof?",
    a: "Yes! Our curated everyday pieces are treated with advanced PVD anti-tarnish protective coating. You can comfortably wear your necklaces, earrings, and rings in the shower, during gym workouts, and swimming without worrying about color fading or peeling.",
  },
  {
    q: "Will CIRAAYA jewellery turn my fingers or neck green?",
    a: "No! All CIRAAYA pieces are 100% skin-safe, hypoallergenic, and completely nickel- and lead-free. They will never turn your skin green or cause itchy allergic reactions.",
  },
  {
    q: "What materials are used in CIRAAYA jewellery?",
    a: "We use high-grade skin-safe stainless steel and brass alloys coated with 18K/24K micro-gold PVD finishes, hand-set AAA cubic zirconia crystals, and cultured pearl finishes.",
  },
  {
    q: "How long does express shipping take across India?",
    a: "All orders are dispatched via insured express courier (Delhivery / Bluedart). Delivery typically takes 3–5 business days across India. Orders above ₹999 enjoy free express shipping.",
  },
  {
    q: "What is your 7-day easy exchange policy?",
    a: "We offer a hassle-free 7-day doorstep exchange service. If you need a size change or wish to exchange a piece, simply reach out to us with your order ID.",
  },
  {
    q: "How can I see styling videos and new drops?",
    a: "Follow our official Instagram @ciraaya.in (https://www.instagram.com/ciraaya.in) for styling inspiration, reels, customer unboxings, and new drop announcements!",
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#EBE6DF] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="text-xs sm:text-sm font-semibold text-[#18181B] group-hover:text-[#C5A059] transition-colors pr-4">
          {q}
        </span>
        <span
          className={`shrink-0 text-sm text-[#71717A] transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-xs text-[#71717A] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="container-main py-12 md:py-20 max-w-2xl mx-auto bg-[#FAFAF8]">
      <div className="text-center mb-10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-2">
          Help &amp; Guidance
        </span>
        <h1 className="font-serif-luxury text-3xl md:text-5xl font-normal text-[#18181B] mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A]">
          Everything you need to know about our waterproof, anti-tarnish &amp; skin-safe curated jewellery.
        </p>
      </div>

      <div className="ciraaya-card bg-white p-6 md:p-8">
        {faqs.map((faq) => (
          <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </div>
  );
}
