import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Carousel.css";

import s from "./s5.jpg";
import s1 from "./s1.jpg";
import s2 from "./s2.jpg";
import s3 from "./s3.jpg";
import s4 from "./s4.jpg";

const slides = [
  {
    img: s,
    title: "MEN'S COLLECTION",
    subtitle: "From t-shirts, jeans, watches & more",
    btn: "SHOP NOW",
    link: "/gifting"
  },
  {
    img: s1,
    title: "MEN'S FASHION",
    subtitle: "Save up to 40% off",
    btn: "VIEW COLLECTION",
    link: "/brand"
  },
  {
    img: s2,
    title: "NEW ARRIVALS",
    subtitle: "Latest styles for you",
    btn: "EXPLORE",
    link: "/catalogue"
  },
  {
    img: s3,
    title: "TRENDING NOW",
    subtitle: "Upgrade your wardrobe",
    btn: "SHOP NOW",
    link: "/wedding"
  },
  {
    img: s4,
    title: "BEST SELLERS",
    subtitle: "Top picks for you",
    btn: "BUY NOW",
    link: "/corporate"
  }
];

function Carousel() {

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 60);

    return () => clearInterval(timer);
  }, [current]);

  return (
    <div className="carousel">

      {/* Image */}
      <img src={slides[current].img} alt="slide" />

      {/* 🔥 Animated Content */}
      <div key={current} className="content animate">

        <h4>NEW TRENDS FOR ALL</h4>
        <h1>{slides[current].title}</h1>
        <p>{slides[current].subtitle}</p>

        <button onClick={() => navigate(slides[current].link)}>
          {slides[current].btn}
        </button>

      </div>

      {/* ⭕ Circular Indicators */}
      <div className="dots">
        {slides.map((_, index) => (
          <div key={index} className="dot">
            <div
              className="fill"
              style={{
                background:
                  index === current
                    ? `conic-gradient(#00ff88 ${progress * 3.6}deg, transparent 0deg)`
                    : "transparent"
              }}
            ></div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Carousel;
