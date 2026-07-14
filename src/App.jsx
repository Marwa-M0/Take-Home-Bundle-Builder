import React, { useState, useEffect } from "react";
import productsData from "./data/products.json";
import Builder from "./components/Builder";
import ReviewPanel from "./components/ReviewPanel";
import { Shield, Sparkles, RefreshCw, CheckCircle } from "lucide-react";

// Default initial state matching the design
const initialQuantities = {
  outdoor_camera_snow: 1,
  outdoor_camera_charcoal: 0,
  indoor_camera_snow: 0,
  indoor_camera_charcoal: 0,
  video_doorbell_default: 1,
  entry_sensor_default: 3,
  motion_sensor_default: 1,
  keychain_remote_default: 1
};

const initialVariants = {
  outdoor_camera: "snow",
  indoor_camera: "snow"
};

export default function App() {
  const [quantities, setQuantities] = useState(initialQuantities);
  const [activeVariants, setActiveVariants] = useState(initialVariants);
  const [selectedPlan, setSelectedPlan] = useState("fast_protect");
  const [activeStep, setActiveStep] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("security_builder_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.quantities) setQuantities(parsed.quantities);
        if (parsed.activeVariants) setActiveVariants(parsed.activeVariants);
        if (parsed.selectedPlan) setSelectedPlan(parsed.selectedPlan);
        showToast("Welcome back! Your saved configuration has been restored.");
      } catch (err) {
        console.error("Failed to parse saved config:", err);
      }
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleQuantityChange = (key, delta) => {
    setQuantities((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [key]: next
      };
    });
  };

  const handleVariantChange = (productId, variantId) => {
    setActiveVariants((prev) => ({
      ...prev,
      [productId]: variantId
    }));
  };

  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSave = () => {
    const config = {
      quantities,
      activeVariants,
      selectedPlan
    };
    localStorage.setItem("security_builder_config", JSON.stringify(config));
    showToast("Your security system configuration has been saved successfully!");
  };

  const handleReset = () => {
    setQuantities(initialQuantities);
    setActiveVariants(initialVariants);
    setSelectedPlan("fast_protect");
    setActiveStep(1);
    localStorage.removeItem("security_builder_config");
    showToast("Configuration reset to design defaults.");
  };

  const handleCheckout = () => {
    alert("Thank you! Your secure system prototype is configured. Checkout features are simulated in this build.");
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo-group">
            <Shield className="logo-icon text-indigo-500" size={24} />
            <span className="logo-text">SHIELD SECURE</span>
            <span className="badge-pill">PRO BUILDER</span>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
              title="Reset config to default state"
            >
              <RefreshCw size={16} />
              Reset Config
            </button>
            <button
              type="button"
              className="save-header-btn"
              onClick={handleSave}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience Layout */}
      <main className="main-layout">
        <div className="layout-columns">
          {/* Left Column: The Steps Accordion */}
          <section className="column-builder">
            <div className="builder-header">
              <span className="eyebrow">Assembling your security shield</span>
              <h1 className="main-title">Build your custom system</h1>
              <p className="subtitle">
                Configure cameras, monitoring plans, and adjust sensors. Save or checkout when you're ready.
              </p>
            </div>

            <Builder
              productsData={productsData}
              quantities={quantities}
              activeVariants={activeVariants}
              selectedPlan={selectedPlan}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              onVariantChange={handleVariantChange}
              onQuantityChange={handleQuantityChange}
              onPlanChange={handlePlanChange}
            />
          </section>

          {/* Right Column: Your Security System Review Panel */}
          <ReviewPanel
            productsData={productsData}
            quantities={quantities}
            selectedPlan={selectedPlan}
            onQuantityChange={handleQuantityChange}
            onSave={handleSave}
            onCheckout={handleCheckout}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Shield Secure Systems. All rights reserved. Prototypes built with modern precision.</p>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle size={18} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
