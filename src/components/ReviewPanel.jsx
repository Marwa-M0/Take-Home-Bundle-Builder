import Stepper from "./Stepper";
import { qtyKey } from "../utils";

export default function ReviewPanel({
  data,
  quantities,
  selectedPlan,
  onQuantityChange,
  onSave,
  onCheckout,
}) {
  const { products, plans, categories, shipping, financingMonths } = data;

  // One line per variant (or per product when no variants) with quantity > 0.
  const lineItems = products.flatMap((p) => {
    const variants = p.variants || [{ id: undefined, name: null }];
    return variants
      .map((v) => ({
        product: p,
        variantId: v.id,
        variantName: v.name,
        quantity: quantities[qtyKey(p.id, v.id)] || 0,
      }))
      .filter((line) => line.quantity > 0);
  });

  const plan = plans.find((p) => p.id === selectedPlan);

  let activeTotal = 0;
  let compareTotal = 0;
  lineItems.forEach(({ product, quantity }) => {
    activeTotal += product.price * quantity;
    compareTotal += (product.comparePrice ?? product.price) * quantity;
  });
  if (plan) {
    activeTotal += plan.price;
    compareTotal += plan.comparePrice ?? plan.price;
  }
  const savings = compareTotal - activeTotal;
  const financing = activeTotal / financingMonths;

  const money = (n) => `$${n.toFixed(2)}`;

  return (
    <aside className="review" aria-label="Your security system">
      <p className="review-eyebrow">REVIEW</p>
      <h2 className="review-title">Your security system</h2>
      <p className="review-subtitle">
        Review your personalized protection system designed to keep what matters most safe.
      </p>
      <hr className="review-rule" />

      {categories.map((cat) => {
        const lines = lineItems.filter((l) => l.product.category === cat.id);
        if (lines.length === 0) return null;
        return (
          <section key={cat.id} className="review-group">
            <h3 className="review-group-label">{cat.label.toUpperCase()}</h3>
            {lines.map(({ product, variantId, variantName, quantity }) => (
              <div key={qtyKey(product.id, variantId)} className="review-line">
                <img
                  className="review-thumb"
                  src={product.thumb || product.image}
                  alt=""
                />
                <span className="review-line-name">
                  {product.title}
                  {product.required && " (Required)"}
                  {variantName && variantName !== "White" && (
                    <span className="review-line-variant"> — {variantName}</span>
                  )}
                </span>
                <Stepper
                  size="sm"
                  value={quantity}
                  disabled={product.required}
                  productName={product.title}
                  onDecrement={() => onQuantityChange(product.id, variantId, -1)}
                  onIncrement={() => onQuantityChange(product.id, variantId, 1)}
                />
                <span className="review-line-price">
                  {product.comparePrice != null && (
                    <s className="price-compare">{money(product.comparePrice * quantity)}</s>
                  )}
                  {product.price > 0 ? (
                    <strong className="price-active">{money(product.price * quantity)}</strong>
                  ) : (
                    <strong className="price-free">FREE</strong>
                  )}
                </span>
              </div>
            ))}
          </section>
        );
      })}

      {plan && (
        <section className="review-group">
          <h3 className="review-group-label">PLAN</h3>
          <div className="review-line review-line--plan">
            <span className="review-plan-name">
              {plan.logo && <img className="plan-logo" src={plan.logo} alt="" />}
              {plan.titlePrefix}
              {plan.titleAccent && <em className="plan-name-accent"> {plan.titleAccent}</em>}
            </span>
            <span className="review-line-price">
              {plan.comparePrice != null && (
                <s className="price-compare">{money(plan.comparePrice)}/mo</s>
              )}
              {plan.price > 0 ? (
                <strong className="price-active">{money(plan.price)}/mo</strong>
              ) : (
                <strong className="price-free">FREE</strong>
              )}
            </span>
          </div>
        </section>
      )}

      <hr className="review-rule" />

      <div className="review-line review-line--shipping">
        <img className="review-shipping-icon" src={shipping.icon} alt="" />
        <span className="review-line-name">{shipping.label}</span>
        <span className="review-line-price">
          <s className="price-compare">{money(shipping.comparePrice)}</s>
          <strong className="price-free">FREE</strong>
        </span>
      </div>

      <div className="review-total-row">
        <img className="review-starburst" src="/images/starburst.png" alt="100% Wyze satisfaction guarantee — try worry-free for 30 days" />
        <div className="review-total-stack">
          <span className="financing-pill">as low as {money(financing)}/mo</span>
          <span className="review-total">
            {savings > 0 && <s className="price-compare">{money(compareTotal)}</s>}
            <strong className="review-total-active">{money(activeTotal)}</strong>
          </span>
        </div>
      </div>

      {savings > 0 && (
        <p className="review-savings">
          Congrats! You&rsquo;re saving <strong>{money(savings)}</strong> on your security bundle!
        </p>
      )}

      <button type="button" className="checkout-btn" onClick={onCheckout}>
        Checkout
      </button>
      <button type="button" className="save-link" onClick={onSave}>
        Save my system for later
      </button>
    </aside>
  );
}
