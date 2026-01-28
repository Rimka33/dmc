import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirmer',
  message = 'Êtes-vous sûr ?',
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isDangerous = false,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${isDangerous ? 'bg-red-50' : 'bg-blue-50'}`}>
              <AlertTriangle size={24} className={isDangerous ? 'text-red-600' : 'text-blue-600'} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors ${
              isDangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-forest-green hover:bg-dark-green'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Chargement...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
