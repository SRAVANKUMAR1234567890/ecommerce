import React, { useEffect, useState } from "react";
import "./FlyCart.css";

function FlyCart({ start, end, trigger }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setAnimating(true);

      const timer = setTimeout(() => {
        setAnimating(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!animating) return null;

  return (
    <div
      className="fly-item"
      style={{
        top: start.y,
        left: start.x,
        "--endX": `${end.x - start.x}px`,
        "--endY": `${end.y - start.y}px`,
      }}
    >
      🛒
    </div>
  );
}

export default FlyCart;