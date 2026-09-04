export type ContentItem = Record<string, unknown>;

export type SiteContent = {
  brand: {
    wordmark: string;
    bookingLink: string;
    nav: Array<{ label: string; href: string }>;
    headerCta: string;
  };
  hero: {
    eyebrow: string;
    heading: string[];
    lede: string;
    primaryCta: string;
    secondaryCta: string;
    proofbar: string[];
  };
  results: {
    eyebrow: string;
    heading: string[];
    intro: string;
    carouselLabel: string;
    carouselAria: string;
    beforeCaption: string;
    afterCaption: string;
    disclaimer: string;
    items: Array<{ label: string; category: string; image: string; before: string; after: string; note: string }>;
  };
  services: {
    eyebrow: string;
    heading: string[];
    intro: string;
    items: Array<{ number: string; title: string; copy: string }>;
  };
  interactive: {
    eyebrow: string;
    heading: string[];
    intro: string;
    hint: string;
    items: Array<{ label: string; accessibleLabel?: string; x: number; y: number; rotate: number; style: string; shape?: string }>;
  };
  caseStudies: {
    eyebrow: string;
    heading: string[];
    items: Array<{ title: string; image: string; tag: string; stages: string[]; note: string }>;
    testimonialEyebrow: string;
    testimonials: Array<{ quote: string; citation: string }>;
  };
  process: {
    eyebrow: string;
    heading: string[];
    intro: string;
    screenLabel: string;
    screenStatus: string;
    previewImage: string;
    previewAlt: string;
    previewStatus: string;
    items: Array<{ number: string; title: string; copy: string }>;
  };
  proofWall: {
    eyebrow: string;
    heading: string[];
    intro: string;
    items: Array<{ label: string; category: string; image: string; before: string; after: string; note: string }>;
  };
  leadResults: {
    eyebrow: string;
    heading: string[];
    intro: string;
    items: Array<{ metric: string; label: string; note: string }>;
    pipeline: string[];
    pipelineNote: string;
  };
  pricing: {
    eyebrow: string;
    heading: string[];
    intro: string;
    popularLabel: string;
    billingSuffix: string;
    cardCta: string;
    note: string;
    items: Array<{ name: string; volume: string; price: string; description: string; featured: boolean; features: string[] }>;
  };
  faq: {
    eyebrow: string;
    heading: string[];
    intro: string;
    items: Array<{ question: string; answer: string }>;
  };
  book: {
    eyebrow: string;
    heading: string[];
    intro: string;
    cta: string;
    email: string;
    backToTop: string;
    copyright: string;
  };
};

const proofItems: SiteContent["results"]["items"] = [
  { label: "Proof slot 01", category: "Audience growth", image: "/images/project-gallery/content-creation-1200.webp", before: "BEFORE", after: "AFTER", note: "Add the client's verified analytics screenshots here." },
  { label: "Proof slot 02", category: "Short-form reach", image: "/images/project-gallery/video-editing-1200.webp", before: "BEFORE", after: "AFTER", note: "Replace this visual with the approved reach comparison." },
  { label: "Proof slot 03", category: "Lead generation", image: "/images/project-gallery/ai-automation-1200.webp", before: "BEFORE", after: "AFTER", note: "Add the verified CRM or booked-call screenshot here." },
  { label: "Proof slot 04", category: "Content consistency", image: "/images/project-gallery/copy-writing-1200.webp", before: "BEFORE", after: "AFTER", note: "Show the old feed beside the new content system." },
  { label: "Proof slot 05", category: "Profile conversion", image: "/images/project-gallery/seo-1200.webp", before: "BEFORE", after: "AFTER", note: "Add the approved profile visit and conversion screenshots." },
  { label: "Proof slot 06", category: "Sales conversations", image: "/images/project-gallery/web-scraping-1200.webp", before: "BEFORE", after: "AFTER", note: "Use a redacted inbox or pipeline result screenshot." },
];

export const defaultContent: SiteContent = {
  brand: {
    wordmark: "INVICTI",
    bookingLink: "mailto:hello@invicti.agency?subject=Discovery%20Call%20Request",
    nav: [
      { label: "Services", href: "#services" },
      { label: "Results", href: "#results" },
      { label: "Process", href: "#process" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
    headerCta: "Book a call",
  },
  hero: {
    eyebrow: "Done-for-you content systems · Manila / worldwide",
    heading: ["TURN YOUR", "EXPERTISE INTO", "DEMAND."],
    lede: "We research, script, edit, publish and optimize short-form content that helps expert-led brands earn attention—and turn it into sales conversations.",
    primaryCta: "Book a discovery call",
    secondaryCta: "See client results",
    proofbar: ["", "", "", "", ""],
  },
  results: {
    eyebrow: "02 · Client before & after results",
    heading: ["PROOF", "BEFORE", "PROMISES."],
    intro: "Put the evidence where buyers can see it. This carousel is built for your approved analytics, feed transformations, inbox wins and pipeline screenshots.",
    carouselLabel: "Swipe through the proof library",
    carouselAria: "Continuously moving client proof carousel. Hover or focus to pause.",
    beforeCaption: "Baseline screenshot",
    afterCaption: "Verified result",
    disclaimer: "Proof placeholders are intentionally labeled. Replace them with approved, redacted client screenshots before launch.",
    items: proofItems,
  },
  services: {
    eyebrow: "03 · The service",
    heading: ["YOUR CONTENT", "DEPARTMENT,", "WITHOUT THE HIRING."],
    intro: "One senior, connected system from idea to upload. No pile of disconnected freelancers. No half-finished content calendar. No wondering what gets published next.",
    items: [
      { number: "01", title: "Strategy that finds the angle", copy: "We research your market, audience, offer and competitors, then turn the useful tension into a content direction your buyers can recognize." },
      { number: "02", title: "Scripts built to hold attention", copy: "Hooks, stories, authority posts and sales-led scripts—written in your voice and mapped to the questions buyers ask before they book." },
      { number: "03", title: "Production without the chaos", copy: "We guide filming, edit every asset, add captions and platform-native pacing, then manage feedback without drowning you in revisions." },
      { number: "04", title: "Publishing that compounds", copy: "We upload, optimize, repurpose and report so your content keeps moving while you stay focused on delivery and sales." },
    ],
  },
  interactive: {
    eyebrow: "Interactive content system",
    heading: ["STRATEGY", "YOU CAN", "FEEL."],
    intro: "Drag the ingredients. Every strong content engine needs all of them working together.",
    hint: "Drag / throw / use arrow keys",
    items: [
      { label: "RESEARCH", x: 18, y: 14, rotate: -8, style: "solid" },
      { label: "HOOKS", x: 48, y: 7, rotate: 6, style: "outline" },
      { label: "STORY", x: 79, y: 18, rotate: -4, style: "glass" },
      { label: "PROOF", x: 28, y: 42, rotate: 5, style: "glass" },
      { label: "OFFER", x: 68, y: 47, rotate: -7, style: "solid" },
      { label: "CTA", x: 15, y: 68, rotate: 4, style: "outline small" },
      { label: "DATA", x: 53, y: 71, rotate: -4, style: "solid small" },
      { label: "✦", accessibleLabel: "Content spark", x: 87, y: 68, rotate: 0, style: "glass symbol", shape: "circle" },
    ],
  },
  caseStudies: {
    eyebrow: "04 · Case studies",
    heading: ["THE STORY", "BEHIND THE RESULT."],
    items: [
      { title: "From scattered posting to a repeatable authority system", image: "/images/invicti-strategy.webp", tag: "Strategy + content operations", stages: ["Challenge", "System", "Verified outcome"], note: "Case-study copy and proof slot" },
      { title: "From slow production to a monthly short-form engine", image: "/images/invicti-motion.webp", tag: "Scripting + production", stages: ["Challenge", "System", "Verified outcome"], note: "Case-study copy and proof slot" },
      { title: "From attention to tracked sales conversations", image: "/images/invicti-portal.webp", tag: "Publishing + lead flow", stages: ["Challenge", "System", "Verified outcome"], note: "Case-study copy and proof slot" },
    ],
    testimonialEyebrow: "Client words",
    testimonials: [1, 2, 3].map(() => ({ quote: "Add an approved client quote about the process, the experience and the business impact.", citation: "Client name · Company · permission confirmed" })),
  },
  process: {
    eyebrow: "05 · How we work together",
    heading: ["ONE SYSTEM.", "SIX CLEAR", "MOVES."],
    intro: "Each cycle turns what you know into strategic content, then turns performance data into the next sharper cycle.",
    screenLabel: "INVICTI / CONTENT OS",
    screenStatus: "Cycle 01 · Active",
    previewImage: "/images/project-gallery/video-editing-1200.webp",
    previewAlt: "A video editing workspace used as a process preview",
    previewStatus: "04: Edit in progress",
    items: [
      { number: "01", title: "Research", copy: "Audience, offer, category and competitor analysis." },
      { number: "02", title: "Script", copy: "Monthly content map, hooks, stories and conversion angles." },
      { number: "03", title: "Film", copy: "Simple recording guidance, shot lists and batching support." },
      { number: "04", title: "Edit", copy: "Platform-native pacing, captions, sound and visual polish." },
      { number: "05", title: "Upload", copy: "Scheduling, metadata, captions and quality control." },
      { number: "06", title: "Optimize", copy: "Reporting, iteration and more of what earns attention." },
    ],
  },
  proofWall: {
    eyebrow: "06 · More before & after results",
    heading: ["THE RECEIPTS", "KEEP GOING."],
    intro: "Use this proof wall for the volume the brief calls for—content performance, profile growth, feed transformations and direct client messages.",
    items: [...proofItems, ...proofItems.slice(0, 2)],
  },
  leadResults: {
    eyebrow: "07 · Client lead results",
    heading: ["ATTENTION IS", "ONLY HALF", "THE JOB."],
    intro: "Show the bridge from content to commercial outcome: qualified inquiries, booked calls, pipeline and reply-to-call conversion.",
    items: [
      { metric: "+XX", label: "qualified leads", note: "Insert verified CRM total" },
      { metric: "XX", label: "calls booked", note: "Insert calendar screenshot" },
      { metric: "X.X×", label: "return on content", note: "Insert source calculation" },
      { metric: "XX%", label: "reply-to-call rate", note: "Insert verified pipeline data" },
    ],
    pipeline: ["Content", "Qualified attention", "Conversation", "Booked call"],
    pipelineNote: "Connect screenshots to source data so every claim is credible and easy to verify.",
  },
  pricing: {
    eyebrow: "08 · Packages",
    heading: ["A CONTENT TEAM", "FOR LESS THAN", "ONE FULL-TIME HIRE."],
    intro: "Clear starting points. Final scope, platforms and cadence are confirmed after the discovery call.",
    popularLabel: "Most popular",
    billingSuffix: "/ month",
    cardCta: "Book a call",
    note: "Prices are starting points in USD and exclude paid media, travel, specialist production and third-party fees.",
    items: [
      { name: "Grow", volume: "15 shorts / month", price: "$2,795", description: "For founders building a consistent authority engine.", featured: false, features: ["Onboarding + review calls", "Research and scripting", "Editing and uploading", "7 sales-focused stories", "Weekday email support", "Monthly performance report", "Profile optimization checklist"] },
      { name: "Scale", volume: "20 shorts / month", price: "$3,295", description: "For teams ready to turn attention into pipeline.", featured: true, features: ["Everything in Grow", "More weekly publishing volume", "10 sales-focused stories", "Priority edit queue", "Monthly strategy workshop", "Conversion-led content testing", "Profile optimization checklist"] },
      { name: "Dominate", volume: "30 shorts / month", price: "$4,295", description: "For brands that want an always-on content department.", featured: false, features: ["Everything in Scale", "30 shorts every month", "15 sales-focused stories", "Multi-platform publishing", "Advanced reporting", "Fastest turnaround", "Profile optimization checklist"] },
    ],
  },
  faq: {
    eyebrow: "09 · Frequently asked",
    heading: ["ASK", "THE HARD", "QUESTIONS."],
    intro: "Clear scope. Honest expectations. No mystery around what happens next.",
    items: [
      { question: "What exactly is done for us?", answer: "We own the content system from research and strategy through scripting, editing, uploading and reporting. You remain the subject-matter expert; we make sure the expertise consistently reaches the market." },
      { question: "Who is this service best for?", answer: "Founder-led businesses, coaches, consultants, agencies and expert brands with a proven offer who want content to support authority, inbound demand and sales conversations." },
      { question: "How much time will you need from me?", answer: "Most clients batch their recording. Expect an onboarding session, one focused filming block per cycle, and a concise review window. The exact rhythm is agreed before work begins." },
      { question: "Do I need professional filming equipment?", answer: "No. A modern phone, clear audio and good lighting are enough for most formats. We provide a practical setup and shot guide, and can work with an existing studio or production team when needed." },
      { question: "Can you work with footage we already have?", answer: "Yes. We can audit and repurpose an existing library, then identify what is missing. Footage quality and usable volume are reviewed during discovery." },
      { question: "Which platforms do you manage?", answer: "The core system is built for short-form platforms such as Instagram, TikTok, YouTube Shorts and LinkedIn. Your package and strategy determine where we publish and how each asset is adapted." },
      { question: "Do you post the content for us?", answer: "Yes, uploading and optimization are included where account access and platform permissions allow it. We use an agreed approval workflow before anything goes live." },
      { question: "Can you guarantee views, followers or leads?", answer: "No credible partner can guarantee platform distribution or revenue. We guarantee the agreed deliverables, a clear operating process and decisions grounded in performance data—not fabricated promises." },
      { question: "When can we expect to see results?", answer: "The first cycle establishes the baseline and tests angles. Meaningful patterns usually emerge over multiple publishing cycles; speed depends on your offer, audience, starting point and sales follow-up." },
      { question: "How many revisions are included?", answer: "Each package includes a defined review round for scripts and edits. We align on voice and visual rules early so feedback gets lighter over time. Additional rounds can be scoped when needed." },
      { question: "Who owns the finished content?", answer: "Once invoices are paid, you can use the approved final deliverables across your owned channels. Raw footage, project files, licensed assets and third-party materials are handled according to the final agreement." },
      { question: "Is there a long-term commitment?", answer: "We recommend enough runway to learn and improve, but the exact initial term, renewal and notice period are confirmed in your proposal before you sign." },
      { question: "Are paid ads or media spend included?", answer: "No. These packages cover the organic content system. Paid distribution, ad management, creator fees, travel and specialist production can be added as a separate scope." },
      { question: "How do approvals and reporting work?", answer: "You receive a clear review window and one place for feedback. Reporting covers output, reach, retention, engagement and conversion signals that are available and relevant to your goals." },
      { question: "Can you match our existing brand voice?", answer: "Yes. We begin with source material, interviews and examples, then build a practical voice guide. Nothing is published until the working voice and approval process are aligned." },
      { question: "What happens on the discovery call?", answer: "We review your offer, audience, current content, bottleneck and goals. If the fit is strong, we recommend a package and next steps. If it is not, we will say so plainly." },
    ],
  },
  book: {
    eyebrow: "10 · Your next move",
    heading: ["LET’S BUILD THE", "CONTENT SYSTEM", "YOUR SALES TEAM WANTS."],
    intro: "Bring your offer, your current content and the bottleneck. Leave with a clear recommendation—even if we are not the right fit.",
    cta: "Book a discovery call",
    email: "hello@invicti.agency",
    backToTop: "Back to top ↑",
    copyright: "INVICTI",
  },
};

export const cloneContent = (content: SiteContent = defaultContent): SiteContent => JSON.parse(JSON.stringify(content)) as SiteContent;
