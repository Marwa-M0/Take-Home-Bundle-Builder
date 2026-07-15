export default function Stepper({ value, onDecrement, onIncrement, disabled, productName, size }) {
  return (
    <span className={`stepper ${size === "sm" ? "stepper--sm" : ""}`}>
      <button
        type="button"
        className="stepper-btn"
        disabled={disabled || value === 0}
        onClick={onDecrement}
        aria-label={`Decrease ${productName} quantity`}
      >
        −
      </button>
      <span className="stepper-value" aria-live="polite">{value}</span>
      <button
        type="button"
        className="stepper-btn"
        disabled={disabled}
        onClick={onIncrement}
        aria-label={`Increase ${productName} quantity`}
      >
        +
      </button>
    </span>
  );
}
