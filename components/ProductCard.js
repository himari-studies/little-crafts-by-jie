import ProductPhoto from "./ProductPhoto";
import Washi from "./Washi";
import { font, shadow, color } from "@/lib/ui";
import { LINKS } from "@/lib/links";

const TILTS = [-2, 1.5, -1, 2, -1.5, 1, -2, 1.2, -0.8];

// Full shop product card: a taped polaroid with a category tag, optional
// sold-out stamp, name + price and a "request / commission" CTA to the form.
// Clicking the card (anywhere but the CTA) opens the detail pop-out.
export default function ProductCard({ product, index = 0, onOpen }) {
  const tilt = TILTS[index % TILTS.length];
  const cta = product.soldOut ? "ask about this" : "request / commission";

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.();
        }
      }}
      style={{
        position: "relative",
        background: "#fff",
        padding: "14px 14px 18px",
        boxShadow: shadow.card,
        transform: `rotate(${tilt}deg)`,
        cursor: "pointer",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          left: 24,
          width: 72,
          height: 22,
          background:
            "repeating-linear-gradient(45deg,rgba(199,138,114,0.55) 0 7px,rgba(199,138,114,0.3) 7px 14px)",
          transform: "rotate(-6deg)",
        }}
      />

      <ProductPhoto
        photo={product.photo}
        soldOut={product.soldOut}
        height={210}
      >
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "var(--accent)",
            color: "#fff",
            fontFamily: font.display,
            fontWeight: 600,
            fontSize: 12,
            padding: "4px 11px",
            borderRadius: 4,
            transform: "rotate(4deg)",
            boxShadow: shadow.badge,
          }}
        >
          {product.category}
        </span>
        {product.soldOut && (
          <span
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              background: "#fff",
              color: color.soldOut,
              fontFamily: font.display,
              fontWeight: 600,
              fontSize: 12,
              padding: "4px 11px",
              borderRadius: 4,
              transform: "rotate(-3deg)",
              boxShadow: "1px 1px 0 rgba(74,59,46,0.18)",
            }}
          >
            sold out
          </span>
        )}
      </ProductPhoto>

      <div style={{ padding: "16px 6px 4px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: 19,
              color: color.heading,
            }}
          >
            {product.name}
          </span>
          <span
            style={{
              fontFamily: font.hand,
              fontWeight: 700,
              fontSize: 24,
              color: "var(--accent-deep)",
              whiteSpace: "nowrap",
            }}
          >
            {product.priceLabel}
          </span>
        </div>
        {product.size && (
          <div
            style={{
              marginTop: 6,
              fontFamily: font.body,
              fontSize: 13,
              color: color.faint,
            }}
          >
            size · {product.size}
          </div>
        )}
        <a
          className="nudge"
          href={product.soldOut ? LINKS.commissionForm : LINKS.paymentForm}
          target="_blank"
          rel="noopener"
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: 14,
            textAlign: "center",
            background: "var(--accent)",
            color: "#fff",
            padding: "11px 18px",
            borderRadius: 5,
            fontFamily: font.display,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
            display: "block",
            boxShadow: shadow.badge,
            outline: "1.5px dashed rgba(255,255,255,0.7)",
            outlineOffset: -5,
          }}
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
