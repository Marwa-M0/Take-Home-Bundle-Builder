import React from "react";
import { ChevronDown, ChevronUp, Camera, Shield, Settings, AlertTriangle, HelpCircle } from "lucide-react";
import ProductCard from "./ProductCard";

export default function Builder({
  productsData,
  quantities,
  activeVariants,
  selectedPlan,
  activeStep,
  setActiveStep,
  onVariantChange,
  onQuantityChange,
  onPlanChange
}) {
  const steps = [
    { id: 1, title: "Choose your cameras", icon: Camera },
    { id: 2, title: "Choose your plan", icon: Shield },
    { id: 3, title: "Choose your sensors", icon: Settings },
    { id: 4, title: "Add extra protection", icon: AlertTriangle }
  ];

  // Helper to calculate distinct products selected in each step
  const getSelectedCount = (stepId) => {
    if (stepId === 1) {
      // Step 1: Cameras (outdoor_camera, indoor_camera, video_doorbell)
      let count = 0;
      productsData.cameras.forEach(product => {
        const hasQty = Object.keys(quantities).some(key => key.startsWith(product.id) && quantities[key] > 0);
        if (hasQty) count++;
      });
      return count;
    }
    if (stepId === 2) {
      // Step 2: Plan
      return selectedPlan && selectedPlan !== "self_monitoring" ? 1 : 0;
    }
    if (stepId === 3) {
      // Step 3: Sensors (entry_sensor, motion_sensor)
      let count = 0;
      productsData.sensors.forEach(product => {
        const qtyKey = `${product.id}_default`;
        if (quantities[qtyKey] > 0) count++;
      });
      return count;
    }
    if (stepId === 4) {
      // Step 4: Accessories (keychain_remote)
      let count = 0;
      productsData.accessories.forEach(product => {
        const qtyKey = `${product.id}_default`;
        if (quantities[qtyKey] > 0) count++;
      });
      return count;
    }
    return 0;
  };

  const handleStepClick = (stepId) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  return (
    <div className="builder-accordion">
      {steps.map((step) => {
        const StepIcon = step.icon;
        const isOpen = activeStep === step.id;
        const selectedCount = getSelectedCount(step.id);
        const nextStep = steps.find(s => s.id === step.id + 1);

        return (
          <div
            key={step.id}
            className={`accordion-step ${isOpen ? "open" : "collapsed"}`}
            id={`accordion-step-${step.id}`}
          >
            {/* Step Header */}
            <button
              type="button"
              className="accordion-header"
              onClick={() => handleStepClick(step.id)}
              aria-expanded={isOpen}
              aria-controls={`step-content-${step.id}`}
            >
              <div className="header-left">
                <span className="step-headline">STEP {step.id} OF 4</span>
                <div className="title-row">
                  <StepIcon size={20} className="step-icon" />
                  <h2 className="step-title">{step.title}</h2>
                </div>
              </div>

              <div className="header-right">
                {selectedCount > 0 && (
                  <span className="selected-indicator">
                    {selectedCount} selected
                  </span>
                )}
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {/* Step Content */}
            <div
              id={`step-content-${step.id}`}
              className="accordion-content-wrapper"
              style={{ display: isOpen ? "block" : "none" }}
            >
              <div className="accordion-content">
                {/* STEP 1: CAMERAS */}
                {step.id === 1 && (
                  <div className="camera-grid">
                    {productsData.cameras.map((camera) => (
                      <ProductCard
                        key={camera.id}
                        product={camera}
                        quantities={quantities}
                        activeVariants={activeVariants}
                        onVariantChange={onVariantChange}
                        onQuantityChange={onQuantityChange}
                      />
                    ))}
                  </div>
                )}

                {/* STEP 2: PLANS */}
                {step.id === 2 && (
                  <div className="plans-container">
                    <p className="step-description">
                      Choose professional monitoring for instant security dispatch and video verification.
                    </p>
                    <div className="plans-grid">
                      {productsData.plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`plan-card ${selectedPlan === plan.id ? "active" : ""}`}
                          onClick={() => onPlanChange(plan.id)}
                        >
                          <div className="plan-header">
                            <h3 className="plan-title">{plan.title}</h3>
                            <div className="plan-price-wrapper">
                              <span className="plan-price">${plan.price.toFixed(2)}</span>
                              <span className="plan-billing">{plan.billing}</span>
                            </div>
                          </div>
                          <p className="plan-desc">{plan.description}</p>
                          <ul className="plan-features">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="plan-feature-item">
                                <span className="check-bullet">✓</span> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: SENSORS (NO ADD-CONTROL IN BUILDER SIDE) */}
                {step.id === 3 && (
                  <div className="included-notice-box">
                    <p className="step-description">
                      Your pre-configured system includes the following essential sensors to cover your doors, windows, and main rooms.
                    </p>
                    <div className="included-items-list">
                      {productsData.sensors.map((sensor) => {
                        const qtyKey = `${sensor.id}_default`;
                        const currentQty = quantities[qtyKey] || 0;
                        return (
                          <div key={sensor.id} className="included-item-row">
                            <div className="included-item-info">
                              <div className="included-dot" />
                              <div>
                                <h4 className="included-item-title">{sensor.title}</h4>
                                <p className="included-item-desc">{sensor.description}</p>
                              </div>
                            </div>
                            <div className="included-item-qty">
                              Quantity: <strong className="qty-highlight">{currentQty}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="review-action-tip">
                      <HelpCircle size={16} className="tip-icon" />
                      <span>Need to adjust sensor quantities? You can edit them directly in the <strong>Your Security System</strong> panel on the right.</span>
                    </div>
                  </div>
                )}

                {/* STEP 4: PROTECTION ACCESSORIES (NO ADD-CONTROL IN BUILDER SIDE) */}
                {step.id === 4 && (
                  <div className="included-notice-box">
                    <p className="step-description">
                      Add extra protection accessories to arm, disarm, or sound loud alarms.
                    </p>
                    <div className="included-items-list">
                      {productsData.accessories.map((accessory) => {
                        const qtyKey = `${accessory.id}_default`;
                        const currentQty = quantities[qtyKey] || 0;
                        return (
                          <div key={accessory.id} className="included-item-row">
                            <div className="included-item-info">
                              <div className="included-dot" />
                              <div>
                                <h4 className="included-item-title">{accessory.title}</h4>
                                <p className="included-item-desc">{accessory.description}</p>
                              </div>
                            </div>
                            <div className="included-item-qty">
                              Quantity: <strong className="qty-highlight">{currentQty}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="review-action-tip">
                      <HelpCircle size={16} className="tip-icon" />
                      <span>Need to add or adjust accessories? Edit them in the <strong>Your Security System</strong> panel on the right.</span>
                    </div>
                  </div>
                )}

                {/* Navigation Button */}
                {nextStep ? (
                  <div className="step-navigation">
                    <button
                      type="button"
                      className="next-step-btn"
                      onClick={() => setActiveStep(nextStep.id)}
                    >
                      Next: {nextStep.title}
                    </button>
                  </div>
                ) : (
                  <div className="step-navigation">
                    <button
                      type="button"
                      className="next-step-btn checkout-scroll-btn"
                      onClick={() => {
                        // Scroll review panel into view on mobile
                        const panel = document.getElementById("review-panel");
                        if (panel) {
                          panel.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      Review Your System
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
