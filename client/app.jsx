import React, { useState } from 'react';
import './App.css';

function App() {
  const [sku, setSku] = useState('');
  const [result, setResult] = useState('');

  const handleAsk = async () => {
    const response = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku })
    });
    const data = await response.json();
    setResult(data.response);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Plicity Tariff Insight</h1>
      <input
        className="border p-2 mr-2 w-full"
        type="text"
        placeholder="Enter SKU (e.g. VALL-3434-M14X2)"
        value={sku}
        onChange={e => setSku(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 mt-2 rounded" onClick={handleAsk}>
        Get Insight
      </button>
      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow whitespace-pre-wrap">
          <strong>Response:</strong>
          <div>{result}</div>
        </div>
      )}
    </div>
  );
}

export default App;
