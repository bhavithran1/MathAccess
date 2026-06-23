import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Atom,
  BrainCircuit,
  CalendarCheck,
  ChevronRight,
  Gauge,
  GraduationCap,
  Handshake,
  Network,
  Orbit,
  Sparkles,
  Users
} from "lucide-react";
import { BlackHoleScene } from "./BlackHoleScene.jsx";
import { homeStats, orgEvents, programs } from "./data.js";
import "./styles.css";

const icons = {
  atom: Atom,
  calendar: CalendarCheck,
  gauge: Gauge,
  orbit: Orbit,
  spark: Sparkles
};

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function normalizeRoute(pathname) {
  let path = pathname;
  if (basePath && path.startsWith(basePath)) path = path.slice(basePath.length);
  path = path.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
  return path ? `/${path}` : "/";
}

function hrefFor(route) {
  const clean = route === "/" ? "" : route.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}

function useRoute() {
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to) => {
    const next = hrefFor(to);
    window.history.pushState({}, "", next);
    setRoute(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return [route, navigate];
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Reveal({ children, className = "reveal", delay = 0 }) {
  const [ref, visible] = useReveal();
  const stagger = delay ? ` stagger-${delay}` : "";
  return (
    <div ref={ref} className={`${className}${visible ? " visible" : ""}${stagger}`}>
      {children}
    </div>
  );
}

function RouteLink({ to, className, children, onNavigate, ariaLabel }) {
  return (
    <a
      aria-label={ariaLabel}
      className={className}
      href={hrefFor(to)}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onNavigate(to);
      }}
    >
      {children}
    </a>
  );
}

function ButtonLink({ to, href, children, icon: Icon = ArrowRight, tone = "default", onNavigate }) {
  const content = (
    <>
      <span>{children}</span>
      <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
    </>
  );

  if (href) {
    return <a className={`button ${tone}`} href={href}>{content}</a>;
  }

  return (
    <RouteLink className={`button ${tone}`} to={to} onNavigate={onNavigate}>
      {content}
    </RouteLink>
  );
}

function Header({ route, onNavigate }) {
  const activeProgram = programs.find((p) => p.route === route);

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <RouteLink className="brand" to="/" onNavigate={onNavigate} ariaLabel="MathAccess home">
          <span className="brand-mark">MA</span>
          <span className="brand-copy">
            <span className="brand-name">{activeProgram ? activeProgram.title : "MathAccess"}</span>
            <span className="brand-subtitle">
              {activeProgram ? activeProgram.label : "Malaysia math opportunity network"}
            </span>
          </span>
        </RouteLink>

        <nav className="nav-links" aria-label="Main navigation">
          <RouteLink to="/" onNavigate={onNavigate} className={route === "/" ? "active" : ""}>
            Home
          </RouteLink>
          {programs.map((p) => (
            <RouteLink key={p.id} to={p.route} onNavigate={onNavigate} className={route === p.route ? "active" : ""}>
              {p.shortTitle}
            </RouteLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function StatReadout({ stats }) {
  return (
    <Reveal>
      <div className="terminal-readout" aria-label="MathAccess highlights">
        {stats.map(([label, value, note]) => (
          <div className="readout-cell" key={label}>
            <span className="readout-label">{label}</span>
            <strong>{value}</strong>
            <p>{note}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function Ticker() {
  const items = [...programs, ...programs];

  return (
    <section className="ticker-band" aria-label="MathAccess program signal">
      <div className="ticker-track">
        {items.map((p, i) => (
          <span className="ticker-item" key={`${p.id}-${i}`}>
            <strong>{p.shortTitle}</strong>
            {p.description}
          </span>
        ))}
      </div>
    </section>
  );
}

function ProgramIcon({ program }) {
  const Icon = icons[program.icon] || Sparkles;
  return (
    <span className={`program-icon ${program.accent}`}>
      <Icon size={22} strokeWidth={2.1} aria-hidden="true" />
    </span>
  );
}

function HomePage({ onNavigate }) {
  return (
    <>
      <section className="hero home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Advanced mathematics, made reachable</p>
            <h1>MathAccess</h1>
            <p className="hero-lede">
              A Malaysia-wide education organization where olympiad thinking, AI research, mathematical games, conjecture discovery, and quantum computing become reachable for students regardless of school, income, language, or geography.
            </p>
            <div className="hero-actions">
              <ButtonLink href="#volunteer" tone="primary" icon={Handshake}>
                Join as volunteer
              </ButtonLink>
              <ButtonLink href="#apply" tone="green" icon={GraduationCap}>
                Apply for events
              </ButtonLink>
              <ButtonLink href="#programs" icon={Network}>
                Explore programs
              </ButtonLink>
            </div>
          </div>

          <div className="orbit-console" aria-label="MathAccess system summary">
            <div className="console-topline">
              <span>MA ACCESS INDEX</span>
              <span>LIVE</span>
            </div>
            <div className="console-number">05</div>
            <p>separate program sites connected by one access mission</p>
            <div className="console-bars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      <section className="section" id="programs">
        <div className="container">
          <Reveal>
            <SectionHeader
              kicker="Program map"
              title="Five ways students enter deep mathematics."
              body="Each program is now a React route with its own page, story, application placeholder, and public-facing structure."
            />
          </Reveal>
          <div className="program-grid">
            {programs.map((p, i) => (
              <Reveal key={p.id} className="reveal-scale" delay={Math.min(i + 1, 5)}>
                <RouteLink
                  className={`program-card ${p.accent}`}
                  to={p.route}
                  onNavigate={onNavigate}
                >
                  <div className="program-card-top">
                    <ProgramIcon program={p} />
                    <span>{p.code}</span>
                  </div>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <span className="card-link">
                    Open site <ChevronRight size={16} aria-hidden="true" />
                  </span>
                </RouteLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <StatReadout stats={homeStats} />
        </div>
      </section>

      <section className="section" id="events">
        <div className="container">
          <Reveal>
            <SectionHeader
              kicker="Main events"
              title="Built as experiences, not lectures."
              body="These formats are ready for real dates, partner schools, sponsor decks, and application links."
            />
          </Reveal>
          <div className="event-grid">
            {orgEvents.map(([title, body], i) => (
              <Reveal key={title} delay={Math.min((i % 3) + 1, 3)}>
                <article className="event-card" style={{ padding: 22 }}>
                  <span className="card-code">EVENT / {String(i + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ApplyBand
        id="volunteer"
        kicker="Volunteer pathway"
        title="Help a student meet mathematics without gatekeeping."
        body="MathAccess needs mentors for hackathon teams, olympiad problem review, game-world lesson design, quantum question writing, logistics, translation, and school outreach."
        action="Volunteer interest"
        placeholder="Volunteer form placeholder"
        icon={Users}
      />

      <ApplyBand
        id="apply"
        kicker="Student applications"
        title="Apply for events, labs, and early cohorts."
        body="Students can join through school nominations, open applications, or partner programs. The first intake can collect school, state, interests, and accessibility needs."
        action="Apply for a program"
        placeholder="Application link placeholder"
        icon={GraduationCap}
        alternate
      />
    </>
  );
}

function SectionHeader({ kicker, title, body }) {
  return (
    <div className="section-header">
      <div>
        <span className="kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      <p>{body}</p>
    </div>
  );
}

function FeaturePage({ program, onNavigate }) {
  const Icon = icons[program.icon] || Sparkles;

  useEffect(() => {
    document.title = `${program.title} | MathAccess`;
  }, [program.title]);

  return (
    <>
      <section className={`hero feature-hero ${program.accent}`}>
        <div className="container">
          <div className="feature-hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{program.code} / {program.label}</p>
              <h1>{program.hero}</h1>
              <p className="hero-lede">{program.lede}</p>
              <div className="hero-actions">
                <ButtonLink href="#apply" tone="primary" icon={GraduationCap}>
                  Apply
                </ButtonLink>
                <ButtonLink href="#volunteer" tone="green" icon={Handshake}>
                  Volunteer
                </ButtonLink>
                <ButtonLink to="/" onNavigate={onNavigate} icon={ArrowRight}>
                  Main site
                </ButtonLink>
              </div>
              <div className="stat-line">
                {program.stats.map((stat) => (
                  <span className="stat-pill" key={stat}>{stat}</span>
                ))}
              </div>
            </div>

            <div className="feature-signal">
              <Icon size={44} strokeWidth={1.8} aria-hidden="true" />
              <span>{program.code}</span>
              <strong>{program.shortTitle}</strong>
              <p>{program.description}</p>
            </div>
          </div>
        </div>
      </section>

      {program.sections.map((section, si) => (
        <section className={`section ${si % 2 ? "alt" : ""}`} key={section.kicker}>
          <div className="container">
            <Reveal>
              <SectionHeader kicker={section.kicker} title={section.title} body={section.body} />
            </Reveal>
            <div className="insight-grid">
              {section.items.map(([title, body], i) => (
                <Reveal key={title} delay={Math.min((i % 3) + 1, 3)}>
                  <article className="insight-card" style={{ padding: 22 }}>
                    <span className="card-code">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container split-panel">
          <Reveal className="reveal-left">
            <div className="quote-panel">
              <Sparkles size={20} aria-hidden="true" />
              <p>{program.quote}</p>
              <span>MathAccess design principle</span>
            </div>
          </Reveal>
          <Reveal className="reveal-right">
            <div className="terminal-table" role="table" aria-label={`${program.title} details`}>
              {program.table.map(([label, body, tag]) => (
                <div className="terminal-row" role="row" key={label}>
                  <span role="cell">{label}</span>
                  <span role="cell">{body}</span>
                  <strong role="cell">{tag}</strong>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ApplyBand
        id="apply"
        kicker="Applications"
        title={program.applyTitle}
        body={program.applyBody}
        action="Application placeholder"
        placeholder={`${program.shortTitle} intake placeholder`}
        icon={GraduationCap}
        alternate
      />

      <ApplyBand
        id="volunteer"
        kicker="Volunteer pathway"
        title={`Help build ${program.shortTitle}.`}
        body="Mentors, teachers, engineers, designers, university students, olympiad alumni, and logistics volunteers can all contribute."
        action="Volunteer placeholder"
        placeholder={`${program.shortTitle} volunteer form placeholder`}
        icon={Handshake}
      />
    </>
  );
}

function ApplyBand({ id, kicker, title, body, action, placeholder, icon: Icon, alternate = false }) {
  return (
    <section className={`section ${alternate ? "alt" : ""}`} id={id}>
      <div className="container">
        <Reveal>
          <div className="apply-panel">
            <div>
              <span className="kicker">{kicker}</span>
              <h2>{title}</h2>
              <p>{body}</p>
              <a className="button primary" href={`#${id}-placeholder`}>
                <span>{action}</span>
                <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </div>
            <div className="placeholder-box" id={`${id}-placeholder`}>
              <strong>{placeholder}</strong>
              <p>Connect this block to a real form, Airtable, Google Form, or custom intake flow when the first cohort is ready.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>MathAccess / Malaysia math opportunity network</p>
        <nav className="footer-links" aria-label="Footer links">
          {programs.map((p) => (
            <RouteLink key={p.id} to={p.route} onNavigate={onNavigate}>
              {p.shortTitle}
            </RouteLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}

function App() {
  const [route, navigate] = useRoute();
  const currentProgram = useMemo(() => programs.find((p) => p.route === route), [route]);

  useEffect(() => {
    if (!currentProgram) {
      document.title = "MathAccess | Mathematics For Every Malaysian Student";
    }
  }, [currentProgram]);

  return (
    <>
      <BlackHoleScene route={route} />
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="site-shell">
        <Header route={route} onNavigate={navigate} />
        <main id="main">
          {currentProgram ? (
            <FeaturePage program={currentProgram} onNavigate={navigate} />
          ) : (
            <HomePage onNavigate={navigate} />
          )}
        </main>
        <Footer onNavigate={navigate} />
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
