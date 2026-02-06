import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-50/90 border-emerald-100',
    error: 'bg-red-50/90 border-red-100',
    warning: 'bg-amber-50/90 border-amber-100',
    info: 'bg-blue-50/90 border-blue-100',
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-md
        transition-all duration-300 transform
        ${isExiting ? 'opacity-0 translate-x-12 scale-95' : 'opacity-100 translate-x-0 scale-100 animate-in slide-in-from-right-8'}
        ${bgColors[type] || bgColors.success}
      `}
    >
      <div className="flex-shrink-0">{icons[type] || icons.success}</div>

      <div className="flex-1">
        <p className="text-xs font-bold text-gray-800 leading-tight">{message}</p>
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar Animation */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-black/10 rounded-full overflow-hidden w-full">
        <div
          className={`h-full opacity-60 transition-all duration-[4000ms] linear ${
            type === 'success'
              ? 'bg-emerald-500'
              : type === 'error'
                ? 'bg-red-500'
                : type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
          }`}
          style={{ width: isExiting ? '0%' : '100%' }}
        />
      </div>
    </div>
  );
};

export default Notification;
