import { useState } from 'react';

/**
 * Remplace <img> avec :
 * - loading="lazy" natif
 * - skeleton shimmer pendant le chargement (nécessite un parent position:relative avec hauteur définie)
 * - fondu à l'apparition
 */
const LazyImage = ({ src, alt, className = '', style, onLoad, onError, ...props }) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setLoaded(true);
    onError?.(e);
  };

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 img-skeleton" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
            className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </>
  );
};

export default LazyImage;
