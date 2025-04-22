import React, { useState } from 'react';
import jsPDF from 'jspdf';

const promptOptions = [
  { key: "sku_cost_change", label: "SKU Price Change Explanation" },
  { key: "customer_explanation", label: "Customer-Friendly Reason" },
  { key: "sku_tariff_scan", label: "SKUs Needing Price Updates" }
];

function InsightForm() {
  const [sku, setSku] = useState('');
  const [promptKey, setPromptKey] = useState('sku_cost_change');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [erpStatus, setErpStatus] = useState('');

  const handleAsk = async () => {
    setIsLoading(true);
    setResult('');
    setErpStatus('');
    try {
      const response = await fetch('http://localhost:5000/api/ask?log=true', {
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
      const response = await fetch('http://localhost:5000/api/push-to-erp?log=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku })
      });
      const data = await response.json();
      setErpStatus(data.message);
      setTimeout(() => setErpStatus(''), 4000);
    } catch (error) {
      console.error("ERP push failed", error);
      setErpStatus("ERP update failed");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Plicity Tariff Insight Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`SKU: ${sku}`, 20, 35);
    doc.text(`Prompt: ${promptKey}`, 20, 45);
    doc.text("Insight:", 20, 60);
    doc.setFont("courier");
    doc.text(doc.splitTextToSize(result, 170), 20, 70);
    doc.save(`plicity_insight_${sku}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prompt Type</label>
        <select
          value={promptKey}
          onChange={e => setPromptKey(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {promptOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
        <input
          type="text"
          value={sku}
          onChange={e => setSku(e.target.value)}
          placeholder="e.g. VALL-3434-M14X2"
          className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleAsk}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        {isLoading ? '⏳ Generating Insight...' : 'Get Insight'}
      </button>

      {result && (
        <div className="bg-gray-50 border rounded-md p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-2">💡 Insight Response</h3>
          <p className="text-sm whitespace-pre-wrap text-gray-700">{result}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={handlePushToERP}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              ✅ Push to ERP
            </button>
            <button
              onClick={exportToPDF}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              📄 Export PDF
            </button>
          </div>
        </div>
      )}

      {erpStatus && (
        <div className="text-green-600 text-sm font-medium">{erpStatus}</div>
      )}
    </div>
  );
}

export default InsightForm;
