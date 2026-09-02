import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CIRAAYA",
  description: "CIRAAYA's privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-main py-10 md:py-16 max-w-3xl mx-auto bg-[#FAFAF8]">
      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">Legal &amp; Data Protection</span>
      <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#18181B] mb-1">Privacy Policy</h1>
      <p className="text-xs text-[#71717A] mb-8">Last updated: August 2026</p>

      <div className="ciraaya-card p-6 md:p-8 bg-white space-y-6 text-xs text-[#71717A] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">1. Information We Collect</h3>
          <p>We collect personal information that you provide to us, including your full name, email address, contact telephone, delivery address, and payment information during checkout.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">2. How We Use Your Information</h3>
          <p>Your information is utilized solely to fulfill orders, transmit automated shipment &amp; tracking updates via email and WhatsApp, and provide bespoke customer concierge assistance.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">3. 256-Bit SSL Data Security</h3>
          <p>We employ bank-grade encryption protocols. Card and UPI processing is handled via certified PCI-DSS compliant gateways. We never store credit card numbers or CVV codes.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">4. Data Privacy Contact</h3>
          <p>For data privacy queries, email us at <strong className="text-[#18181B]">privacy@ciraaya.com</strong>.</p>
        </section>
      </div>
    </div>
  );
}
