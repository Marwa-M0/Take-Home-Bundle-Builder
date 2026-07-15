import Stepper from "./Stepper";
import { qtyKey } from "../utils";

export default function ProductCard({
  product,
  quantities,
  activeVariants,
  onVariantChange,
  onQuantityChange,
}) {
  const { id, title, description, image, price, comparePrice, badge, variants, required } = product;

  const activeVariantId = variants ? activeVariants[id] || variants[0].id : undefined;
  const quantity = quantities[qtyKey(id, activeVariantId)] || 0;

  const isSelected = variants
    ? variants.some((v) => (quantities[qtyKey(id, v.id)] || 0) > 0)
    : quantity > 0;

  return (
    <article className={`product-card ${isSelected ? "product-card--selected" : ""}`}>
      {badge && <span className="badge">{badge}</span>}

      <div className="product-media">
        <img src={image} alt={title} />
      </div>

      <div className="product-body">
        <h3 className="product-title">
          {title}
          {required && <span className="product-required"> (Required)</span>}
        </h3>
        <p className="product-desc">
          {description} <a className="learn-more" href="#">Learn More</a>
        </p>

        {variants && (
          <div className="chips" role="group" aria-label={`${title} color`}>
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`chip ${v.id === activeVariantId ? "chip--active" : ""}`}
                aria-pressed={v.id === activeVariantId}
                onClick={() => onVariantChange(id, v.id)}
              >
                <img className="chip-thumb" src={product.thumb || image} alt="" />
                {v.name}
              </button>
            ))}
          </div>
        )}

        <div className="product-footer">
          <Stepper
            value={quantity}
            disabled={required}
            productName={title}
            onDecrement={() => onQuantityChange(id, activeVariantId, -1)}
            onIncrement={() => onQuantityChange(id, activeVariantId, 1)}
          />
          <span className="product-price">
            {comparePrice != null && (
              <s className="price-compare price-compare--red">${comparePrice.toFixed(2)}</s>
            )}
            <strong className="price-current">
              {price > 0 ? `$${price.toFixed(2)}` : "FREE"}
            </strong>
          </span>
        </div>
      </div>
    </article>
  );
}
