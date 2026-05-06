export function AppShellSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4">
      <div className="mx-auto w-full max-w-6xl animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-11 w-40 rounded-full bg-slate-200" />
          <div className="h-11 w-40 rounded-full bg-slate-200" />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-4 w-44 rounded-full bg-slate-200" />
          <div className="mt-3 h-3 w-full rounded-full bg-slate-200" />
          <div className="mt-2 h-3 w-5/6 rounded-full bg-slate-200" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-200" />
          <div className="mt-4 h-10 w-32 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-4 w-2/3 rounded-full bg-slate-200" />
          <div className="mt-2 h-3 w-1/3 rounded-full bg-slate-200" />
          <div className="mt-3 h-8 w-20 rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function PageCardSkeleton() {
  return (
    <div className="flex w-full max-w-[576px] items-center justify-center px-2 sm:px-0">
      <div className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-slate-900 border-t-transparent animate-spin" />
    </div>
  );
}
