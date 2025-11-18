export function ChartSkeleton() {
  return (
    <div className="w-full h-full animate-pulse">
      <div className="h-full w-full bg-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-4 w-32 bg-muted rounded mx-auto" />
          <div className="h-3 w-24 bg-muted rounded mx-auto" />
        </div>
      </div>
    </div>
  );
}
