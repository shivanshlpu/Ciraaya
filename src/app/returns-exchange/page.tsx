import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchange | CIRAAYA",
  description: "CIRAAYA's 7-day easy exchange and return policy.",
};

export default function ReturnsExchangePage() {
  return (
    <div className="container-main py-10 md:py-16 max-w-3xl mx-auto bg-[#FAFAF8]">
      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-1">Customer Assurance</span>
      <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#18181B] mb-8">7-Day Easy Exchange Policy</h1>

      <div className="ciraaya-card p-6 md:p-8 bg-white space-y-6 text-xs text-[#71717A] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">1. 7-Day Hassle-Free Exchange</h3>
          <p>We want you to adore your jewellery. If you need a different size, finish, or design, you may initiate an exchange within 7 days of delivery.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">2. Complimentary Doorstep Pickup</h3>
          <p>Our courier partner will arrange doorstep pickup of your parcel. Items must be unworn, undamaged, and securely enclosed in the original velvet presentation box.</p>
        </section>
        <section className="space-y-2">
          <h3 className="text-[#18181B] text-sm font-bold">3. How to Initiate an Exchange</h3>
          <p>Message our styling concierge on WhatsApp at <strong className="text-[#18181B]">+91 99999 99999</strong> or email <strong className="text-[#18181B]">care@ciraaya.com</strong> with your Order Number.</p>
        </section>
      </div>
    </div>
  );
}
