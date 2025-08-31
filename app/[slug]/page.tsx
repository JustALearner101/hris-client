// Dynamic route placeholder for top-level modules without dedicated pages.
// Next.js App Router treats [slug] as a one-segment dynamic route.
// This will render for paths like /payroll, /reports, /settings until
// you create concrete routes like app\\payroll\\page.tsx, which take precedence.
// params.slug contains the segment name (e.g., "payroll").

interface PageProps {
  params: { slug: string }
}

export default function Page({ params }: PageProps) {
  const title = params.slug
    ? params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
    : "Module"
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{title} module (placeholder)</p>
      <div className="mt-4 rounded-xl border p-4 text-sm text-muted-foreground">Coming soon…</div>
    </main>
  )
}
