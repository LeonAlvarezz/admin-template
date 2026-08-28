function SettingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="size-20 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="h-3 w-48 rounded bg-muted" />
          </div>
        </div>
        <div className="h-9 w-full rounded bg-muted mt-4" />
        <div className="h-9 w-full rounded bg-muted" />
      </div>
    </div>
  );
}
export default SettingSkeleton;
