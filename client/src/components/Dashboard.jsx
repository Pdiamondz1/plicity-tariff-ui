import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ top_skus: [], per_day: [] });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    const res = await fetch('http://localhost:5000/api/logs/filter?' + params.toString());
    const data = await res.json();
    setLogs(data);
  };

  const fetchSummary = async () => {
    const res = await fetch('http://localhost:5000/api/logs/summary');
    const data = await res.json();
    setSummary(data);
  };

  useEffect(() => {
    fetchLogs();
    fetchSummary();
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium">Start Date</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
          className="border p-2 rounded-md shadow-sm" />
        <label className="text-sm font-medium">End Date</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
          className="border p-2 rounded-md shadow-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-md p-4 shadow-sm">
          <h3 className="font-semibold text-md mb-2">📊 Top 5 SKUs by ERP Updates</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.top_skus}>
              <XAxis dataKey="sku" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-md p-4 shadow-sm">
          <h3 className="font-semibold text-md mb-2">📈 ERP Pushes Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={summary.per_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">🗂 Activity Log</h3>
        <ul className="bg-gray-50 border rounded-md p-3 text-sm max-h-80 overflow-y-auto shadow-sm space-y-2">
          {logs.map(log => (
            <li key={log.id} className="border-b pb-2">
              <div className="font-medium text-blue-600">{log.timestamp}</div>
              <div>{log.sku} — <span className="italic">{log.action}</span></div>
              <div className="text-xs text-gray-600">{log.detail}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
