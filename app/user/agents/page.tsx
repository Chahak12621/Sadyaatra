"use client";
import Sidebar from "@/components/Sidebar";
import AgentsList from "@/components/AgentsList";

export default function AgentsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Available Drivers</h1>
          <p className="text-slate-600">Browse verified agents and chat directly before booking.</p>
        </div>
        <AgentsList />
      </main>
    </div>
  );
}