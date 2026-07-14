import React from "react";
import { Plus, Minus } from "lucide-react";

// Inline SVGs for cameras to make the prototype self-contained and high-fidelity
const CameraSVG = ({ type, variant }) => {
  const isDark = variant === "charcoal";
  const primaryColor = isDark ? "#2A2D34" : "#FFFFFF";
  const accentColor = isDark ? "#4E5360" : "#E2E8F0";
  const lensColor = "#0A0A0B";
  const glowColor = "#2563EB"; // Blue status glow

  if (type === "outdoor_camera") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-32 md:h-40 transition-all duration-500">
        <defs>
          <radialGradient id="lensGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </radialGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.15" />
          </filter>
        </defs>
        <g filter="url(#shadow)">
          {/* Wall Mount Bracket */}
          <path d="M 40 85 L 65 85 L 65 105 L 40 105 Z" fill="#64748B" />
          <path d="M 60 90 L 95 80 L 95 95 L 60 95 Z" fill="#475569" />
          
          {/* Main Camera Body (Bullet shape) */}
          <rect x="85" y="55" width="80" height="60" rx="30" fill={primaryColor} stroke="#CBD5E1" strokeWidth="1" />
          <rect x="80" y="50" width="30" height="70" rx="10" fill={accentColor} />
          
          {/* Sunshield/Visor */}
          <path d="M 75 52 L 140 45 L 140 55 L 75 62 Z" fill={accentColor} />

          {/* Front Face/Lens Rim */}
          <ellipse cx="155" cy="85" rx="10" ry="25" fill="#1E293B" />
          {/* Lens */}
          <circle cx="155" cy="85" r="12" fill={lensColor} />
          {/* Aperture Reflection */}
          <circle cx="158" cy="82" r="3" fill="#38BDF8" opacity="0.7" />
          {/* Blue status LED light */}
          <circle cx="155" cy="85" r="4" fill="url(#lensGlow)" />
          <circle cx="155" cy="85" r="1.5" fill="#60A5FA" />
        </g>
      </svg>
    );
  }

  if (type === "indoor_camera") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-32 md:h-40 transition-all duration-500">
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#0F172A" floodOpacity="0.1" />
          </filter>
        </defs>
        <g filter="url(#shadow)">
          {/* Stand Base */}
          <ellipse cx="100" cy="125" rx="35" ry="8" fill={accentColor} stroke="#CBD5E1" strokeWidth="1" />
          
          {/* Stand Neck */}
          <path d="M 97 125 L 97 85 L 103 85 L 103 125 Z" fill="#64748B" />
          <circle cx="100" cy="85" r="6" fill="#475569" />

          {/* Main Body (Teardrop/Egg shape) */}
          <circle cx="100" cy="70" r="32" fill={primaryColor} stroke="#CBD5E1" strokeWidth="1" />
          
          {/* Glossy Glass Face */}
          <circle cx="100" cy="70" r="24" fill="#0F172A" />
          
          {/* Camera Lens */}
          <circle cx="100" cy="70" r="8" fill={lensColor} />
          {/* Glass glare */}
          <path d="M 85 62 A 20 20 0 0 1 115 62" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.2" />
          <circle cx="103" cy="67" r="2" fill="#38BDF8" opacity="0.8" />
          
          {/* Status Indicator LED (Green/Blue status) */}
          <circle cx="100" cy="86" r="1.5" fill="#34D399" />
        </g>
      </svg>
    );
  }

  // Doorbell
  return (
    <svg viewBox="0 0 200 150" className="w-full h-32 md:h-40">
      <defs>
        <filter id="doorbellShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.12" />
        </filter>
        <radialGradient id="buttonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
          <stop offset="60%" stopColor="#2563EB" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter="url(#doorbellShadow)">
        {/* Doorbell Mounting Plate */}
        <rect x="75" y="25" width="50" height="100" rx="8" fill="#1E293B" />
        {/* Faceplate (Two-tone design) */}
        <rect x="78" y="28" width="44" height="42" rx="4" fill="#0F172A" />
        <rect x="78" y="70" width="44" height="54" rx="4" fill="#334155" />
        
        {/* Camera Lens Assembly */}
        <circle cx="100" cy="48" r="10" fill="#020617" />
        <circle cx="100" cy="48" r="4" fill="#0F172A" />
        <circle cx="102" cy="46" r="1.5" fill="#38BDF8" opacity="0.8" />
        
        {/* Glowing Bell Button */}
        <circle cx="100" cy="95" r="14" fill="url(#buttonGlow)" />
        <circle cx="100" cy="95" r="9" fill="none" stroke="#60A5FA" strokeWidth="2.5" />
        <circle cx="100" cy="95" r="3" fill="#93C5FD" />
      </g>
    </svg>
  );
};

export default function ProductCard({
  product,
  quantities,
  activeVariants,
  onVariantChange,
  onQuantityChange
}) {
  const { id, title, description, basePrice, comparePrice, badge, variants } = product;

  // Find currently active variant for this product card (default to first variant if none selected)
  const activeVariantId = variants ? activeVariants[id] || variants[0].id : "default";
  const activeVariant = variants ? variants.find((v) => v.id === activeVariantId) : null;

  // Key used to look up quantity in the global cart state
  const cartKey = variants ? `${id}_${activeVariantId}` : `${id}_default`;
  const quantity = quantities[cartKey] || 0;

  // Determine if this product has ANY quantity added (>0 across any variants)
  const hasAnyQuantity = Object.keys(quantities).some((key) => {
    return key.startsWith(id) && quantities[key] > 0;
  });

  return (
    <div
      className={`product-card ${hasAnyQuantity ? "selected" : ""}`}
      id={`product-card-${id}`}
    >
      {badge && <span className="discount-badge">{badge}</span>}

      <div className="product-image-container">
        <CameraSVG type={id} variant={activeVariantId} />
      </div>

      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-desc">{description}</p>
        <button className="learn-more-btn" type="button">
          Learn More
        </button>

        {/* Color / Variant Selector */}
        {variants && (
          <div className="variant-selector-wrapper">
            <span className="variant-label">Color: <span className="active-variant-name">{activeVariant?.name}</span></span>
            <div className="variant-chips-container">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`variant-chip ${v.id === activeVariantId ? "active" : ""}`}
                  style={{ "--swatch-color": v.hex, "--swatch-border": v.border }}
                  onClick={() => onVariantChange(id, v.id)}
                  title={v.name}
                  aria-label={`Select color ${v.name}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price & Stepper Container */}
        <div className="product-footer">
          <div className="pricing">
            {comparePrice && (
              <span className="compare-price">${comparePrice.toFixed(2)}</span>
            )}
            <span className="active-price">${basePrice.toFixed(2)}</span>
          </div>

          <div className="stepper">
            <button
              type="button"
              className="stepper-btn"
              disabled={quantity === 0}
              onClick={() => onQuantityChange(cartKey, -1)}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="stepper-value">{quantity}</span>
            <button
              type="button"
              className="stepper-btn"
              onClick={() => onQuantityChange(cartKey, 1)}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
