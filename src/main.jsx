import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Atom,
  BookOpen,
  CalendarCheck,
  ChevronRight,
  Compass,
  ExternalLink,
  Gauge,
  Lightbulb,
  Orbit,
  RotateCw,
  Search,
  Sparkles
} from "lucide-react";
import { BlackHoleScene } from "./BlackHoleScene.jsx";
import { dailyChallenges, homeStats, learningResources, mathFacts, orgEvents, programs } from "./data.js";
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

function ButtonLink({ to, href, children, tone = "default", onNavigate }) {
  if (href) {
    return <a className={`button ${tone}`} href={href}>{children}</a>;
  }

  return (
    <RouteLink className={`button ${tone}`} to={to} onNavigate={onNavigate}>
      {children}
    </RouteLink>
  );
}

function Header({ route, onNavigate }) {
  return (
    <header className="site-header">
      <div className="container nav-inner">
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
  const [resourceFilter, setResourceFilter] = useState("All");
  const [resourceQuery, setResourceQuery] = useState("");
  const [challengeIndex, setChallengeIndex] = useState(() => new Date().getDate() % dailyChallenges.length);
  const [showSolution, setShowSolution] = useState(false);
  const [factIndex, setFactIndex] = useState(() => new Date().getDate() % mathFacts.length);

  const filteredResources = useMemo(() => {
    const query = resourceQuery.trim().toLowerCase();
    return learningResources.filter((resource) => {
      const matchesFilter = resourceFilter === "All" || resource.type === resourceFilter;
      const matchesQuery = !query || [resource.title, resource.type, resource.level, resource.description]
        .join(" ")
        .toLowerCase()
        .includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [resourceFilter, resourceQuery]);

  const changeChallenge = () => {
    setChallengeIndex((index) => (index + 1) % dailyChallenges.length);
    setShowSolution(false);
  };

  const changeFact = () => setFactIndex((index) => (index + 1) % mathFacts.length);
  const challenge = dailyChallenges[challengeIndex];
  const fact = mathFacts[factIndex];

  return (
    <>
      <section className="hero home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Advanced mathematics, made reachable</p>
            <h1>MathAccess</h1>
            <p className="hero-lede">
              Your friendly basecamp for becoming more curious, confident, and capable with mathematics—whether you are catching up for SPM, chasing olympiad problems, or building the next big idea.
            </p>
            <div className="hero-actions">
              <ButtonLink href="#starter-path" tone="primary">
                Start here
              </ButtonLink>
              <ButtonLink href="#resources" tone="green">
                Find a resource
              </ButtonLink>
              <ButtonLink href="#programs">
                Explore opportunities
              </ButtonLink>
            </div>
          </div>

          <div className="orbit-console" aria-label="MathAccess system summary">
            <div className="console-topline">
              <span>MA ACCESS INDEX</span>
              <span>LIVE</span>
            </div>
            <div className="console-number">01</div>
            <p>small step today: learn a little, try a little, explain a little</p>
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

      <section className="section starter-section" id="starter-path">
        <div className="container">
          <Reveal>
            <SectionHeader
              kicker="Start where you are"
              title="No secret maths gene required. Just a next step."
              body="Pick the route that feels most like you today. Each one is built to be kind, concrete, and easy to start after school."
            />
          </Reveal>
          <div className="starter-grid">
            <Reveal delay={1}>
              <article className="starter-card">
                <span className="starter-icon green"><BookOpen size={22} aria-hidden="true" /></span>
                <span className="card-code">01 / REBUILD</span>
                <h3>I want to feel less lost in class.</h3>
                <p>Use your textbook plus one short lesson. Redo a worked example without looking, then explain why each step works.</p>
                <a href="#resources" onClick={() => setResourceFilter("Start here")}>Find foundation resources <ChevronRight size={16} aria-hidden="true" /></a>
              </article>
            </Reveal>
            <Reveal delay={2}>
              <article className="starter-card">
                <span className="starter-icon cyan"><Compass size={22} aria-hidden="true" /></span>
                <span className="card-code">02 / EXPLORE</span>
                <h3>I like maths, but I want it to feel bigger.</h3>
                <p>Try one rich problem each week. Draw it, guess a rule, test a few cases, then write what you have noticed.</p>
                <a href="#resources" onClick={() => setResourceFilter("SPM & school")}>Find a first challenge <ChevronRight size={16} aria-hidden="true" /></a>
              </article>
            </Reveal>
            <Reveal delay={3}>
              <article className="starter-card">
                <span className="starter-icon amber"><Lightbulb size={22} aria-hidden="true" /></span>
                <span className="card-code">03 / STRETCH</span>
                <h3>I am ready for difficult problems.</h3>
                <p>Spend longer on fewer questions. Keep a “mistake museum” so every stuck moment becomes a useful strategy later.</p>
                <a href="#resources" onClick={() => setResourceFilter("Olympiad")}>Find olympiad practice <ChevronRight size={16} aria-hidden="true" /></a>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section alt" id="challenge">
        <div className="container discovery-grid">
          <Reveal className="reveal-left">
            <article className="challenge-card">
              <div className="challenge-topline">
                <span><Sparkles size={15} aria-hidden="true" /> DAILY BRAIN SPARK</span>
                <button className="icon-button" type="button" onClick={changeChallenge} aria-label="Show a different challenge">
                  <RotateCw size={17} aria-hidden="true" />
                </button>
              </div>
              <span className="challenge-strand">{challenge.strand}</span>
              <h2>{challenge.prompt}</h2>
              <p className="challenge-nudge">Try this: {challenge.nudge}</p>
              {showSolution && <p className="challenge-solution">{challenge.solution}</p>}
              <button className="button primary" type="button" onClick={() => setShowSolution((visible) => !visible)}>
                {showSolution ? "Hide answer" : "Reveal the idea"}
              </button>
            </article>
          </Reveal>
          <Reveal className="reveal-right">
            <article className="fact-card">
              <div className="challenge-topline">
                <span><Lightbulb size={15} aria-hidden="true" /> MATHS IS EVERYWHERE</span>
                <button className="icon-button" type="button" onClick={changeFact} aria-label="Show another fun fact">
                  <RotateCw size={17} aria-hidden="true" />
                </button>
              </div>
              <p className="fact-main">“{fact.fact}”</p>
              <p>{fact.note}</p>
              <span className="fact-count">FACT {String(factIndex + 1).padStart(2, "0")} / {String(mathFacts.length).padStart(2, "0")}</span>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section" id="resources">
        <div className="container">
          <Reveal>
            <SectionHeader
              kicker="Maths basecamp"
              title="Good places to learn, practise, and play."
              body="Start with one resource—not ten open tabs. These picks help you learn at your own level, from building SPM confidence to experimenting with deeper ideas."
            />
          </Reveal>
          <Reveal>
            <div className="resource-controls">
              <label className="resource-search">
                <Search size={18} aria-hidden="true" />
                <span className="sr-only">Search learning resources</span>
                <input
                  type="search"
                  value={resourceQuery}
                  onChange={(event) => setResourceQuery(event.target.value)}
                  placeholder="Search algebra, graphs, olympiad..."
                />
              </label>
              <div className="resource-filters" aria-label="Filter resources">
                {["All", "Start here", "SPM & school", "Olympiad", "Build & explore"].map((filter) => (
                  <button
                    className={resourceFilter === filter ? "selected" : ""}
                    key={filter}
                    type="button"
                    onClick={() => setResourceFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="resource-grid" aria-live="polite">
            {filteredResources.map((resource, index) => (
              <Reveal key={resource.title} delay={Math.min((index % 3) + 1, 3)}>
                <a className={`resource-card ${resource.tone}`} href={resource.href} target={resource.href.startsWith("http") ? "_blank" : undefined} rel={resource.href.startsWith("http") ? "noreferrer" : undefined}>
                  <div className="resource-meta">
                    <span>{resource.type}</span>
                    <ExternalLink size={15} aria-hidden="true" />
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-foot">
                    <span>{resource.level}</span>
                    <span>{resource.time}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
          {filteredResources.length === 0 && (
            <p className="empty-resources">No match yet. Try “graphs”, “school”, “problem”, or clear the filters.</p>
          )}
        </div>
      </section>

      <section className="section" id="programs">
        <div className="container">
          <Reveal>
            <SectionHeader
              kicker="Program map"
              title="Five ways students enter deep mathematics."
              body="When you are ready to go beyond solo practice, these are places to build, discover, play, and meet people who love difficult questions too."
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
      />

      <ApplyBand
        id="apply"
        kicker="Student applications"
        title="Apply for events, labs, and early cohorts."
        body="Students can join through school nominations, open applications, or partner programs. The first intake can collect school, state, interests, and accessibility needs."
        action="Apply for a program"
        placeholder="Application link placeholder"
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
                <ButtonLink href="#apply" tone="primary">
                  Apply
                </ButtonLink>
                <ButtonLink href="#volunteer" tone="green">
                  Volunteer
                </ButtonLink>
                <ButtonLink to="/" onNavigate={onNavigate}>
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
        alternate
      />

      <ApplyBand
        id="volunteer"
        kicker="Volunteer pathway"
        title={`Help build ${program.shortTitle}.`}
        body="Mentors, teachers, engineers, designers, university students, olympiad alumni, and logistics volunteers can all contribute."
        action="Volunteer placeholder"
        placeholder={`${program.shortTitle} volunteer form placeholder`}
      />
    </>
  );
}

function ApplyBand({ id, kicker, title, body, action, placeholder, alternate = false }) {
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
                {action}
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
