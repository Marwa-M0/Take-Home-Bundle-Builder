import React from "react";
import { Plus, Minus, ShieldCheck, Truck, CreditCard } from "lucide-react";

// Helper mini thumbnail SVGs for the cart list
const MiniThumbnail = ({ type, variant }) => {
  const isDark = variant === "charcoal";
  const primaryColor = isDark ? "#4B5563" : "#F3F4F6";
  const accentColor = isDark ? "#1F2937" : "#E5E7EB";

  if (type === "outdoor_camera") {
    return (
      <svg className="w-10 h-10 border border-gray-200 rounded bg-gray-50 p-1" viewBox="0 0 40 40">
        <rect x="18" y="10" width="16" height="12" rx="4" fill={primaryColor} stroke="#9CA3AF" strokeWidth="0.5" />
        <rect x="16" y="8" width="6" height="16" rx="2" fill={accentColor} />
        <circle cx="30" cy="16" r="3" fill="#111827" />
        <circle cx="30" cy="16" r="1" fill="#3B82F6" />
      </svg>
    );
  }
  if (type === "indoor_camera") {
    return (
      <svg className="w-10 h-10 border border-gray-200 rounded bg-gray-50 p-1" viewBox="0 0 40 40">
        <circle cx="20" cy="28" r="8" fill={accentColor} />
        <circle cx="20" cy="16" r="10" fill={primaryColor} stroke="#9CA3AF" strokeWidth="0.5" />
        <circle cx="20" cy="16" r="6" fill="#111827" />
        <circle cx="20" cy="16" r="1.5" fill="#10B981" />
      </svg>
    );
  }
  if (type === "video_doorbell") {
    return (
      <svg className="w-10 h-10 border border-gray-200 rounded bg-gray-50 p-1" viewBox="0 0 40 40">
        <rect x="13" y="6" width="14" height="28" rx="3" fill="#1E293B" />
        <circle cx="20" cy="12" r="3" fill="#020617" />
        <circle cx="20" cy="26" r="5" fill="none" stroke="#60A5FA" strokeWidth="1" />
        <circle cx="20" cy="26" r="1.5" fill="#93C5FD" />
      </svg>
    );
  }
  if (type === "entry_sensor") {
    return (
      <svg className="w-10 h-10 border border-gray-200 rounded bg-gray-50 p-1" viewBox="0 0 40 40">
        <rect x="12" y="8" width="10" height="24" rx="2" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="0.5" />
        <rect x="24" y="10" width="4" height="20" rx="1" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.5" />
      </svg>
    );
  }
  if (type === "motion_sensor") {
    return (
      <svg className="w-10 h-10 border border-gray-200 rounded bg-gray-50 p-1" viewBox="0 0 40 40">
        <rect x="12" y="8" width="16" height="24" rx="4" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="0.5" />
        <rect x="15" y="11" width="10" height="6" rx="1" fill="#E5E7EB" />
        <circle cx="20" cy="22" r="1.5" fill="#3B82F6" />
      </svg>
    );
  }
  if (type === "keychain_remote") {
    return (
      <svg className="w-10 h-10 border border-gray-200 rounded bg-gray-50 p-1" viewBox="0 0 40 40">
        <rect x="14" y="6" width="12" height="28" rx="6" fill="#374151" stroke="#1F2937" strokeWidth="0.5" />
        <circle cx="20" cy="12" r="2" fill="#9CA3AF" />
        <circle cx="20" cy="18" r="2" fill="#E5E7EB" />
        <circle cx="20" cy="24" r="2" fill="#EF4444" />
      </svg>
    );
  }
  return (
    <svg className="w-10 h-10 border border-gray-200 rounded bg-gray-50 p-1" viewBox="0 0 40 40">
      <rect x="10" y="10" width="20" height="20" rx="2" fill="#E5E7EB" />
    </svg>
  );
};

export default function ReviewPanel({
  productsData,
  quantities,
  selectedPlan,
  onQuantityChange,
  onSave,
  onCheckout
}) {
  // Helper to compile cart items grouped by category
  const getCartGroups = () => {
    const groups = {
      cameras: [],
      sensors: [],
      accessories: [],
      plan: []
    };

    // Helper to add matching quantities
    const findQtyItems = (list, type) => {
      list.forEach(prod => {
        if (prod.variants) {
          prod.variants.forEach(v => {
            const key = `${prod.id}_${v.id}`;
            const qty = quantities[key] || 0;
            if (qty > 0) {
              groups[type].push({
                cartKey: key,
                id: prod.id,
                title: `${prod.title} (${v.name})`,
                basePrice: prod.basePrice,
                comparePrice: prod.comparePrice,
                variantId: v.id,
                quantity: qty
              });
            }
          });
        } else {
          const key = `${prod.id}_default`;
          const qty = quantities[key] || 0;
          if (qty > 0) {
            groups[type].push({
              cartKey: key,
              id: prod.id,
              title: prod.title,
              basePrice: prod.basePrice,
              comparePrice: prod.comparePrice || null,
              variantId: "default",
              quantity: qty
            });
          }
        }
      });
    };

    findQtyItems(productsData.cameras, "cameras");
    findQtyItems(productsData.sensors, "sensors");
    findQtyItems(productsData.accessories, "accessories");

    // Add selected plan
    const plan = productsData.plans.find(p => p.id === selectedPlan);
    if (plan) {
      groups.plan.push({
        id: plan.id,
        title: plan.title,
        basePrice: plan.price,
        comparePrice: null,
        billing: plan.billing,
        quantity: 1
      });
    }

    return groups;
  };

  const groups = getCartGroups();

  // Price calculations
  let subtotalFull = 0;   // pre-discount total (compare-at or regular if no compare)
  let subtotalActive = 0; // discounted total today
  let planTotalMonthly = 0;

  // Add cameras, sensors, and accessories to totals
  const allOneTimeItems = [...groups.cameras, ...groups.sensors, ...groups.accessories];
  allOneTimeItems.forEach(item => {
    const comp = item.comparePrice || item.basePrice;
    subtotalFull += comp * item.quantity;
    subtotalActive += item.basePrice * item.quantity;
  });

  // Calculate plan monthly total
  if (groups.plan.length > 0) {
    planTotalMonthly = groups.plan[0].basePrice;
  }

  const totalSavings = subtotalFull - subtotalActive;
  const isPlanPaid = planTotalMonthly > 0;

  // Estimate monthly financing (e.g., total / 12 months)
  const monthlyFinancing = (subtotalActive / 12).toFixed(2);

  const hasItems = allOneTimeItems.length > 0 || isPlanPaid;

  return (
    <aside className="review-panel" id="review-panel">
      <div className="panel-header">
        <h2 className="panel-title">Your security system</h2>
      </div>

      {!hasItems ? (
        <div className="empty-state">
          <p>Your configuration is empty. Choose some cameras or plans to get started!</p>
        </div>
      ) : (
        <div className="panel-scroll-content">
          {/* Cart Item Groups */}
          {Object.entries(groups).map(([groupName, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={groupName} className="panel-category-section">
                <h3 className="category-subheading">
                  {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
                </h3>

                <div className="category-items-list">
                  {items.map((item) => (
                    <div key={item.cartKey || item.id} className="cart-line-item">
                      <div className="line-item-left">
                        {groupName !== "plan" && (
                          <MiniThumbnail type={item.id} variant={item.variantId} />
                        )}
                        <div className="line-item-details">
                          <h4 className="line-item-title">{item.title}</h4>
                          <span className="line-item-unit-price">
                            ${item.basePrice.toFixed(2)}
                            {item.billing && <span className="billing-suffix">{item.billing}</span>}
                          </span>
                        </div>
                      </div>

                      {groupName !== "plan" ? (
                        <div className="line-item-actions">
                          <div className="mini-stepper">
                            <button
                              type="button"
                              className="mini-stepper-btn"
                              onClick={() => onQuantityChange(item.cartKey, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="mini-stepper-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="mini-stepper-btn"
                              onClick={() => onQuantityChange(item.cartKey, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="line-item-total-price">
                            ${(item.basePrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="line-item-total-price font-medium text-slate-800">
                          ${item.basePrice.toFixed(2)}/mo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <hr className="panel-divider" />

          {/* Pricing Details */}
          <div className="panel-summary-rows">
            {/* Shipping */}
            <div className="summary-row">
              <span className="summary-label flex items-center gap-1.5 text-slate-500">
                <Truck size={16} /> Shipping
              </span>
              <span className="summary-value flex items-center gap-1.5">
                <span className="compare-shipping struck-price">$15.00</span>
                <span className="free-shipping-tag font-semibold text-emerald-600">FREE</span>
              </span>
            </div>

            {/* Subtotal */}
            <div className="summary-row">
              <span className="summary-label text-slate-500">Equipment Subtotal</span>
              <span className="summary-value text-slate-800 font-medium">
                ${subtotalActive.toFixed(2)}
              </span>
            </div>

            {/* Plan Fee */}
            {isPlanPaid && (
              <div className="summary-row">
                <span className="summary-label text-slate-500">Monthly Plan Fee</span>
                <span className="summary-value text-slate-800 font-medium">
                  ${planTotalMonthly.toFixed(2)}/mo
                </span>
              </div>
            )}

            {/* Total Row */}
            <div className="summary-row total-row">
              <span className="total-label text-slate-900 font-bold">Total Today</span>
              <div className="total-pricing-stack">
                <div className="flex items-center justify-end gap-2">
                  {totalSavings > 0 && (
                    <span className="compare-total struck-price text-slate-400 font-normal">
                      ${subtotalFull.toFixed(2)}
                    </span>
                  )}
                  <span className="active-total text-slate-900 font-extrabold text-lg">
                    ${subtotalActive.toFixed(2)}
                  </span>
                </div>
                {isPlanPaid && (
                  <span className="plan-recurring-note text-xs text-slate-500 block text-right mt-0.5">
                    + ${planTotalMonthly.toFixed(2)}/mo plan billing
                  </span>
                )}
              </div>
            </div>

            {/* Savings Callout */}
            {totalSavings > 0 && (
              <div className="savings-callout-box">
                You are saving <strong className="text-coral-500">${totalSavings.toFixed(2)}</strong> on your security equipment!
              </div>
            )}
          </div>

          {/* Satisfaction Guarantee Badge */}
          <div className="satisfaction-badge-row">
            <ShieldCheck className="satisfaction-icon text-emerald-600" size={20} />
            <div className="satisfaction-text">
              <strong>60-day Risk-free Trial</strong>
              <p>100% money-back guarantee. Free return shipping.</p>
            </div>
          </div>

          {/* Financing option */}
          {subtotalActive > 0 && (
            <div className="financing-row">
              <CreditCard size={16} className="text-slate-500" />
              <span>Or pay as low as <strong>${monthlyFinancing}/mo</strong> at 0% APR.</span>
            </div>
          )}

          {/* Checkout & Save Actions */}
          <div className="panel-actions">
            <button
              type="button"
              className="checkout-btn"
              onClick={onCheckout}
            >
              Checkout
            </button>

            <button
              type="button"
              className="save-later-link"
              onClick={onSave}
            >
              Save my system for later
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
