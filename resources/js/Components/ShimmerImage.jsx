import React, { useState } from 'react';

export default function ShimmerImage({
  src,
  alt = '',
  className = '',
  wrapperClass = '',
  fallback = '/images/products/default.png',
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const finalSrc = !errored && src ? src : fallback;

  return (
    <div className={`relative overflow-hidden ${wrapperClass}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200/60 dark:bg-gray-700/40 animate-pulse" />
      )}

      <img
        src={finalSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          if (!errored) {
            setErrored(true);
            e.target.src = fallback;
          }
        }}
        {...props}
      />
    </div>
  );
}
