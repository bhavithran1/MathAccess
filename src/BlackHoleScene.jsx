import { useEffect, useRef } from "react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const TAU = Math.PI * 2;

function makeStar(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    z: 0.15 + Math.random() * 1.6,
    drift: 0.1 + Math.random() * 0.6,
    alpha: 0.08 + Math.random() * 0.82,
    hue: Math.random() > 0.85 ? 30 + Math.random() * 30 : 200 + Math.random() * 40,
    twinklePhase: Math.random() * TAU,
    twinkleSpeed: 0.3 + Math.random() * 1.2,
  };
}

function makeDiscParticle() {
  const r = 0.3 + Math.random() * 0.7;
  return {
    angle: Math.random() * TAU,
    radius: r,
    speed: 0.08 + (1 - r) * 0.55,
    size: 0.4 + Math.random() * 2.2,
    temp: Math.random(),
    orbital: 0.6 + Math.random() * 0.4,
  };
}

function makeNebulaBlob() {
  return {
    x: Math.random(),
    y: Math.random(),
    r: 0.08 + Math.random() * 0.18,
    hue: 220 + Math.random() * 60,
    alpha: 0.012 + Math.random() * 0.025,
    drift: 0.00002 + Math.random() * 0.00004,
    phase: Math.random() * TAU,
  };
}

export function BlackHoleScene({ route }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const S = {
      w: 0, h: 0, dpr: 1,
      stars: [],
      disc: [],
      nebulae: [],
      frame: 0,
      shift: route.length * 0.071,
    };

    const STAR_COUNT = 320;
    const DISC_COUNT = 400;
    const NEBULA_COUNT = 6;

    for (let i = 0; i < STAR_COUNT; i++) S.stars.push(makeStar(window.innerWidth || 1280, window.innerHeight || 720));
    for (let i = 0; i < DISC_COUNT; i++) S.disc.push(makeDiscParticle());
    for (let i = 0; i < NEBULA_COUNT; i++) S.nebulae.push(makeNebulaBlob());

    function resize() {
      S.dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      S.w = window.innerWidth || 1280;
      S.h = window.innerHeight || 720;
      canvas.width = Math.floor(S.w * S.dpr);
      canvas.height = Math.floor(S.h * S.dpr);
      canvas.style.width = `${S.w}px`;
      canvas.style.height = `${S.h}px`;
      ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
      S.stars = [];
      for (let i = 0; i < STAR_COUNT; i++) S.stars.push(makeStar(S.w, S.h));
    }

    function scroll() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return clamp(window.scrollY / max, 0, 1);
    }

    function drawNebulae(t) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const n of S.nebulae) {
        const x = (n.x + Math.sin(t * n.drift + n.phase) * 0.04) * S.w;
        const y = (n.y + Math.cos(t * n.drift * 0.7 + n.phase) * 0.03) * S.h;
        const r = n.r * Math.min(S.w, S.h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `hsla(${n.hue}, 60%, 25%, ${n.alpha * 1.5})`);
        g.addColorStop(0.5, `hsla(${n.hue}, 50%, 15%, ${n.alpha})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      ctx.restore();
    }

    function drawStars(t, sc) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const s of S.stars) {
        const pull = sc * 60 * s.z;
        const x = (s.x + Math.sin(t * 0.00006 * s.drift + s.z) * 12 + pull) % S.w;
        const y = (s.y + sc * 30 * s.drift) % S.h;
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.twinkleSpeed + s.twinklePhase);
        const a = s.alpha * (0.3 + twinkle * 0.7);
        const sz = (0.3 + s.z * 0.9) * (0.7 + twinkle * 0.3);

        if (s.z > 1.2) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, sz * 3);
          glow.addColorStop(0, `hsla(${s.hue}, 70%, 85%, ${a * 0.6})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(x - sz * 3, y - sz * 3, sz * 6, sz * 6);
        }

        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 60%, 88%, ${a})`;
        ctx.arc(x, y, sz, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawBlackHole(t, sc) {
      const min = Math.max(1, Math.min(S.w, S.h));
      const cx = S.w * (S.w < 760 ? 0.52 : 0.68);
      const cy = S.h * (0.30 + sc * 0.10);
      const evR = min * (0.055 + sc * 0.015);
      const diskR = min * (0.30 + sc * 0.05);
      const phase = reduced ? sc * 5 + S.shift : t * 0.00022 + sc * 3.5 + S.shift;

      // deep gravity well
      const well = ctx.createRadialGradient(cx, cy, evR * 0.3, cx, cy, diskR * 3);
      well.addColorStop(0, "rgba(0,0,0,0.99)");
      well.addColorStop(0.12, "rgba(0,0,0,0.97)");
      well.addColorStop(0.25, "rgba(2,4,12,0.88)");
      well.addColorStop(0.4, "rgba(8,15,35,0.5)");
      well.addColorStop(0.6, "rgba(15,8,30,0.2)");
      well.addColorStop(0.8, "rgba(10,4,20,0.06)");
      well.addColorStop(1, "transparent");
      ctx.fillStyle = well;
      ctx.fillRect(0, 0, S.w, S.h);

      ctx.save();
      ctx.translate(cx, cy);

      const tilt = -0.24 + Math.sin(phase * 0.4) * 0.015;
      ctx.rotate(tilt);
      ctx.globalCompositeOperation = "lighter";

      // -- accretion disk glow (broad warm wash) --
      for (let i = 0; i < 3; i++) {
        const spread = diskR * (1.2 + i * 0.4);
        const squeeze = 0.12 + i * 0.03;
        const a = 0.04 - i * 0.01;
        ctx.save();
        ctx.scale(1, squeeze);
        const dg = ctx.createRadialGradient(0, 0, diskR * 0.3, 0, 0, spread);
        dg.addColorStop(0, `rgba(255,160,40,${a})`);
        dg.addColorStop(0.4, `rgba(255,100,20,${a * 0.6})`);
        dg.addColorStop(0.7, `rgba(180,40,10,${a * 0.3})`);
        dg.addColorStop(1, "transparent");
        ctx.fillStyle = dg;
        ctx.fillRect(-spread, -spread, spread * 2, spread * 2);
        ctx.restore();
      }

      // -- accretion disk rings (Interstellar style) --
      const ringCount = 28;
      for (let i = 0; i < ringCount; i++) {
        const norm = i / (ringCount - 1);
        const rx = diskR * (0.55 + norm * 0.9);
        const ry = diskR * (0.06 + norm * 0.035);

        // Doppler shift: one side brighter
        const doppler = 0.6 + 0.4 * Math.sin(phase + norm * 0.8);
        const baseAlpha = (0.025 + (1 - Math.abs(norm - 0.4)) * 0.08) * doppler;

        // temperature gradient: inner rings hotter (white/blue), outer cooler (orange/red)
        let r, g, b;
        if (norm < 0.25) {
          r = 255; g = 240; b = 220;
        } else if (norm < 0.5) {
          r = 255; g = 180; b = 80;
        } else if (norm < 0.75) {
          r = 240; g = 120; b = 40;
        } else {
          r = 180; g = 60; b = 20;
        }

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, phase * 0.15 + norm * 0.4, 0, TAU);
        ctx.strokeStyle = `rgba(${r},${g},${b},${baseAlpha})`;
        ctx.lineWidth = 0.6 + (1 - norm) * 3.5;
        ctx.stroke();
      }

      // -- gravitational lensing ring (Einstein ring / photon ring) --
      for (let i = 0; i < 3; i++) {
        const lensR = evR * (1.6 + i * 0.25);
        const lensAlpha = 0.12 - i * 0.035;
        ctx.beginPath();
        ctx.arc(0, 0, lensR, 0, TAU);
        ctx.strokeStyle = `rgba(255,200,140,${lensAlpha})`;
        ctx.lineWidth = 1.5 - i * 0.4;
        ctx.stroke();
      }

      // -- lensed light arc above and below (bent disk visible over the hole) --
      for (let side = -1; side <= 1; side += 2) {
        ctx.save();
        ctx.scale(1, 0.08);
        const arcR = diskR * 0.75;
        const arcAlpha = 0.06;
        ctx.beginPath();
        ctx.ellipse(0, side * evR * 4, arcR, diskR * 0.4, phase * 0.1, 0, TAU);
        ctx.strokeStyle = `rgba(255,170,60,${arcAlpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // -- disc particles --
      for (const p of S.disc) {
        const swirl = phase * p.speed + p.angle + sc * 2;
        const r = diskR * p.radius;
        const px = Math.cos(swirl) * r * (1.5 + p.radius * 0.3);
        const py = Math.sin(swirl) * r * (0.08 + p.radius * 0.04) * p.orbital;

        const dopplerP = 0.5 + 0.5 * Math.cos(swirl);
        const shine = (0.08 + (1 - p.radius) * 0.35) * (0.4 + dopplerP * 0.6);

        let cr, cg, cb;
        if (p.temp > 0.75) {
          cr = 255; cg = 230; cb = 200;
        } else if (p.temp > 0.5) {
          cr = 255; cg = 170; cb = 60;
        } else if (p.temp > 0.25) {
          cr = 230; cg = 100; cb = 30;
        } else {
          cr = 160; cg = 50; cb = 15;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${shine})`;
        ctx.arc(px, py, p.size, 0, TAU);
        ctx.fill();
      }

      ctx.restore();

      // -- event horizon (pure black) --
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.arc(cx, cy, evR, 0, TAU);
      ctx.fillStyle = "#000";
      ctx.fill();

      // photon sphere rim
      const rim = ctx.createRadialGradient(cx, cy, evR * 0.88, cx, cy, evR * 1.8);
      rim.addColorStop(0, "transparent");
      rim.addColorStop(0.35, "rgba(255,180,100,0.08)");
      rim.addColorStop(0.55, "rgba(255,140,60,0.05)");
      rim.addColorStop(0.75, "rgba(200,80,30,0.02)");
      rim.addColorStop(1, "transparent");
      ctx.fillStyle = rim;
      ctx.fillRect(cx - evR * 2, cy - evR * 2, evR * 4, evR * 4);

      // thin bright photon ring
      ctx.beginPath();
      ctx.arc(cx, cy, evR * 1.05, 0, TAU);
      ctx.strokeStyle = "rgba(255,200,140,0.15)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, evR, 0, TAU);
      ctx.strokeStyle = "rgba(200,160,120,0.1)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    function draw(t = 0) {
      try {
        const sc = scroll();
        ctx.clearRect(0, 0, S.w, S.h);

        const bg = ctx.createRadialGradient(
          S.w * 0.65, S.h * 0.35, 0,
          S.w * 0.65, S.h * 0.35, Math.max(S.w, S.h, 1) * 0.9
        );
        bg.addColorStop(0, "#020308");
        bg.addColorStop(0.3, "#010205");
        bg.addColorStop(0.6, "#010103");
        bg.addColorStop(1, "#000001");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, S.w, S.h);

        drawNebulae(t);
        drawStars(t, sc);
        drawBlackHole(t, sc);
      } catch (_) {}

      if (!reduced) {
        S.frame = requestAnimationFrame(draw);
      }
    }

    const onScroll = () => { if (reduced) draw(); };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(S.frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [route]);

  return <canvas ref={canvasRef} className="black-hole-scene" aria-hidden="true" />;
}
