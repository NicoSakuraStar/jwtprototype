// app/dashboard/page.tsx
'use client'; // <-- FIX: Declares this component must be rendered on the client

// This component relies on Middleware to ensure the user is authenticated 
// before rendering this content.

// Tried with  Tailwind before abandoning it

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-extrabold text-green-700 mb-4">
          Access Granted!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to the Protected Dashboard.
        </p>
        
        <p className="text-sm text-gray-500">
          This page proves your JWT was successfully verified by the server-side Middleware.
        </p>

        {/* The onClick handler is now valid because the component is a Client Component */}
        <p className="mt-8 text-blue-600 hover:text-blue-800 cursor-pointer"
           onClick={() => { window.location.href = '/login'; }}>
          Go back to Login
        </p>
      </div>
    </div>
  );
}