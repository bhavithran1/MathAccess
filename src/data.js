export const programs = [
  {
    id: "hackathons",
    route: "/hackathons",
    code: "MA-01",
    label: "Event Circuit",
    title: "High School Hackathons",
    shortTitle: "Hackathons",
    hero: "Hackathons where mathematics becomes something students can build.",
    description:
      "School-level and regional events where teams use mathematics, code, design, and explanation to solve problems in public.",
    lede:
      "A MathAccess hackathon is a focused invention room. Students arrive with a question, build something visible, and leave with a stronger sense that deep mathematics is not locked behind background or school prestige.",
    icon: "calendar",
    accent: "green",
    stats: ["1 day or weekend", "Teams of 3-5", "High school+", "Mentor-supported"],
    sections: [
      {
        kicker: "Event Flow",
        title: "A clear route from question to demo.",
        body:
          "The event is structured so first-timers and serious builders both know what progress looks like.",
        items: [
          ["Opening Challenge", "Teams choose from themes like optimization, networks, cryptography, simulation, fair division, or contest design."],
          ["Build Sprint", "Students create a prototype, proof sketch, visualization, dashboard, explainer, or playable math experience."],
          ["Clinic Review", "Mentors stress-test assumptions and help sharpen the mathematics behind each project."],
          ["Public Demos", "Teams present for awards in clarity, courage, mathematical depth, and usefulness."]
        ]
      },
      {
        kicker: "Build Tracks",
        title: "Multiple ways to be mathematical.",
        body:
          "Every track gives students a different door into mathematical work.",
        items: [
          ["Proof Lab", "Turn a hard pattern into a careful argument, counterexample, or olympiad-style solution."],
          ["Simulation Lab", "Model probability, networks, games, voting, epidemics, logistics, or search processes."],
          ["Explain Lab", "Create an interactive explanation that makes a difficult idea intuitive for younger students."],
          ["Impact Lab", "Apply mathematics to a local school, community, accessibility, finance, or transport problem."]
        ]
      }
    ],
    table: [
      ["Student Path", "Bring a school team, join solo, or come through a partner teacher.", "open intake"],
      ["Mentor Path", "Support proof, code, judging, logistics, translation, or post-event follow-up.", "volunteer"],
      ["Partner Path", "Host a venue, sponsor devices, or connect schools outside major urban networks.", "school-ready"]
    ],
    quote:
      "A strong hackathon project can be a proof, a tool, a game mechanic, or a clear explanation. What matters is that students learn to ask what structure is hiding underneath.",
    applyTitle: "Apply for the next MathAccess Hackathon.",
    applyBody:
      "The real form can collect school, state, preferred track, experience level, teammate names, accessibility needs, and device support requests."
  },
  {
    id: "olympiad-ai",
    route: "/olympiad-ai",
    code: "MA-02",
    label: "AI Lab",
    title: "Original Olympiad Problem Engine",
    shortTitle: "Olympiad AI",
    hero: "An AI system for generating original olympiad problems.",
    description:
      "A human-reviewed research tool for fresh olympiad-style problems, novelty checks, hints, and mentor-ready training sets.",
    lede:
      "The engine is designed to help mentors and students study elegant problem creation. It should generate candidate problems, check similarity against known sources, and keep humans responsible for correctness and taste.",
    icon: "spark",
    accent: "cyan",
    stats: ["Algebra", "Number theory", "Geometry", "Combinatorics"],
    sections: [
      {
        kicker: "Generation Pipeline",
        title: "Originality is treated as a system.",
        body:
          "The goal is not more random hard questions. The goal is auditable problem creation with novelty, correctness, and elegance in the loop.",
        items: [
          ["Structure Seed", "Select a theorem, invariant, transformation, counting idea, or hidden construction."],
          ["Problem Draft", "Generate controlled variants with clean wording and a plausible path to solution."],
          ["Novelty Scan", "Compare against known training sets and contest archives before mentor review."],
          ["Mentor Audit", "Check correctness, difficulty, elegance, cultural neutrality, and teaching value."]
        ]
      },
      {
        kicker: "Responsible AI",
        title: "Humans keep the mathematical standard.",
        body:
          "AI can accelerate drafts, but mentors decide what deserves to reach students.",
        items: [
          ["Correctness", "Does the statement have a valid solution and no hidden ambiguity?"],
          ["Novelty", "Is it meaningfully new rather than only reworded?"],
          ["Elegance", "Does the solution contain a memorable idea?"],
          ["Accessibility", "Can a motivated student find a first foothold?"]
        ]
      }
    ],
    table: [
      ["Training Sets", "Generate targeted practice around invariants, inequalities, modular arithmetic, graph coloring, or geometry.", "mentor-reviewed"],
      ["Problem Writing", "Let students compare weak drafts, elegant drafts, and repaired solutions.", "workshop-ready"],
      ["Contest Prep", "Build original shortlists for internal MathAccess events.", "future use"]
    ],
    quote:
      "The standard is not whether a model can produce text that looks like a problem. The standard is whether the problem teaches a real mathematical idea.",
    applyTitle: "Join the problem generation lab.",
    applyBody:
      "Students can test generated questions. Mentors can review drafts. Engineers can improve similarity search, validation, and metadata."
  },
  {
    id: "game-worlds",
    route: "/game-worlds",
    code: "MA-03",
    label: "Learning Worlds",
    title: "Advanced Math Game Worlds",
    shortTitle: "Game Worlds",
    hero: "Advanced mathematics explained through game worlds.",
    description:
      "Interactive worlds where graph theory, number theory, topology, probability, and proof become systems students can manipulate.",
    lede:
      "A graph becomes a city. A proof becomes a quest. Probability becomes a machine with rules students can test, break, and repair. The world is not decoration; it is the mathematical object.",
    icon: "orbit",
    accent: "amber",
    stats: ["Guided play", "Classroom pilots", "Camp-ready", "Buildable levels"],
    sections: [
      {
        kicker: "World Concepts",
        title: "Each world reveals a structure.",
        body:
          "Every interaction should surface an invariant, symmetry, strategy, tradeoff, or proof idea.",
        items: [
          ["Graph City", "Route electricity, rescue paths, and transport lines while discovering connectivity, coloring, and cuts."],
          ["Prime Archipelago", "Unlock islands through divisibility, modular arithmetic, residues, and hidden number maps."],
          ["Proof Forge", "Craft claims, test counterexamples, choose lemmas, and turn observations into arguments."],
          ["Chance Engine", "Simulate, estimate, and reason about random processes in a controllable world."]
        ]
      },
      {
        kicker: "Classroom Model",
        title: "Play first. Name the theorem second.",
        body:
          "Students move from confusion to pattern, then language, then proof.",
        items: [
          ["Enter", "Start with a challenge and minimal terminology."],
          ["Notice", "Find the quantity, structure, or rule that refuses to change."],
          ["Translate", "Name the concept and write it formally."],
          ["Build", "Design a new level that proves the idea has landed."]
        ]
      }
    ],
    table: [
      ["Graph City", "Connectivity, Euler trails, coloring, flows, and cuts.", "prototype"],
      ["Prime Archipelago", "Divisibility, modular arithmetic, and residues.", "concept"],
      ["Proof Forge", "Counterexamples, lemmas, and proof structure.", "concept"]
    ],
    quote:
      "The best game-world lesson asks: here is a world, what cannot change? Then the theorem feels discovered instead of handed down.",
    applyTitle: "Join the first playtest cohort.",
    applyBody:
      "Students can playtest worlds. Teachers can host pilots. Developers and designers can help turn lessons into playable prototypes."
  },
  {
    id: "conjecture-generator",
    route: "/conjecture-generator",
    code: "MA-04",
    label: "Research Tool",
    title: "Automated Conjecture Generator",
    shortTitle: "Conjectures",
    hero: "The fastest automated conjecture generator we can responsibly build.",
    description:
      "A discovery engine that scans mathematical data, ranks surprising claims, and turns patterns into proof attempts.",
    lede:
      "Students learn that research can begin with pattern-finding, but it only becomes mathematics when a claim survives counterexamples, explanation, and proof.",
    icon: "gauge",
    accent: "red",
    stats: ["Sequences", "Graphs", "Tables", "Simulations"],
    sections: [
      {
        kicker: "Discovery Engine",
        title: "From raw patterns to claims worth testing.",
        body:
          "The system should reward conjectures that are surprising, interpretable, and connected to known mathematical objects.",
        items: [
          ["Pattern Scan", "Search tables, graph invariants, configurations, recurrences, or simulation outputs."],
          ["Counterexample Hunt", "Stress-test claims against larger cases, edge cases, and random constructions."],
          ["Surprise Ranking", "Rank by simplicity, strength, empirical support, novelty, and proof promise."],
          ["Proof Handoff", "Create a worksheet with definitions, tested cases, failed variants, and suggested lemmas."]
        ]
      },
      {
        kicker: "Sprint Format",
        title: "A research workflow for high schoolers.",
        body:
          "The sprint makes computation a doorway into proof rather than a replacement for it.",
        items: [
          ["Dataset", "Teams receive graphs, partitions, modular tables, games, or geometry configurations."],
          ["Machine Search", "The generator proposes claims and removes those that fail obvious tests."],
          ["Human Filter", "Students choose claims that are interesting, explainable, and not coincidence."],
          ["Proof Attempt", "Mentors help teams prove, refine, or responsibly discard the conjecture."]
        ]
      }
    ],
    table: [
      ["Candidate 017", "Monotonic after n >= 8, tested against 2,000 cases.", "proof hint"],
      ["Candidate 044", "Graph invariant bounded by a simple degree expression.", "needs counterexample"],
      ["Candidate 091", "Partition variant suggests an injective mapping.", "promising"]
    ],
    quote:
      "The machine can be fast. The student must still be careful. That tension is the lesson.",
    applyTitle: "Join the first conjecture sprint.",
    applyBody:
      "Students can test the workflow. Mentors can evaluate conjectures. Developers can improve ranking and counterexample search."
  },
  {
    id: "quantum-computing",
    route: "/quantum-computing",
    code: "MA-05",
    label: "Quantum Entry",
    title: "Quantum Computing Questions",
    shortTitle: "Quantum",
    hero: "Quantum computing questions that make the field feel possible.",
    description:
      "Question-led modules that invite high schoolers into superposition, measurement, interference, entanglement, and algorithms.",
    lede:
      "This track uses carefully designed questions to build intuition before formal linear algebra. Students meet quantum computing through puzzles they can reason about, not jargon they must survive.",
    icon: "atom",
    accent: "violet",
    stats: ["Superposition", "Measurement", "Interference", "Algorithms"],
    sections: [
      {
        kicker: "Question Design",
        title: "The first question matters more than the first formula.",
        body:
          "Each module starts visually or experimentally. Formal notation appears after the student has a mental model.",
        items: [
          ["Can a coin be both heads and tails before you look?", "A doorway into states, predictions, and why measurement changes what can be known."],
          ["Can two wrong paths cancel each other?", "A route into interference, amplitudes, and how algorithms amplify desired answers."],
          ["Can faraway things share one state?", "An intuitive entry into entanglement, correlations, and classical assumptions."],
          ["Why is quantum copying not copy-paste?", "A student-friendly path toward no-cloning, measurement, and information security."]
        ]
      },
      {
        kicker: "Module Sequence",
        title: "A path from intuition to real study.",
        body:
          "Short labs can run online, in schools, or during MathAccess camps.",
        items: [
          ["States", "Measurement and why probability enters the story."],
          ["Interference", "Amplitudes and the difference between chance and cancellation."],
          ["Entanglement", "Correlations and information that refuses classical categories."],
          ["Algorithms", "Speedup as clever amplitude manipulation, not magic."]
        ]
      }
    ],
    table: [
      ["Question Lab", "Students reason visually before notation appears.", "entry"],
      ["Math Bridge", "Vectors, complex numbers, probability, matrices, and proof habits.", "next step"],
      ["Mentor Circle", "Module writing and discussion support from volunteers.", "volunteer"]
    ],
    quote:
      "The goal is not to pretend quantum computing is easy. The goal is to show students that difficulty can be entered through good questions.",
    applyTitle: "Apply for the first quantum cohort.",
    applyBody:
      "Students can apply for question-led modules. Volunteers can help write lessons or connect the track to universities and labs."
  }
];

export const homeStats = [
  ["Access", "Open", "For students from every Malaysian background."],
  ["Programs", "5 tracks", "Olympiads, AI, games, conjectures, and quantum."],
  ["Audience", "High school+", "Welcoming beginners while stretching top solvers."],
  ["Status", "Launching", "Applications and partner details are placeholders."]
];

export const orgEvents = [
  ["Hack Circuit", "Regional high-school hackathons where teams turn mathematical ideas into prototypes, dashboards, games, and explainers."],
  ["Problem Engine Demo Day", "Students and mentors test AI-generated olympiad problems and discuss what makes a problem elegant."],
  ["Game Worlds Math Camp", "A project-based camp where algebra, combinatorics, geometry, and probability become playable systems."],
  ["Conjecture Sprint", "A research-style challenge where students use computation to discover patterns and attempt proofs."],
  ["Quantum Intuition Lab", "A question-driven introduction to quantum computing for students who know curiosity before linear algebra."],
  ["Volunteer Training Night", "Onboarding for teachers, undergraduates, engineers, researchers, and olympiad alumni."]
];
