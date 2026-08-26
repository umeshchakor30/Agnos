import Link from "next/link";
import PatientForm from "@/components/patient/PatientForm";

export default function PatientPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-6 lg:mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          &larr; Back to Home
        </Link>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto">
        <PatientForm />
      </main>
    </div>
  );
}
