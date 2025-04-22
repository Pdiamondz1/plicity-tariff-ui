import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import InsightForm from './components/InsightForm';

function App() {
  const [activeTab, setActiveTab] = useState('insight');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-blue-700">Plicity • Tariff Intelligence</h1>
          <div className="space-x-2">
            <button
              className={`px-4 py-2 rounded-md font-semibold transition ${activeTab === 'insight' ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-blue-600'}`}
              onClick={() => setActiveTab('insight')}
            >
              🧠 Insights
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 text-blue-600'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-xl p-6 transition-all">
          {activeTab === 'insight' && <InsightForm />}
          {activeTab === 'dashboard' && <Dashboard />}
        </div>
      </main>
    </div>
  );
}

export default App;
