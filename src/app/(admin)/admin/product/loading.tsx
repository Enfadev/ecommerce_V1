export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-56 rounded bg-muted" />
          <div className="mt-2 h-4 w-80 rounded bg-muted" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded bg-muted" />
          <div className="h-10 w-32 rounded bg-muted" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="mt-2 h-8 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex gap-4">
          <div className="h-10 w-64 rounded bg-muted" />
          <div className="h-10 w-40 rounded bg-muted" />
          <div className="h-10 w-40 rounded bg-muted" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-16 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
