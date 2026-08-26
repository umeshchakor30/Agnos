"use client";

import { useEffect, useState, useRef } from "react";

export default function StaffDashboard() {
  const [patient, setPatient] = useState(null);
  const [status, setStatus] = useState("Connecting...");
  const socketRef = useRef(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("Waiting for patient...");
      socket.send(JSON.stringify({ type: "staff:join" }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "patient:typing" || message.type === "patient:submitted") {
          setPatient(message.data);
        } else if (message.type === "patient:status") {
          setStatus(message.status);
        } else if (message.type === "error") {
          console.error("Server error:", message.message);
        }
      } catch (error) {
        console.error("Failed to parse message", error);
      }
    };

    socket.onclose = () => {
      setStatus("Disconnected / Inactive");
    };
    
    socket.onerror = () => {
      setStatus("Connection Error");
      // Using console.warn instead of console.error to prevent Next.js error overlay
      console.warn("WebSocket connection error (Server might be offline)");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Staff Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time patient monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Patient Status:</span>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              status === 'Active' ? 'bg-blue-100 text-blue-800' :
              status === 'Submitted' ? 'bg-green-100 text-green-800' :
              status === 'Waiting for patient...' ? 'bg-yellow-100 text-yellow-800' :
              status === 'Connecting...' ? 'bg-slate-100 text-slate-800' :
              status === 'Inactive' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
              'bg-red-100 text-red-800'
            }`}>
              {status === 'Active' && <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-600"></span>}
              {status === 'Submitted' && <span className="mr-1.5 h-2 w-2 rounded-full bg-green-600"></span>}
              {status === 'Waiting for patient...' && <span className="mr-1.5 h-2 w-2 rounded-full bg-yellow-600"></span>}
              {status === 'Inactive' && <span className="mr-1.5 h-2 w-2 rounded-full bg-slate-400"></span>}
              {status}
            </span>
          </div>
        </div>
        
        {!patient ? (
          <div className="rounded-lg bg-white p-12 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No patient data yet</h3>
            <p className="text-slate-500">Waiting for a patient to connect and start typing...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Personal Information
                </h2>
              </div>
              <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <span className="block text-sm font-medium text-slate-500">First Name</span>
                  <span className="mt-1 block text-slate-900">{patient.firstName || "-"}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500">Middle Name</span>
                  <span className="mt-1 block text-slate-900">{patient.middleName || "-"}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500">Last Name</span>
                  <span className="mt-1 block text-slate-900">{patient.lastName || "-"}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500">Date of Birth</span>
                  <span className="mt-1 block text-slate-900">{patient.dob || "-"}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500">Gender</span>
                  <span className="mt-1 block text-slate-900 capitalize">{patient.gender || "-"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Contact & Address
                </h2>
              </div>
              <div className="p-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <span className="block text-sm font-medium text-slate-500">Phone</span>
                  <span className="mt-1 block text-slate-900">{patient.phone || "-"}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500">Email</span>
                  <span className="mt-1 block text-slate-900">{patient.email || "-"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-sm font-medium text-slate-500">Address</span>
                  <span className="mt-1 block text-slate-900">{patient.address || "-"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Additional Information
                </h2>
              </div>
              <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <span className="block text-sm font-medium text-slate-500">Preferred Language</span>
                  <span className="mt-1 block text-slate-900 capitalize">{patient.language || "-"}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500">Nationality</span>
                  <span className="mt-1 block text-slate-900">{patient.nationality || "-"}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-500">Religion</span>
                  <span className="mt-1 block text-slate-900">{patient.religion || "-"}</span>
                </div>
                <div className="sm:col-span-3 border-t border-slate-100 pt-6 mt-2">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Emergency Contact</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <span className="block text-sm font-medium text-slate-500">Name</span>
                      <span className="mt-1 block text-slate-900">{patient.emergencyContactName || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500">Relationship</span>
                      <span className="mt-1 block text-slate-900">{patient.emergencyContactRelation || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}