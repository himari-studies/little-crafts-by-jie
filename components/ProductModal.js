"use client";

import { useEffect } from "react";
import { font, shadow, color } from "@/lib/ui";
import { LINKS } from "@/lib/links";
import ProductPhoto from "./ProductPhoto";

// A pop-out detail card shown when a product is tapped. Renders a larger photo,
// the category tag, name + price, size, a friendly description and the same
// request/commission CTA. Closes on backdrop click, the × button, or Escape.
export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    if (!product) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const cta = product.soldOut ? "ask about this" : "request / commission";
  const description =
    product.description ||
    "a handmade little make, hooked up with a lot of love. message me and i'll sort the details with you ♥";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(74,59,46,0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          transform: "rotate(-0.6deg)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -12,
            left: 36,
            zIndex: 2,
            width: 96,
            height: 26,
            background:
              "repeating-linear-gradient(45deg,rgba(199,138,114,0.55) 0 7px,rgba(199,138,114,0.3) 7px 14px)",
            transform: "rotate(-5deg)",
          }}
        />

        <button
          onClick={onClose}
          aria-label="close"
          className="nudge"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 3,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "#fff",
            color: color.body,
            fontFamily: font.display,
            fontSize: 21,
            lineHeight: 1,
            cursor: "pointer",
            boxShadow: shadow.badge,
          }}
        >
          ×
        </button>

        <div
          style={{
            background: "#fff",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "18px 18px 26px",
            boxShadow: shadow.card,
          }}
        >
          <ProductPhoto
            photo={product.photo}
            soldOut={product.soldOut}
            height={400}
            fit="contain"
            background="#FBF6E9"
          >
            <span
              style={{
                position: "absolute",
                top: 12,
                right: 12,
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
                  bottom: 12,
                  left: 12,
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

          <div style={{ padding: "22px 6px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: font.display,
                  fontWeight: 700,
                  fontSize: 26,
                  color: color.heading,
                }}
              >
                {product.name}
              </span>
              <span
                style={{
                  fontFamily: font.hand,
                  fontWeight: 700,
                  fontSize: 32,
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
                  marginTop: 8,
                  fontFamily: font.body,
                  fontSize: 14,
                  color: color.faint,
                }}
              >
                size · {product.size}
              </div>
            )}

            <p
              style={{
                marginTop: 14,
                fontFamily: font.body,
                fontSize: 16,
                lineHeight: 1.65,
                color: color.body,
              }}
            >
              {description}
            </p>

            <a
              className="nudge"
              href={product.soldOut ? LINKS.commissionForm : LINKS.paymentForm}
              target="_blank"
              rel="noopener"
              style={{
                marginTop: 18,
                textAlign: "center",
                background: "var(--accent)",
                color: "#fff",
                padding: "13px 18px",
                borderRadius: 5,
                fontFamily: font.display,
                fontWeight: 600,
                fontSize: 16,
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
      </div>
    </div>
  );
}
