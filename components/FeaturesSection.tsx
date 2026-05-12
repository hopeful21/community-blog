const features = [
  {
    label: "Authentication",
    description: "Login state stays consistent across pages and protected actions.",
  },
  {
    label: "Realtime Comments",
    description: "New comments are reflected without breaking the reading flow.",
  },
  {
    label: "Responsive UI",
    description: "Layouts stay readable and touch-friendly on mobile screens.",
  },
  {
    label: "Post Management",
    description: "Authors can create, edit, and delete their own articles.",
  },
  {
    label: "PostgreSQL Database",
    description: "Supabase stores structured content with policy protection.",
  },
  {
    label: "Fast Performance",
    description: "Server-rendered pages keep the experience quick and stable.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24"
    >
      <div className="mb-10 max-w-2xl md:mb-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Feature Set
        </p>

        <h2 className="mt-3 text-4xl font-black text-white md:text-5xl">
          Powerful, clean, and ready to publish.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {features.map((feature, index) => (
          <div
            key={feature.label}
            className="group rounded-[26px] border border-white/10 bg-white/[0.055] p-6 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.08]"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-lg font-black text-cyan-300">
              {String(index + 1).padStart(2, "0")}
            </div>

            <h3 className="text-xl font-bold text-white">
              {feature.label}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
