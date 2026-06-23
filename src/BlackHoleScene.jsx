import { useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function makeStar(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    z: 0.2 + Math.random() * 1.4,
    drift: 0.2 + Math.random() * 0.8,
    alpha: 0.15 + Math.random() * 0.75
  };
}

function makeParticle() {
  return {
    angle: Math.random() * Math.PI * 2,
    radius: 0.18 + Math.random() * 0.88,
    speed: 0.12 + Math.random() * 0.62,
    size: 0.55 + Math.random() * 1.8,
    band: Math.random()
  };
}

export function BlackHoleScene({ route }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      stars: [],
      particles: [],
      frame: 0,
      routeShift: route.length * 0.071
    };

    for (let index = 0; index < 240; index += 1) {
      state.stars.push(makeStar(window.innerWidth || 1280, window.innerHeight || 720));
    }

    for (let index = 0; index < 260; index += 1) {
      state.particles.push(makeParticle());
    }

    function resize() {
      state.dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      state.stars = state.stars.map(() => makeStar(state.width, state.height));
    }

    function progress() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return clamp(window.scrollY / max, 0, 1);
    }

    function drawStars(time, scroll) {
      context.save();
      context.globalCompositeOperation = "lighter";

      for (const star of state.stars) {
        const pull = scroll * 80 * star.z;
        const x = (star.x + Math.sin(time * 0.00008 * star.drift + star.z) * 18 + pull) % state.width;
        const y = (star.y + scroll * 42 * star.drift) % state.height;
        const size = 0.45 + star.z * 0.8;

        context.beginPath();
        context.fillStyle = `rgba(132, 218, 255, ${star.alpha * 0.34})`;
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    }

    function drawBlackHole(time, scroll) {
      const min = Math.min(state.width, state.height);
      const cx = state.width * (state.width < 760 ? 0.56 : 0.72);
      const cy = state.height * (0.28 + scroll * 0.12);
      const eventRadius = min * (0.058 + scroll * 0.018);
      const diskRadius = min * (0.26 + scroll * 0.045);
      const phase = reducedMotion ? scroll * 5 + state.routeShift : time * 0.00028 + scroll * 4 + state.routeShift;

      const well = context.createRadialGradient(cx, cy, eventRadius * 0.4, cx, cy, diskRadius * 2.25);
      well.addColorStop(0, "rgba(0, 0, 0, 0.98)");
      well.addColorStop(0.18, "rgba(0, 0, 0, 0.94)");
      well.addColorStop(0.34, "rgba(4, 23, 44, 0.72)");
      well.addColorStop(0.58, "rgba(32, 110, 255, 0.16)");
      well.addColorStop(0.82, "rgba(42, 230, 255, 0.055)");
      well.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = well;
      context.fillRect(0, 0, state.width, state.height);

      context.save();
      context.translate(cx, cy);
      context.rotate(-0.26 + Math.sin(phase * 0.65) * 0.025);
      context.globalCompositeOperation = "lighter";

      for (let ring = 0; ring < 16; ring += 1) {
        const t = ring / 15;
        const rx = diskRadius * (0.66 + t * 0.76);
        const ry = diskRadius * (0.092 + t * 0.046);
        const alpha = 0.035 + (1 - Math.abs(t - 0.52)) * 0.09;

        context.beginPath();
        context.ellipse(0, 0, rx, ry, phase + t * 0.65, 0, Math.PI * 2);
        context.strokeStyle =
          ring % 4 === 0
            ? `rgba(60, 255, 166, ${alpha})`
            : ring % 4 === 1
              ? `rgba(72, 198, 255, ${alpha + 0.03})`
              : ring % 4 === 2
                ? `rgba(255, 205, 112, ${alpha * 0.72})`
                : `rgba(105, 134, 255, ${alpha * 0.82})`;
        context.lineWidth = 0.75 + t * 2.4;
        context.stroke();
      }

      for (const particle of state.particles) {
        const swirl = phase * particle.speed + particle.angle + scroll * 2.8;
        const r = diskRadius * particle.radius;
        const x = Math.cos(swirl) * r * (1.62 + particle.radius * 0.28);
        const y = Math.sin(swirl) * r * (0.16 + particle.radius * 0.05);
        const shine = 0.12 + (1 - particle.radius) * 0.4;

        context.beginPath();
        context.fillStyle =
          particle.band > 0.76
            ? `rgba(255, 207, 112, ${shine})`
            : particle.band > 0.46
              ? `rgba(58, 246, 167, ${shine * 0.86})`
              : `rgba(77, 204, 255, ${shine})`;
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();

      context.save();
      context.globalCompositeOperation = "source-over";
      context.beginPath();
      context.arc(cx, cy, eventRadius, 0, Math.PI * 2);
      context.fillStyle = "rgba(0, 0, 0, 0.98)";
      context.fill();
      context.lineWidth = 1.15;
      context.strokeStyle = "rgba(220, 250, 255, 0.2)";
      context.stroke();

      const rim = context.createRadialGradient(cx, cy, eventRadius * 0.85, cx, cy, eventRadius * 1.55);
      rim.addColorStop(0, "rgba(0, 0, 0, 0)");
      rim.addColorStop(0.6, "rgba(60, 210, 255, 0.11)");
      rim.addColorStop(1, "rgba(60, 210, 255, 0)");
      context.fillStyle = rim;
      context.fillRect(cx - eventRadius * 2, cy - eventRadius * 2, eventRadius * 4, eventRadius * 4);
      context.restore();
    }

    function drawGrid(scroll) {
      context.save();
      context.globalAlpha = 0.18;
      context.strokeStyle = "rgba(76, 178, 255, 0.24)";
      context.lineWidth = 1;

      for (let y = -80; y < state.height + 80; y += 56) {
        const wave = Math.sin(y * 0.018 + scroll * 5) * 18;
        context.beginPath();
        context.moveTo(0, y + wave);
        context.bezierCurveTo(
          state.width * 0.35,
          y - 28 - wave,
          state.width * 0.68,
          y + 38 + wave,
          state.width,
          y - 8
        );
        context.stroke();
      }

      context.restore();
    }

    function draw(time = 0) {
      const scroll = progress();
      context.clearRect(0, 0, state.width, state.height);

      const base = context.createLinearGradient(0, 0, state.width, state.height);
      base.addColorStop(0, "#02050a");
      base.addColorStop(0.42, "#03101c");
      base.addColorStop(1, "#010309");
      context.fillStyle = base;
      context.fillRect(0, 0, state.width, state.height);

      drawStars(time, scroll);
      drawBlackHole(time, scroll);
      drawGrid(scroll);

      if (!reducedMotion) {
        state.frame = window.requestAnimationFrame(draw);
      }
    }

    const handleScroll = () => {
      if (reducedMotion) {
        draw();
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(state.frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [route]);

  return <canvas ref={canvasRef} className="black-hole-scene" aria-hidden="true" />;
}
