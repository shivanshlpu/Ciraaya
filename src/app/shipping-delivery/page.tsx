import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery | CIRAAYA",
  description: "Learn about CIRAAYA's shipping methods, delivery timelines, and transit insurance.",
};

export default function ShippingPage() {
  return (
    <div className="container-main py-10 md:py-16 max-w-3xl mx-auto bg-[#FAFAF8]">
      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">Logistics &amp; Fulfillment</span>
      <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#18181B] mb-8">Shipping &amp; Delivery</h1>

      <div className="ciraaya-card p-6 md:p-8 bg-white space-y-6 text-xs text-[#71717A] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">1. Express Insured Delivery Timelines</h3>
          <p>Standard Express Delivery: <strong>3–5 business days</strong> across all major metros and tier-1/2 Indian cities. Air cargo partners include Delhivery and Bluedart Express.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">2. Complimentary Shipping Threshold</h3>
          <p>Complimentary Insured Express Shipping on all orders above <strong>₹999</strong>. A standard shipping fee of ₹49 applies on orders under ₹999.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">3. 100% Comprehensive Transit Insurance</h3>
          <p>Every CIRAAYA parcel is fully insured against theft, loss, or transit damage until it is safely received and verified by you at your doorstep.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">4. Real-Time Tracking Updates</h3>
          <p>Upon dispatch, live tracking links are automatically sent to your WhatsApp and email. You can also view live delivery progress anytime from your Account page.</p>
        </section>
      </div>
    </div>
  );
}
