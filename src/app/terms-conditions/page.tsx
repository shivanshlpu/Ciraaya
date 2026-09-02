import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | CIRAAYA",
  description: "Terms and conditions for purchasing from CIRAAYA Fine Jewellery.",
};

export default function TermsPage() {
  return (
    <div className="container-main py-10 md:py-16 max-w-3xl mx-auto bg-[#FAFAF8]">
      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">Maison Agreements</span>
      <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#18181B] mb-8">Terms of Service</h1>

      <div className="ciraaya-card p-6 md:p-8 bg-white space-y-6 text-xs text-[#71717A] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">1. General Provisions</h3>
          <p>By browsing, accessing, or purchasing from CIRAAYA, you agree to comply with these terms of service and all applicable Indian commercial laws.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">2. Pricing &amp; GST Invoicing</h3>
          <p>All prices listed on CIRAAYA are in Indian Rupees (INR ₹) and are inclusive of applicable GST. Official computer-generated tax invoices are provided for every order.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">3. Product Craftsmanship &amp; Natural Variations</h3>
          <p>Because each piece features hand-set Kundan stones and genuine freshwater pearls, slight unique variations in stone luster and pearl shapes celebrate authentic artisanal handcrafting.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">4. Jurisdiction</h3>
          <p>Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Gurugram / New Delhi, India.</p>
        </section>
      </div>
    </div>
  );
}
