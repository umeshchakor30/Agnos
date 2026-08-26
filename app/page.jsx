import Link from "next/link";



export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
            Agnos Healthcare
          </h1>
          <p className="text-slate-500 mb-8">
            Select an interface to continue
          </p>

          <div className="flex flex-col gap-4">
            <Link
              href="/patient"
              className="w-full flex items-center justify-center px-6 py-3 border border-slate-200 shadow-sm text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Patient Form
            </Link>

            <Link
              href="/staff"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Staff View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
