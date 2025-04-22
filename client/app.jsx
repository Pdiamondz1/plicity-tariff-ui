import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/plicity-logo.png';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const promptOptions = [
  { key: "sku_cost_change", label: "SKU Price Change Explanation" },
  { key: "customer_explanation", label: "Customer-Friendly Reason" },
  { key: "sku_tariff_scan", label: "SKUs Needing Price Updates" }
];

function App() {
  const [sku, setSku] = useState('');
  const [promptKey, setPromptKey] = useState('sku_cost_change');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [erpStatus, setErpStatus] = useState('');
  const [logs, setLogs] = useState([]);
  const [filterSku, setFilterSku] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleAsk = async () => {
    setIsLoading(true);
    setResult('');
    setErpStatus('');

    try {
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, prompt_key: promptKey })
      });
      const data = await response.json();
      setResult(data.response || "No insight returned.");
    } catch (err) {
      console.error("Error fetching insight:", err);
      alert("Failed to get insight from backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToERP = async () => {
    if (!sku) return;

    try {
      const response = await fetch('http://localhost:5050/erp/sku/' + sku + '/price-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SuggestedPrice: 24.25,
          EffectiveDate: "2025-04-30",
        }),
      });

      const result = await response.json();
      setErpStatus(`✅ ${sku} successfully updated in ERP`);
      setTimeout(() => setErpStatus(''), 5000);
    } catch (error) {
      console.error("Failed to push to ERP:", error);
      setErpStatus("❌ ERP update failed.");
    }
  };

  const fetchLogs = async () => {
    let query = '';
    if (filterSku || filterType) {
      query = '?';
      if (filterSku) query += `sku=${filterSku}`;
      if (filterSku && filterType) query += '&';
      if (filterType) query += `action=${filterType}`;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/logs/filter${query}`);
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterSku, filterType]);

  const exportToCSV = () => {
    const csv = Papa.unparse(logs);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "plicity_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex flex-col items-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Plicity Logo" className="h-6 w-auto max-w-[80px] mr-3 object-contain" />
          <h1 className="text-3xl font-extrabold text-slate-800">Tariff Insight</h1>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">Insight Type</label>
          <select
            value={promptKey}
            onChange={e => setPromptKey(e.target.value)}
            className="w-full border p-2 rounded"
          >
            {promptOptions.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-sm mb-1">SKU</label>
          <input
            type="text"
            value={sku}
            onChange={e => setSku(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter SKU"
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAsk}
        >
          Get Insight
        </button>

        {isLoading && <p className="text-blue-500 text-center mt-2">Loading...</p>}

        {result && (
          <div className="mt-6 p-4 bg-slate-50 rounded shadow">
            <h2 className="font-bold mb-2">📋 Insight</h2>
            <p className="whitespace-pre-wrap text-sm text-gray-700">{result}</p>

            <div className="flex gap-2 mt-4">
              <button onClick={handlePushToERP} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                ✅ Push to ERP
              </button>
            </div>
          </div>
        )}

        {erpStatus && <div className="mt-4 text-green-600">{erpStatus}</div>}

        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-2">🗂 Activity Logs</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Filter by SKU"
              value={filterSku}
              onChange={e => setFilterSku(e.target.value)}
              className="border p-1 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Filter by Action"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="border p-1 rounded text-sm"
            />
            <button onClick={exportToCSV} className="ml-auto bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 text-sm">
              📤 Export CSV
            </button>
          </div>
          <ul className="text-sm max-h-64 overflow-y-auto border p-3 bg-white rounded">
            {logs.map(log => (
              <li key={log.id} className="mb-2 border-b pb-1">
                <strong>{log.timestamp}</strong><br />
                {log.sku} — {log.action}<br />
                <em>{log.detail}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
