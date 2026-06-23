import { useEffect, useRef } from "react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const TAU = Math.PI * 2;
const PI = Math.PI;

function makeStar(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    z: 0.1 + Math.random() * 1.8,
    drift: 0.08 + Math.random() * 0.5,
    alpha: 0.06 + Math.random() * 0.85,
    hue: Math.random() > 0.82 ? 25 + Math.random() * 35 : 195 + Math.random() * 50,
    twinklePhase: Math.random() * TAU,
    twinkleSpeed: 0.2 + Math.random() * 1.4,
  };
}

function makeDiscParticle() {
  const r = 0.15 + Math.random() * 0.85;
  return {
    angle: Math.random() * TAU,
    radius: r,
    speed: 0.06 + (1 - r) * 0.7,
    size: 0.3 + Math.random() * 1.6,
    temp: Math.random(),
  };
}

function makeNebulaBlob() {
  return {
    x: Math.random(),
    y: Math.random(),
    r: 0.06 + Math.random() * 0.14,
    hue: 210 + Math.random() * 70,
    alpha: 0.008 + Math.random() * 0.018,
    drift: 0.000015 + Math.random() * 0.00003,
    phase: Math.random() * TAU,
  };
}

function diskColor(norm) {
  // smooth blackbody-ish curve: white-hot inner → orange → deep red outer
  const t = clamp(norm, 0, 1);
  const r = 255;
  const g = Math.round(255 * Math.pow(1 - t * 0.72, 1.6));
  const b = Math.round(255 * Math.pow(1 - t * 0.92, 2.8));
  return [r, g, b];
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

    const STAR_COUNT = 380;
    const DISC_COUNT = 500;
    const NEBULA_COUNT = 5;

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

    function scrollProgress() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return clamp(window.scrollY / max, 0, 1);
    }

    function drawNebulae(t) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const n of S.nebulae) {
        const x = (n.x + Math.sin(t * n.drift + n.phase) * 0.03) * S.w;
        const y = (n.y + Math.cos(t * n.drift * 0.6 + n.phase) * 0.02) * S.h;
        const r = n.r * Math.min(S.w, S.h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `hsla(${n.hue}, 50%, 20%, ${n.alpha * 1.4})`);
        g.addColorStop(0.5, `hsla(${n.hue}, 40%, 12%, ${n.alpha})`);
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
        const pull = sc * 50 * s.z;
        const x = (s.x + Math.sin(t * 0.00005 * s.drift + s.z) * 10 + pull) % S.w;
        const y = (s.y + sc * 25 * s.drift) % S.h;
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.twinkleSpeed + s.twinklePhase);
        const a = s.alpha * (0.25 + twinkle * 0.75);
        const sz = (0.25 + s.z * 0.85) * (0.75 + twinkle * 0.25);

        if (s.z > 1.3) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, sz * 2.5);
          glow.addColorStop(0, `hsla(${s.hue}, 60%, 90%, ${a * 0.5})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(x - sz * 2.5, y - sz * 2.5, sz * 5, sz * 5);
        }

        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 50%, 92%, ${a})`;
        ctx.arc(x, y, sz, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawBlackHole(t, sc) {
      const min = Math.max(1, Math.min(S.w, S.h));
      const cx = S.w * (S.w < 760 ? 0.52 : 0.66);
      const cy = S.h * (0.32 + sc * 0.08);
      const evR = min * (0.06 + sc * 0.012);
      const diskR = min * (0.32 + sc * 0.04);
      const phase = reduced ? sc * 5 + S.shift : t * 0.00018 + sc * 3 + S.shift;

      // gravity well – deep dark pull around the hole
      const well = ctx.createRadialGradient(cx, cy, evR * 0.2, cx, cy, diskR * 2.8);
      well.addColorStop(0, "rgba(0,0,0,0.99)");
      well.addColorStop(0.1, "rgba(0,0,0,0.97)");
      well.addColorStop(0.22, "rgba(1,2,6,0.9)");
      well.addColorStop(0.38, "rgba(4,8,20,0.55)");
      well.addColorStop(0.6, "rgba(8,4,16,0.18)");
      well.addColorStop(0.85, "rgba(4,2,8,0.04)");
      well.addColorStop(1, "transparent");
      ctx.fillStyle = well;
      ctx.fillRect(0, 0, S.w, S.h);

      // ── BACK HALF of accretion disk (behind the black hole) ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.22);
      ctx.globalCompositeOperation = "lighter";

      // broad glow wash
      for (let i = 0; i < 2; i++) {
        const spread = diskR * (1.3 + i * 0.5);
        const squeeze = 0.09 + i * 0.025;
        const a = 0.03 - i * 0.01;
        ctx.save();
        ctx.scale(1, squeeze);
        const dg = ctx.createRadialGradient(0, 0, diskR * 0.25, 0, 0, spread);
        dg.addColorStop(0, `rgba(255,140,30,${a})`);
        dg.addColorStop(0.5, `rgba(200,70,10,${a * 0.5})`);
        dg.addColorStop(1, "transparent");
        ctx.fillStyle = dg;
        ctx.fillRect(-spread, -spread, spread * 2, spread * 2);
        ctx.restore();
      }

      // back-half disk rings
      const ringCount = 36;
      for (let i = 0; i < ringCount; i++) {
        const norm = i / (ringCount - 1);
        const rx = diskR * (0.5 + norm * 0.95);
        const ry = diskR * (0.04 + norm * 0.028);
        const [cr, cg, cb] = diskColor(norm);

        const doppler = 0.55 + 0.45 * Math.sin(phase * 0.12 + norm * 0.6);
        const baseAlpha = (0.02 + (1 - Math.abs(norm - 0.35)) * 0.065) * doppler;

        ctx.beginPath();
        // only draw the back arc (PI to TAU = far side behind the hole)
        ctx.ellipse(0, 0, rx, ry, 0, PI, TAU);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${baseAlpha})`;
        ctx.lineWidth = 0.5 + (1 - norm) * 3;
        ctx.stroke();
      }

      // back-half particles
      for (const p of S.disc) {
        const swirl = phase * p.speed + p.angle + sc * 2;
        const norm = swirl % TAU;
        if (norm > 0 && norm < PI) continue; // skip front-half particles for now

        const r = diskR * p.radius;
        const px = Math.cos(swirl) * r * (1.4 + p.radius * 0.25);
        const py = Math.sin(swirl) * r * (0.055 + p.radius * 0.03);
        const dopplerP = 0.45 + 0.55 * Math.cos(swirl);
        const shine = (0.06 + (1 - p.radius) * 0.3) * (0.35 + dopplerP * 0.65);
        const [cr, cg, cb] = diskColor(p.temp);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${shine})`;
        ctx.arc(px, py, p.size, 0, TAU);
        ctx.fill();
      }

      ctx.restore();

      // ── LENSED ARC – light from the back disk bending over the top of the shadow ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const arcR = evR * (1.15 + i * 0.12);
        const a = 0.09 - i * 0.02;
        ctx.beginPath();
        ctx.ellipse(0, -evR * 0.08, arcR, arcR * 0.38, 0, PI + 0.3, TAU - 0.3);
        ctx.strokeStyle = `rgba(255,180,80,${a})`;
        ctx.lineWidth = 2.2 - i * 0.4;
        ctx.stroke();
      }
      // thinner lensed arc below
      for (let i = 0; i < 3; i++) {
        const arcR = evR * (1.1 + i * 0.1);
        const a = 0.05 - i * 0.015;
        ctx.beginPath();
        ctx.ellipse(0, evR * 0.08, arcR, arcR * 0.3, 0, 0.4, PI - 0.4);
        ctx.strokeStyle = `rgba(255,150,50,${a})`;
        ctx.lineWidth = 1.5 - i * 0.35;
        ctx.stroke();
      }
      ctx.restore();

      // ── EVENT HORIZON – the shadow ──
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.arc(cx, cy, evR, 0, TAU);
      ctx.fillStyle = "#000";
      ctx.fill();

      // photon sphere – thin bright ring at the edge of the shadow
      ctx.beginPath();
      ctx.arc(cx, cy, evR * 1.02, 0, TAU);
      ctx.strokeStyle = "rgba(255,210,150,0.12)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, evR * 1.06, 0, TAU);
      ctx.strokeStyle = "rgba(255,180,100,0.06)";
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // soft rim glow
      const rim = ctx.createRadialGradient(cx, cy, evR * 0.9, cx, cy, evR * 1.6);
      rim.addColorStop(0, "transparent");
      rim.addColorStop(0.4, "rgba(255,170,80,0.05)");
      rim.addColorStop(0.7, "rgba(255,120,40,0.025)");
      rim.addColorStop(1, "transparent");
      ctx.fillStyle = rim;
      ctx.fillRect(cx - evR * 2, cy - evR * 2, evR * 4, evR * 4);
      ctx.restore();

      // ── FRONT HALF of accretion disk (in front of the black hole) ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.22);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < ringCount; i++) {
        const norm = i / (ringCount - 1);
        const rx = diskR * (0.5 + norm * 0.95);
        const ry = diskR * (0.04 + norm * 0.028);
        const [cr, cg, cb] = diskColor(norm);

        const doppler = 0.55 + 0.45 * Math.sin(phase * 0.12 + norm * 0.6);
        const baseAlpha = (0.025 + (1 - Math.abs(norm - 0.35)) * 0.075) * doppler;

        ctx.beginPath();
        // front arc (0 to PI = near side in front of the hole)
        ctx.ellipse(0, 0, rx, ry, 0, 0, PI);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${baseAlpha})`;
        ctx.lineWidth = 0.5 + (1 - norm) * 3;
        ctx.stroke();
      }

      // front-half particles
      for (const p of S.disc) {
        const swirl = phase * p.speed + p.angle + sc * 2;
        const norm = swirl % TAU;
        if (norm < 0 || norm >= PI) continue;

        const r = diskR * p.radius;
        const px = Math.cos(swirl) * r * (1.4 + p.radius * 0.25);
        const py = Math.sin(swirl) * r * (0.055 + p.radius * 0.03);
        const dopplerP = 0.45 + 0.55 * Math.cos(swirl);
        const shine = (0.07 + (1 - p.radius) * 0.35) * (0.35 + dopplerP * 0.65);
        const [cr, cg, cb] = diskColor(p.temp);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${shine})`;
        ctx.arc(px, py, p.size, 0, TAU);
        ctx.fill();
      }

      ctx.restore();
    }

    function draw(t = 0) {
      try {
        const sc = scrollProgress();
        ctx.clearRect(0, 0, S.w, S.h);

        const bg = ctx.createRadialGradient(
          S.w * 0.6, S.h * 0.35, 0,
          S.w * 0.6, S.h * 0.35, Math.max(S.w, S.h, 1) * 0.95
        );
        bg.addColorStop(0, "#020308");
        bg.addColorStop(0.35, "#010205");
        bg.addColorStop(0.65, "#010103");
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
