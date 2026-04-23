'use client';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const alertStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    text: 'text-green-800',
    Icon: CheckCircleIcon,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    text: 'text-red-800',
    Icon: XCircleIcon,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    text: 'text-yellow-800',
    Icon: ExclamationTriangleIcon,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-800',
    Icon: InformationCircleIcon,
  },
};

export default function Alert({ type = 'info', title, message, onClose, className = '' }) {
  const style = alertStyles[type];
  const Icon = style.Icon;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4 ${className} animate-slide-in-up`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && <h4 className={`font-semibold ${style.text} mb-1`}>{title}</h4>}
          {message && <p className={`text-sm ${style.text}`}>{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
            aria-label="Fermer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
