import React, { useEffect, useState } from "react";
import axios from "axios";

const DURATION = 4000;

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [cur, setCur] = useState(0);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    axios.get("/JSON/Banner.json").then((res) => {
      setSlides(res.data);
    });
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const start = Date.now();

    const progTimer = setInterval(() => {
      setProg(Math.min(100, ((Date.now() - start) / DURATION) * 100));
    }, 50);

    const slideTimer = setInterval(() => {
      setCur((p) => (p + 1) % slides.length);
      setProg(0);
    }, DURATION);

    return () => {
      clearInterval(progTimer);
      clearInterval(slideTimer);
    };
  }, [cur, slides]);

  if (!slides.length) return null;

  const s = slides[cur];

  return (
    <div className="w-full overflow-hidden">

      {/* SLIDER */}
      <div
        className="relative h-[380px] md:h-[450px] flex"
        style={{ background: s.bg }}
      >

        {/* LEFT (TEXT 50%) */}
        <div className="w-1/2 flex flex-col justify-center px-8 md:px-14 z-10">
          
          <span className="text-white text-xs font-semibold tracking-wide bg-[#F97316] px-3 py-1 rounded-full w-fit mb-3">
            {s.badge}
          </span>

          <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight whitespace-pre-line">
            {s.title}
          </h2>

          <p className="text-white/80 text-sm md:text-base mt-3 leading-relaxed max-w-md whitespace-pre-line">
            {s.sub}
          </p>

          <button
            className="mt-5 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-md hover:opacity-90 transition"
            style={{ background: s.ctaBg }}
          >
            {s.ctaLabel}
          </button>
        </div>

        {/* RIGHT (IMAGE 50%) */}
        <div className="w-1/2 h-full relative">
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
          />

          {/* Optional overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* ARROWS */}
        <button
          onClick={() => setCur((cur - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white backdrop-blur flex items-center justify-center hover:bg-white/30"
        >
          ‹
        </button>

        <button
          onClick={() => setCur((cur + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white backdrop-blur flex items-center justify-center hover:bg-white/30"
        >
          ›
        </button>

        {/* DOTS */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === cur ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="h-1" style={{ background: s.bg }}>
        <div
          className="h-full bg-[#F97316]"
          style={{ width: `${prog}%` }}
        />
      </div>
    </div>
  );
};

export default Banner;