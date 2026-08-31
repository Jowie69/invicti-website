import { useEffect, useRef, useState, type ReactNode } from "react";

const BOOKING_LINK = "mailto:hello@invicti.agency?subject=Discovery%20Call%20Request";

type ResultCard = {
  label: string;
  category: string;
  image: string;
  before: string;
  after: string;
  note: string;
};

const results: ResultCard[] = [
  { label: "Proof slot 01", category: "Audience growth", image: "/images/project-gallery/content-creation-1200.webp", before: "BEFORE", after: "AFTER", note: "Add the client's verified analytics screenshots here." },
  { label: "Proof slot 02", category: "Short-form reach", image: "/images/project-gallery/video-editing-1200.webp", before: "BEFORE", after: "AFTER", note: "Replace this visual with the approved reach comparison." },
  { label: "Proof slot 03", category: "Lead generation", image: "/images/project-gallery/ai-automation-1200.webp", before: "BEFORE", after: "AFTER", note: "Add the verified CRM or booked-call screenshot here." },
  { label: "Proof slot 04", category: "Content consistency", image: "/images/project-gallery/copy-writing-1200.webp", before: "BEFORE", after: "AFTER", note: "Show the old feed beside the new content system." },
  { label: "Proof slot 05", category: "Profile conversion", image: "/images/project-gallery/seo-1200.webp", before: "BEFORE", after: "AFTER", note: "Add the approved profile visit and conversion screenshots." },
  { label: "Proof slot 06", category: "Sales conversations", image: "/images/project-gallery/web-scraping-1200.webp", before: "BEFORE", after: "AFTER", note: "Use a redacted inbox or pipeline result screenshot." },
];

const services = [
  { number: "01", title: "Strategy that finds the angle", copy: "We research your market, audience, offer and competitors, then turn the useful tension into a content direction your buyers can recognize." },
  { number: "02", title: "Scripts built to hold attention", copy: "Hooks, stories, authority posts and sales-led scripts—written in your voice and mapped to the questions buyers ask before they book." },
  { number: "03", title: "Production without the chaos", copy: "We guide filming, edit every asset, add captions and platform-native pacing, then manage feedback without drowning you in revisions." },
  { number: "04", title: "Publishing that compounds", copy: "We upload, optimize, repurpose and report so your content keeps moving while you stay focused on delivery and sales." },
];

const process = [
  { number: "01", title: "Research", copy: "Audience, offer, category and competitor analysis." },
  { number: "02", title: "Script", copy: "Monthly content map, hooks, stories and conversion angles." },
  { number: "03", title: "Film", copy: "Simple recording guidance, shot lists and batching support." },
  { number: "04", title: "Edit", copy: "Platform-native pacing, captions, sound and visual polish." },
  { number: "05", title: "Upload", copy: "Scheduling, metadata, captions and quality control." },
  { number: "06", title: "Optimize", copy: "Reporting, iteration and more of what earns attention." },
];

const leadResults = [
  { metric: "+XX", label: "qualified leads", note: "Insert verified CRM total" },
  { metric: "XX", label: "calls booked", note: "Insert calendar screenshot" },
  { metric: "X.X×", label: "return on content", note: "Insert source calculation" },
  { metric: "XX%", label: "reply-to-call rate", note: "Insert verified pipeline data" },
];

const packages = [
  {
    name: "Grow",
    volume: "15 shorts / month",
    price: "$2,795",
    description: "For founders building a consistent authority engine.",
    features: ["Onboarding + review calls", "Research and scripting", "Editing and uploading", "7 sales-focused stories", "Weekday email support", "Monthly performance report", "Profile optimization checklist"],
  },
  {
    name: "Scale",
    volume: "20 shorts / month",
    price: "$3,295",
    description: "For teams ready to turn attention into pipeline.",
    featured: true,
    features: ["Everything in Grow", "More weekly publishing volume", "10 sales-focused stories", "Priority edit queue", "Monthly strategy workshop", "Conversion-led content testing", "Profile optimization checklist"],
  },
  {
    name: "Dominate",
    volume: "30 shorts / month",
    price: "$4,295",
    description: "For brands that want an always-on content department.",
    features: ["Everything in Scale", "30 shorts every month", "15 sales-focused stories", "Multi-platform publishing", "Advanced reporting", "Fastest turnaround", "Profile optimization checklist"],
  },
];

const faqs = [
  ["What exactly is done for us?", "We own the content system from research and strategy through scripting, editing, uploading and reporting. You remain the subject-matter expert; we make sure the expertise consistently reaches the market."],
  ["Who is this service best for?", "Founder-led businesses, coaches, consultants, agencies and expert brands with a proven offer who want content to support authority, inbound demand and sales conversations."],
  ["How much time will you need from me?", "Most clients batch their recording. Expect an onboarding session, one focused filming block per cycle, and a concise review window. The exact rhythm is agreed before work begins."],
  ["Do I need professional filming equipment?", "No. A modern phone, clear audio and good lighting are enough for most formats. We provide a practical setup and shot guide, and can work with an existing studio or production team when needed."],
  ["Can you work with footage we already have?", "Yes. We can audit and repurpose an existing library, then identify what is missing. Footage quality and usable volume are reviewed during discovery."],
  ["Which platforms do you manage?", "The core system is built for short-form platforms such as Instagram, TikTok, YouTube Shorts and LinkedIn. Your package and strategy determine where we publish and how each asset is adapted."],
  ["Do you post the content for us?", "Yes, uploading and optimization are included where account access and platform permissions allow it. We use an agreed approval workflow before anything goes live."],
  ["Can you guarantee views, followers or leads?", "No credible partner can guarantee platform distribution or revenue. We guarantee the agreed deliverables, a clear operating process and decisions grounded in performance data—not fabricated promises."],
  ["When can we expect to see results?", "The first cycle establishes the baseline and tests angles. Meaningful patterns usually emerge over multiple publishing cycles; speed depends on your offer, audience, starting point and sales follow-up."],
  ["How many revisions are included?", "Each package includes a defined review round for scripts and edits. We align on voice and visual rules early so feedback gets lighter over time. Additional rounds can be scoped when needed."],
  ["Who owns the finished content?", "Once invoices are paid, you can use the approved final deliverables across your owned channels. Raw footage, project files, licensed assets and third-party materials are handled according to the final agreement."],
  ["Is there a long-term commitment?", "We recommend enough runway to learn and improve, but the exact initial term, renewal and notice period are confirmed in your proposal before you sign."],
  ["Are paid ads or media spend included?", "No. These packages cover the organic content system. Paid distribution, ad management, creator fees, travel and specialist production can be added as a separate scope."],
  ["How do approvals and reporting work?", "You receive a clear review window and one place for feedback. Reporting covers output, reach, retention, engagement and conversion signals that are available and relevant to your goals."],
  ["Can you match our existing brand voice?", "Yes. We begin with source material, interviews and examples, then build a practical voice guide. Nothing is published until the working voice and approval process are aligned."],
  ["What happens on the discovery call?", "We review your offer, audience, current content, bottleneck and goals. If the fit is strong, we recommend a package and next steps. If it is not, we will say so plainly."],
];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function BookCall({ light = false, label = "Book a call" }: { light?: boolean; label?: string }) {
  return <a className={`cta-pill${light ? " light" : ""}`} href="#book-call">{label}<span>↗</span></a>;
}

function ResultsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: number) => {
    trackRef.current?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.76, 720), behavior: "smooth" });
  };

  return (
    <div className="results-carousel">
      <div className="carousel-toolbar">
        <p>Swipe through the proof library</p>
        <div><button type="button" onClick={() => move(-1)} aria-label="Previous result">←</button><button type="button" onClick={() => move(1)} aria-label="Next result">→</button></div>
      </div>
      <div className="results-track" ref={trackRef}>
        {results.map((result, index) => (
          <article className="result-card" key={result.label}>
            <div className="result-image"><img src={result.image} alt="" loading={index > 1 ? "lazy" : "eager"} /><span>{result.label}</span></div>
            <div className="result-copy">
              <p>{result.category}</p>
              <div className="before-after"><span>{result.before}<small>Baseline screenshot</small></span><b>→</b><span>{result.after}<small>Verified result</small></span></div>
              <em>{result.note}</em>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Scene() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="INVICTI home">INVICTI<span>®</span></a>
        <nav className={menuOpen ? "site-nav open" : "site-nav"} aria-label="Primary navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#results" onClick={() => setMenuOpen(false)}>Results</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>Process</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        </nav>
        <a className="header-cta" href="#book-call">Book a call <span>↗</span></a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? "×" : "Menu"}</button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-media" aria-hidden="true">
            {results.slice(0, 5).map((result, index) => <div className={`hero-tile tile-${index + 1}`} key={result.label}><img src={result.image} alt="" /></div>)}
            <div className="hero-glow" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Done-for-you content systems · Manila / worldwide</p>
            <h1>TURN YOUR<br />EXPERTISE INTO<br /><span>DEMAND.</span></h1>
            <p className="hero-lede">We research, script, edit, publish and optimize short-form content that helps expert-led brands earn attention—and turn it into sales conversations.</p>
            <div className="hero-actions"><BookCall label="Book a discovery call" /><a className="text-link" href="#results">See client results <span>↓</span></a></div>
          </div>
          <div className="hero-proofbar">
            <span>Strategy</span><span>Scripting</span><span>Editing</span><span>Publishing</span><span>Reporting</span>
          </div>
        </section>

        <section className="results-section" id="results">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">02 · Client before & after results</p><h2>PROOF<br />BEFORE<br />PROMISES.</h2></div>
            <div><p>Put the evidence where buyers can see it. This carousel is built for your approved analytics, feed transformations, inbox wins and pipeline screenshots.</p><BookCall light /></div>
          </div>
          <ResultsCarousel />
          <p className="proof-disclaimer">Proof placeholders are intentionally labeled. Replace them with approved, redacted client screenshots before launch.</p>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">03 · The service</p><h2>YOUR CONTENT<br />DEPARTMENT,<br /><span>WITHOUT THE HIRING.</span></h2></div>
            <div><p>One senior, connected system from idea to upload. No pile of disconnected freelancers. No half-finished content calendar. No wondering what gets published next.</p><BookCall /></div>
          </div>
          <div className="service-list">
            {services.map((service) => <Reveal key={service.number}><article className="service-row"><span>{service.number}</span><h3>{service.title}</h3><p>{service.copy}</p><i>↗</i></article></Reveal>)}
          </div>
        </section>

        <section className="case-studies-section" id="case-studies">
          <div className="section-heading"><p className="eyebrow">04 · Case studies</p><h2>THE STORY<br />BEHIND THE RESULT.</h2><BookCall light /></div>
          <div className="case-grid">
            {[
              { title: "From scattered posting to a repeatable authority system", image: "/images/invicti-strategy.webp", tag: "Strategy + content operations" },
              { title: "From slow production to a monthly short-form engine", image: "/images/invicti-motion.webp", tag: "Scripting + production" },
              { title: "From attention to tracked sales conversations", image: "/images/invicti-portal.webp", tag: "Publishing + lead flow" },
            ].map((study, index) => <article className={`case-panel case-${index + 1}`} key={study.title}><img src={study.image} alt="" loading="lazy" /><div className="case-overlay"><p>{study.tag}</p><h3>{study.title}</h3><div><span>Challenge</span><span>System</span><span>Verified outcome</span></div><em>Case-study copy and proof slot</em></div></article>)}
          </div>
          <div className="testimonial-strip" aria-label="Testimonials">
            <p className="eyebrow">Client words</p>
            {[1, 2, 3].map((item) => <blockquote key={item}><span>“</span><p>Add an approved client quote about the process, the experience and the business impact.</p><cite>Client name · Company · permission confirmed</cite></blockquote>)}
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="process-copy">
            <p className="eyebrow">05 · How we work together</p>
            <h2>ONE SYSTEM.<br />SIX CLEAR<br />MOVES.</h2>
            <p>Each cycle turns what you know into strategic content, then turns performance data into the next sharper cycle.</p>
            <BookCall />
          </div>
          <div className="process-visual">
            <div className="process-screen">
              <div className="screen-top"><span>INVICTI / CONTENT OS</span><i>Cycle 01 · Active</i></div>
              <div className="screen-preview"><img src="/images/project-gallery/video-editing-1200.webp" alt="A video editing workspace used as a process preview" loading="lazy" /><span>04: Edit in progress</span></div>
              <div className="screen-timeline">{process.map((step, index) => <span key={step.number} style={{ width: `${12 + index * 3}%` }} />)}</div>
            </div>
            <div className="process-steps">{process.map((step) => <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}</div>
          </div>
        </section>

        <section className="more-results-section" id="more-results">
          <div className="section-heading split-heading"><div><p className="eyebrow">06 · More before & after results</p><h2>THE RECEIPTS<br />KEEP GOING.</h2></div><div><p>Use this proof wall for the volume the brief calls for—content performance, profile growth, feed transformations and direct client messages.</p><BookCall /></div></div>
          <div className="proof-wall">
            {results.concat(results.slice(0, 2)).map((result, index) => <article key={`${result.label}-${index}`}><img src={result.image} alt="" loading="lazy" /><div><span>{String(index + 1).padStart(2, "0")}</span><b>{index % 2 === 0 ? "Before → after" : "Client result"}</b><small>Verified screenshot slot</small></div></article>)}
          </div>
        </section>

        <section className="lead-results-section" id="lead-results">
          <div className="lead-intro"><p className="eyebrow">07 · Client lead results</p><h2>ATTENTION IS<br />ONLY HALF<br />THE JOB.</h2><p>Show the bridge from content to commercial outcome: qualified inquiries, booked calls, pipeline and reply-to-call conversion.</p><BookCall light /></div>
          <div className="metrics-grid">{leadResults.map((result) => <article key={result.label}><strong>{result.metric}</strong><span>{result.label}</span><small>{result.note}</small></article>)}</div>
          <div className="pipeline-card"><div><span>Content</span><i>→</i><span>Qualified attention</span><i>→</i><span>Conversation</span><i>→</i><span>Booked call</span></div><p>Connect screenshots to source data so every claim is credible and easy to verify.</p></div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="section-heading split-heading"><div><p className="eyebrow">08 · Packages</p><h2>A CONTENT TEAM<br />FOR LESS THAN<br />ONE FULL-TIME HIRE.</h2></div><div><p>Clear starting points. Final scope, platforms and cadence are confirmed after the discovery call.</p><BookCall /></div></div>
          <div className="pricing-grid">
            {packages.map((plan) => <article className={plan.featured ? "price-card featured" : "price-card"} key={plan.name}>{plan.featured && <span className="popular">Most popular</span>}<header><p>{plan.name}</p><span>{plan.volume}</span></header><h3>{plan.price}<small>/ month</small></h3><p>{plan.description}</p><ul>{plan.features.map((feature) => <li key={feature}><span>＋</span>{feature}</li>)}</ul><a href={BOOKING_LINK}>Book a call <span>↗</span></a></article>)}
          </div>
          <p className="pricing-note">Prices are starting points in USD and exclude paid media, travel, specialist production and third-party fees.</p>
        </section>

        <section className="faq-section" id="faq">
          <div className="faq-sticky"><p className="eyebrow">09 · Frequently asked</p><h2>ASK<br />THE HARD<br />QUESTIONS.</h2><p>Clear scope. Honest expectations. No mystery around what happens next.</p><BookCall /></div>
          <div className="faq-list">{faqs.map(([question, answer], index) => <article className={activeFaq === index ? "open" : ""} key={question}><button type="button" onClick={() => setActiveFaq(activeFaq === index ? null : index)} aria-expanded={activeFaq === index}><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><i>{activeFaq === index ? "−" : "+"}</i></button><div className="faq-answer"><p>{answer}</p></div></article>)}</div>
        </section>

        <section className="book-section" id="book-call">
          <div className="book-orbit" aria-hidden="true"><span /><span /><span /></div>
          <p className="eyebrow">10 · Your next move</p>
          <h2>LET’S BUILD THE<br />CONTENT SYSTEM<br /><span>YOUR SALES TEAM WANTS.</span></h2>
          <p>Bring your offer, your current content and the bottleneck. Leave with a clear recommendation—even if we are not the right fit.</p>
          <a className="book-button" href={BOOKING_LINK}>Book a discovery call <span>↗</span></a>
          <footer><span>© {new Date().getFullYear()} INVICTI</span><a href="mailto:hello@invicti.agency">hello@invicti.agency</a><a href="#top">Back to top ↑</a></footer>
        </section>
      </main>
    </div>
  );
}
