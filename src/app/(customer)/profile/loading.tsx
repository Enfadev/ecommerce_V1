export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="h-10 w-48 bg-gray-200 rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 bg-gray-200 rounded-full mb-4" />
                <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
              <div className="mt-6 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
              <div className="space-y-6">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-4 pt-4">
                  <div className="h-10 w-32 bg-gray-200 rounded" />
                  <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
