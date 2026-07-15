import ProductCard from "./ProductCard";
import { qtyKey } from "../utils";

const Triangle = ({ up }) => (
  <svg
    className="step-chevron"
    width="10"
    height="6"
    viewBox="0 0 10 6"
    aria-hidden="true"
    style={{ transform: up ? "rotate(180deg)" : "none" }}
  >
    <path d="M0 0h10L5 6z" fill="currentColor" />
  </svg>
);

export default function Builder({
  data,
  quantities,
  activeVariants,
  selectedPlan,
  activeStep,
  setActiveStep,
  onVariantChange,
  onQuantityChange,
  onPlanChange,
}) {
  const { steps, products, plans } = data;

  const productsFor = (category) => products.filter((p) => p.category === category);

  const selectedCount = (step) => {
    if (step.type === "plans") return selectedPlan ? 1 : 0;
    return productsFor(step.category).filter((p) => {
      if (p.variants) {
        return p.variants.some((v) => (quantities[qtyKey(p.id, v.id)] || 0) > 0);
      }
      return (quantities[qtyKey(p.id)] || 0) > 0;
    }).length;
  };

  const toggleStep = (stepId) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  return (
    <section className="builder" aria-label="Build your system">
      {steps.map((step, index) => {
        const isOpen = activeStep === step.id;
        const count = selectedCount(step);
        const nextStep = steps[index + 1];

        return (
          <div key={step.id} className={`step ${isOpen ? "step--open" : ""}`}>
            <p className="step-label">STEP {index + 1} OF {steps.length}</p>

            <button
              type="button"
              className="step-header"
              onClick={() => toggleStep(step.id)}
              aria-expanded={isOpen}
              aria-controls={`step-panel-${step.id}`}
            >
              <img className="step-icon" src={step.icon} alt="" />
              <span className="step-title">{step.title}</span>
              <span className={`step-state ${count > 0 ? "" : "step-state--empty"}`}>
                {count > 0 && <span className="step-count">{count} selected</span>}
                <Triangle up={isOpen} />
              </span>
            </button>

            {isOpen && (
              <div id={`step-panel-${step.id}`} className="step-body">
                {step.type === "products" && (
                  <div className="cards-grid">
                    {productsFor(step.category).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantities={quantities}
                        activeVariants={activeVariants}
                        onVariantChange={onVariantChange}
                        onQuantityChange={onQuantityChange}
                      />
                    ))}
                  </div>
                )}

                {step.type === "plans" && (
                  <div className="plans-grid" role="radiogroup" aria-label="Monitoring plans">
                    {plans.map((plan) => {
                      const isActive = selectedPlan === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          className={`plan-card ${isActive ? "plan-card--active" : ""}`}
                          onClick={() => onPlanChange(plan.id)}
                        >
                          <span className="plan-name">
                            {plan.logo && <img className="plan-logo" src={plan.logo} alt="" />}
                            {plan.titlePrefix}
                            {plan.titleAccent && (
                              <em className="plan-name-accent"> {plan.titleAccent}</em>
                            )}
                          </span>
                          <span className="plan-desc">{plan.description}</span>
                          <span className="plan-price">
                            {plan.comparePrice != null && (
                              <s className="price-compare">${plan.comparePrice.toFixed(2)}/mo</s>
                            )}
                            <strong className="price-active">
                              {plan.price > 0 ? `$${plan.price.toFixed(2)}/mo` : "Free"}
                            </strong>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {nextStep && (
                  <div className="step-next-wrap">
                    <button
                      type="button"
                      className="step-next-btn"
                      onClick={() => setActiveStep(nextStep.id)}
                    >
                      Next: {nextStep.title}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
