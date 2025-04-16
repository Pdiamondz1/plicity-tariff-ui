import React, { useState } from 'react';
import './App.css';

const [isLoading, setIsLoading] = useState(false);

const promptOptions = [
  { key: "sku_cost_change", label: "SKU Price Change Explanation" },
  { key: "customer_explanation", label: "Customer-Friendly Reason" },
  { key: "sku_tariff_scan", label: "SKUs Needing Price Updates" }
];

function App() {
  const [sku, setSku] = useState('');
  const [promptKey, setPromptKey] = useState('sku_cost_change');
  const [result, setResult] = useState('');

  const handleAsk = async () => {
    setIsLoading(true);
    setResult('');
    const response = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, prompt_key: promptKey })
    });
    const data = await response.json();
    setResult(data.response);
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center mb-6">
      <img src="./src/assets/plicity-logo.png" alt="Plicity Logo" className="h-12 mr-3" />
      <h1 className="text-3xl font-extrabold text-slate-800">Plicity Tariff Insight</h1>

        <label className="block text-sm font-medium text-gray-700 mb-1">Select Insight Type</label>
        <select
          value={promptKey}
          onChange={e => setPromptKey(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {promptOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Enter SKU</label>
        <input
          type="text"
          placeholder="e.g. VALL-3434-M14X2"
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={sku}
          onChange={e => setSku(e.target.value)}
        />

        <button
          onClick={handleAsk}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={isLoading}
        >
          Get Insight
        </button>

        {isLoading && (
          <div className="text-center text-blue-500 font-medium mt-4 animate-pulse">
            ⏳ Generating insight...
          </div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-md font-semibold text-gray-600 mb-2">📋 Insight Response</h2>
            <div className="bg-gray-100 text-gray-800 p-4 rounded-md shadow whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
