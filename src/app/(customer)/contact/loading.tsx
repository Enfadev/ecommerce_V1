export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse max-w-2xl mx-auto">
        {/* Page Title */}
        <div className="h-10 w-48 bg-gray-200 rounded mb-8" />

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
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
            <div className="h-32 bg-gray-200 rounded" />
          </div>
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
