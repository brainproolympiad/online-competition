// src/pages/dashboards/components/DebugPanel.tsx
import React from "react";
import Swal from "sweetalert2";
import type { DebugInfo } from "../types/adminTypes";

interface DebugPanelProps {
  debugLog: DebugInfo[];
  setDebugLog: (log: DebugInfo[]) => void;
  fetchParticipants: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ debugLog, setDebugLog, fetchParticipants }) => {
  const handleClearStorage = () => {
    Swal.fire({
      title: 'Clear All Storage?',
      text: 'This will clear all cached data and settings!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear everything!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire('Success', 'All local storage cleared!', 'success');
        fetchParticipants();
      }
    });
  };

  return (
    <div className="mb-6 bg-gray-900 text-white p-4 rounded shadow max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Log</h3>
        <div className="flex gap-2">
          <button
            onClick={handleClearStorage}
            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            Clear All Storage
          </button>
          <button
            onClick={() => setDebugLog([])}
            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            Clear Log
          </button>
        </div>
      </div>
      <div className="text-xs font-mono">
        {debugLog.map((log, index) => (
          <div key={index} className="border-b border-gray-700 py-1">
            <div className="flex justify-between">
              <span className="text-yellow-400">{log.timestamp.split('T')[1].split('.')[0]}</span>
              <span className="text-blue-400">{log.action}</span>
              <span className="text-green-400">{log.participantId ? `ID: ${log.participantId.substring(0, 8)}...` : ''}</span>
            </div>
            {log.error && <div className="text-red-400">Error: {log.error}</div>}
            {log.data && <div className="text-gray-300">Data: {JSON.stringify(log.data)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugPanel;