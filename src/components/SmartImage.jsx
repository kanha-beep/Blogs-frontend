"use client";

import { useState } from "react";

export default function SmartImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  imageClassName = "",
  fallbackLabel = "",
  priority = false,
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);
  const fallbackText = (alt || fallbackLabel || "Story visual").trim();

  return (
    <div className={`smart-image ${wrapperClassName}`}>
      {!loaded && !failed && (
        <div className="smart-image__placeholder">
          <div className="smart-image__glow" />
          <div className="smart-image__shine" />
          <div className="smart-image__badge">
            <span>{fallbackLabel || "Loading visual"}</span>
          </div>
        </div>
      )}

      {failed ? (
        <div className="smart-image__fallback">
          <span className="smart-image__fallback-title">{fallbackText}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${imageClassName} ${loaded ? "smart-image__img--loaded" : "smart-image__img--loading"}`.trim()}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
        />
      )}
    </div>
  );
}
