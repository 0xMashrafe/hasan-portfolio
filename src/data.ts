export const profile = {
  name: "Ayaan Rahman",
  handle: "ayaan.exe",
  role: "Independent Design Engineer",
  location: "Dhaka, Bangladesh",
  timeZone: "Asia/Dhaka",
  email: "hello@ayaanrahman.dev",
  availability: "Available for select projects",
  since: 2018,
  statement:
    "I design and build digital products that feel alive — where motion, typography and code meet in the same breath.",
  intro:
    "Independent design engineer working at the seam between design and engineering. I help ambitious teams turn complex problems into interfaces that feel effortless, considered and quietly alive.",
  socials: [
    { label: "GitHub", handle: "@ayaanrahman", href: "https://github.com/" },
    { label: "X / Twitter", handle: "@ayaanbuilds", href: "https://x.com/" },
    { label: "LinkedIn", handle: "in/ayaanrahman", href: "https://linkedin.com/" },
    { label: "Read.cv", handle: "ayaan", href: "https://read.cv/" },
  ],
  stats: [
    { value: "7+", label: "Years shipping" },
    { value: "42", label: "Products launched" },
    { value: "11", label: "Design awards" },
    { value: "∞", label: "Cups of cha" },
  ],
};

export type Project = {
  id: string;
  index: string;
  title: string;
  year: string;
  category: string;
  role: string;
  blurb: string;
  description: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  accent: string;
  accentSoft: string;
  link?: string;
};

export const projects: Project[] = [
  {
    id: "helio",
    index: "01",
    title: "Helio",
    year: "2026",
    category: "Design System",
    role: "Design + Engineering",
    blurb: "A motion-first component library for product teams who care about the last 10%.",
    description:
      "Helio is an opinionated design system built around one idea: motion is part of the API, not an afterthought. Sixty-four accessible primitives ship with choreographed enter/exit states, spring-based layout transitions and a theming layer that survives brand overhauls. Used by four product teams in production.",
    metrics: [
      { value: "64", label: "Primitives" },
      { value: "18kb", label: "Core bundle" },
      { value: "100", label: "Lighthouse a11y" },
    ],
    stack: ["React", "TypeScript", "Motion", "Tailwind", "Radix"],
    accent: "#d9ff4b",
    accentSoft: "#0f1200",
    link: "https://github.com/",
  },
  {
    id: "nocturne",
    index: "02",
    title: "Nocturne",
    year: "2025",
    category: "AI Product",
    role: "Co-founder & Design Engineer",
    blurb: "A quiet writing studio for screenwriters, built around flow instead of features.",
    description:
      "Nocturne pairs a distraction-free editor with a story-aware assistant that reads your whole script — not just the paragraph. I led the product design and built the front-end: an offline-first Next.js app with a custom text canvas, streaming suggestions and a timeline visualiser that makes structure feel tactile.",
    metrics: [
      { value: "0.4s", label: "Cold start" },
      { value: "9k", label: "Writers onboarded" },
      { value: "38%", label: "Retention lift" },
    ],
    stack: ["Next.js", "tRPC", "Postgres", "OpenAI", "Motion"],
    accent: "#9b8cff",
    accentSoft: "#0d0a1a",
    link: "https://example.com",
  },
  {
    id: "kite",
    index: "03",
    title: "Kite",
    year: "2025",
    category: "Fintech",
    role: "Lead Designer",
    blurb: "Banking for freelancers: cashflow you can actually read at a glance.",
    description:
      "Kite is a business account for independent workers. The redesign collapsed a twelve-tap invoicing flow into three, and introduced a forecast engine that shows the next 90 days of cash before you spend it. Shipped as a design system across iOS, Android and web.",
    metrics: [
      { value: "3 taps", label: "To invoice" },
      { value: "+52%", label: "Task success" },
      { value: "4.9★", label: "App Store" },
    ],
    stack: ["React Native", "Expo", "Figma", "D3", "Design Ops"],
    accent: "#5ce1c4",
    accentSoft: "#04120f",
    link: "https://example.com",
  },
  {
    id: "meridian",
    index: "04",
    title: "Meridian",
    year: "2024",
    category: "Brand & Web",
    role: "Art Direction + Build",
    blurb: "A portfolio for an architecture studio that moves the way their buildings don't.",
    description:
      "Meridian needed a site that felt like walking through one of their spaces. We built a scroll-driven WebGL gallery with slow parallax planes, a typographic system based on blueprint annotation, and a CMS the studio actually enjoys using. The result won an Awwwards Honourable Mention.",
    metrics: [
      { value: "2.1s", label: "LCP on 4G" },
      { value: "6", label: "Site awards" },
      { value: "×3", label: "Enquiries" },
    ],
    stack: ["Astro", "Three.js", "GSAP", "Sanity", "Figma"],
    accent: "#ff8a5c",
    accentSoft: "#150806",
    link: "https://example.com",
  },
  {
    id: "pulse",
    index: "05",
    title: "Pulse",
    year: "2024",
    category: "Data Visualisation",
    role: "Design Engineer",
    blurb: "Real-time observability for teams that hate dashboards made of numbers.",
    description:
      "Pulse turns eight million events a minute into a landscape you can feel. I designed and built a GPU-accelerated canvas engine that renders live traces at 60fps, with a spatial query tool that lets engineers lasso an anomaly instead of typing a query.",
    metrics: [
      { value: "60fps", label: "Live traces" },
      { value: "8M/min", label: "Events" },
      { value: "-41%", label: "Time to triage" },
    ],
    stack: ["React", "WebGL", "Rust WASM", "D3", "ClickHouse"],
    accent: "#ffd166",
    accentSoft: "#141004",
    link: "https://example.com",
  },
];

export const capabilities = [
  {
    index: "01",
    title: "Design",
    subtitle: "The thinking before the pixels",
    items: [
      "Art direction",
      "Interface design",
      "Motion & interaction",
      "Design systems",
      "Rapid prototyping",
      "Type & layout",
    ],
  },
  {
    index: "02",
    title: "Engineering",
    subtitle: "The part that has to hold up",
    items: [
      "React & Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Motion / GSAP",
      "WebGL & Canvas",
      "Performance & a11y",
    ],
  },
  {
    index: "03",
    title: "Tooling",
    subtitle: "A small, sharp kit",
    items: ["Figma", "Rive", "Blender", "Sanity", "Vercel", "Git & CI"],
  },
];

export const experience = [
  {
    role: "Independent Design Engineer",
    company: "Studio Ayaan",
    period: "2024 — Now",
    location: "Dhaka · Remote",
    description:
      "Design partner to venture-backed startups and studios. Full ownership from positioning and interface design to shipped front-end, motion systems and design ops.",
    tags: ["Design Engineering", "Product Strategy", "Motion"],
  },
  {
    role: "Senior Product Designer → Design Engineer",
    company: "Fieldnote",
    period: "2022 — 2024",
    location: "Berlin · Remote",
    description:
      "Led design for the collaboration suite used by 400k researchers. Rebuilt the editor's interaction model and shipped the company's first token-driven design system.",
    tags: ["Design Systems", "React", "Mentoring"],
  },
  {
    role: "Frontend Engineer",
    company: "Lumen Labs",
    period: "2020 — 2022",
    location: "Singapore · Hybrid",
    description:
      "Built data-heavy product surfaces and the marketing platform for an energy analytics startup. Cut bundle size 46% and introduced motion guidelines adopted company-wide.",
    tags: ["React", "TypeScript", "Data Visualisation"],
  },
  {
    role: "Freelance Designer & Developer",
    company: "Self-directed",
    period: "2018 — 2020",
    location: "Dhaka",
    description:
      "Twenty-plus identities, websites and small products for founders, musicians and non-profits. The years I learned to listen, scope and ship.",
    tags: ["Branding", "Web", "Client Work"],
  },
];

export const marqueeWords = [
  "Design engineering",
  "Motion systems",
  "Product interfaces",
  "Creative development",
  "Design systems",
  "Art direction",
];

export const clients = [
  "Fieldnote",
  "Kite",
  "Meridian Studio",
  "Nocturne",
  "Lumen Labs",
  "Northwind",
  "Atlas Type",
  "Pulse",
];

export const process = [
  {
    index: "01",
    title: "Understand",
    body: "Interviews, audits and a ruthless edit of the problem. We agree on what success looks like before a single frame is drawn.",
  },
  {
    index: "02",
    title: "Shape",
    body: "Fast, opinionated prototypes in the browser. Motion, hierarchy and copy explored together — decisions you can actually feel.",
  },
  {
    index: "03",
    title: "Ship",
    body: "Production front-end, documented systems and a handover that survives contact with the rest of your team.",
  },
];

export const navSections = [
  { id: "about", label: "About", index: "02" },
  { id: "work", label: "Work", index: "03" },
  { id: "craft", label: "Craft", index: "04" },
  { id: "path", label: "Path", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
];
