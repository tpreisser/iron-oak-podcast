'use client';

export function ConceptSection() {
  return (
    /* pt reduced on mobile: 24rem (pt-64) is too tall on 667px phones — swap to 32 (8rem) on mobile */
    <section className="relative bg-[var(--bg-primary)] pt-32 md:pt-64 lg:pt-80 pb-20 md:pb-32 lg:pb-40 z-10">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* text-lg on mobile keeps the quote readable without dominating the screen */}
        <p className="font-[family-name:var(--font-display)] text-lg md:text-2xl lg:text-3xl text-[var(--text-primary)] leading-relaxed italic" style={{ opacity: 1 }}>
          Not to lecture. Not to perform. To dig into Scripture, into doubt, into the questions most people are afraid to ask. A space where faith gets pressure-tested and Christ remains the answer.
        </p>
      </div>
    </section>
  );
}
