import { useEffect, useRef, useState } from "react";
import data from "./data/products.json";
import Builder from "./components/Builder";
import ReviewPanel from "./components/ReviewPanel";
import { qtyKey } from "./utils";

const STORAGE_KEY = "wyze_system_config_v1";

function buildSeedState() {
  const quantities = {};
  const activeVariants = {};
  data.products.forEach((p) => {
    if (p.variants) {
      p.variants.forEach((v) => {
        quantities[qtyKey(p.id, v.id)] = v.seedQty || 0;
      });
      activeVariants[p.id] = p.variants[0].id;
    } else {
      quantities[qtyKey(p.id)] = p.seedQty || 0;
    }
  });
  const seededPlan = data.plans.find((p) => p.seeded);
  return { quantities, activeVariants, selectedPlan: seededPlan ? seededPlan.id : null };
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.quantities) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function App() {
  const [state, setState] = useState(() => loadSavedState() || buildSeedState());
  const [activeStep, setActiveStep] = useState(data.steps[0].id);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  const changeQuantity = (productId, variantId, delta) => {
    setState((prev) => {
      const key = qtyKey(productId, variantId);
      const next = Math.max(0, (prev.quantities[key] || 0) + delta);
      return { ...prev, quantities: { ...prev.quantities, [key]: next } };
    });
  };

  const selectVariant = (productId, variantId) => {
    setState((prev) => ({
      ...prev,
      activeVariants: { ...prev.activeVariants, [productId]: variantId },
    }));
  };

  const selectPlan = (planId) => {
    setState((prev) => ({ ...prev, selectedPlan: planId }));
  };

  const saveSystem = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    showToast("Your system has been saved — it'll be here when you come back.");
  };

  const checkout = () => {
    showToast("Checkout is a placeholder in this prototype.");
  };

  return (
    <div className="page">
      <h1 className="page-heading">Let&rsquo;s get started!</h1>

      <div className="layout">
        <Builder
          data={data}
          quantities={state.quantities}
          activeVariants={state.activeVariants}
          selectedPlan={state.selectedPlan}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          onVariantChange={selectVariant}
          onQuantityChange={changeQuantity}
          onPlanChange={selectPlan}
        />

        <ReviewPanel
          data={data}
          quantities={state.quantities}
          selectedPlan={state.selectedPlan}
          onQuantityChange={changeQuantity}
          onSave={saveSystem}
          onCheckout={checkout}
        />
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
