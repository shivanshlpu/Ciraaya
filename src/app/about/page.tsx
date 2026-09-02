import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CIRAAYA — Curated Everyday Jewellery",
  description: "CIRAAYA crafts aesthetic, 100% waterproof, anti-tarnish, and skin-safe everyday jewellery for modern life.",
};

export default function AboutPage() {
  return (
    <div className="container-main py-12 md:py-20 max-w-3xl mx-auto bg-[#FAFAF8]">
      <div className="text-center mb-10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mb-2">
          Curated Jewellery Collection
        </span>
        <h1 className="font-serif-luxury text-3xl md:text-5xl font-normal text-[#18181B] mb-3">
          About CIRAAYA
        </h1>
        <p className="text-xs sm:text-sm text-[#71717A] max-w-lg mx-auto leading-relaxed">
          Aesthetic jewellery you never have to take off. 100% Waterproof, Anti-Tarnish &amp; Skin-Safe.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-[#71717A] leading-relaxed">
        <p>
          CIRAAYA was born from a simple everyday frustration: fine jewellery is often too precious to wear daily, while ordinary fashion jewellery quickly tarnishes, turns skin green, and loses its shine after a single shower.
        </p>

        <p>
          We set out to create high-quality, aesthetic curated jewellery designed for modern living. Pieces you can wear effortlessly from morning workouts to evening dinners without ever worrying about water damage, sweat, or sensitive skin irritation.
        </p>

        <div className="ciraaya-card p-8 bg-white text-center space-y-3">
          <h3 className="font-serif-luxury text-xl text-[#18181B]">The CIRAAYA Standard</h3>
          <p className="max-w-md mx-auto text-xs text-[#71717A] leading-relaxed">
            Every creation is treated with premium anti-tarnish PVD coating, tested for water resistance, and 100% hypoallergenic so your skin stays happy and your pieces stay sparkling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { value: "100%", label: "Waterproof & Shower-Proof" },
            { value: "Zero Fade", label: "Anti-Tarnish Coating" },
            { value: "Hypoallergenic", label: "100% Skin-Safe" },
          ].map((stat) => (
            <div key={stat.label} className="ciraaya-card p-5 bg-white">
              <p className="text-xl font-serif-luxury font-bold text-[#C5A059] mb-1">{stat.value}</p>
              <p className="text-[11px] text-[#71717A] uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center pt-2">
          Connect with us on Instagram <a href="https://www.instagram.com/ciraaya.in" target="_blank" rel="noopener noreferrer" className="font-bold text-[#C5A059] hover:underline">@ciraaya.in</a> for new drop previews, styling guides, and community unboxings!
        </p>
      </div>
    </div>
  );
}
