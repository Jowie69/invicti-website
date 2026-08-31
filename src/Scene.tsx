import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { Bodies, Body, Composite, Constraint, Engine, Sleeping, Vector, type IBodyDefinition, type Body as MatterBody, type Constraint as MatterConstraint } from "matter-js";

const BOOKING_LINK = "mailto:hello@invicti.agency?subject=Discovery%20Call%20Request";
const compactImage = (source: string) => source.replace("-1200.webp", "-640.webp");

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

function KaraokeText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const wordElements = Array.from(element.querySelectorAll<HTMLElement>(".karaoke-word"));
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const start = window.innerHeight * 0.96;
        const end = window.innerHeight * 0.7;
        const progress = Math.max(0, Math.min(1, (start - elementCenter) / (start - end)));
        wordElements.forEach((word, index) => {
          const wordProgress = Math.max(0, Math.min(1, (progress - index / wordElements.length) * wordElements.length));
          word.style.setProperty("--wp", `${wordProgress}`);
        });
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const words = text.split(" ");
  return (
    <span ref={ref} className={`karaoke-text ${className}`} aria-label={text}>
      {words.map((word, index) => {
        return <span className="karaoke-word" key={`${word}-${index}`} style={{ "--wp": 0 } as CSSProperties}>{word}{index < words.length - 1 ? " " : ""}</span>;
      })}
    </span>
  );
}

function KineticHeading({ lines, hero = false, accentLine = -1 }: { lines: string[]; hero?: boolean; accentLine?: number }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add("kinetic-visible");
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const content = lines.map((line, lineIndex) => (
    <span className={`kinetic-line${lineIndex === accentLine ? " accent" : ""}`} key={line}>
      {line.split(" ").map((word, wordIndex) => (
        <span className="kinetic-word-mask" key={`${word}-${wordIndex}`}>
          <span className="kinetic-word" style={{ "--word-delay": `${(lineIndex * 3 + wordIndex) * 70}ms` } as CSSProperties}>{word}</span>
        </span>
      ))}
    </span>
  ));

  return hero ? <h1 ref={ref}>{content}</h1> : <h2 ref={ref}>{content}</h2>;
}

function PortalField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let frame = 0, width = 0, height = 0, dpr = 1, visible = false, lastDraw = 0;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = Array.from({ length: 58 }, (_, index) => ({
      angle: (index / 58) * Math.PI * 2 + Math.sin(index * 8.73),
      radius: 0.14 + ((index * 37) % 82) / 100,
      size: 0.45 + ((index * 19) % 13) / 8,
      speed: 0.3 + ((index * 11) % 17) / 20,
    }));
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const pointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 92;
      targetY = (event.clientY / window.innerHeight - 0.5) * 68;
    };
    const draw = (time: number) => {
      if (!visible) return;
      if (!reducedMotion && time - lastDraw < 33) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      ctx.clearRect(0, 0, width, height);
      const t = reducedMotion ? 0 : time * 0.0002;
      mouseX += (targetX - mouseX) * 0.055;
      mouseY += (targetY - mouseY) * 0.055;
      const cx = width * 0.5 + mouseX, cy = height * 0.5 + mouseY, unit = Math.min(width, height);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * 0.62);
      glow.addColorStop(0, "rgba(209,196,255,.25)");
      glow.addColorStop(0.18, "rgba(117,82,255,.13)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.16 + mouseX * 0.0008);
      stars.forEach((star, index) => {
        const pulse = 0.84 + Math.sin(t * 5 * star.speed + index) * 0.12;
        const radius = star.radius * unit * 0.53 * pulse;
        const angle = star.angle + t * star.speed;
        const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius * 0.58;
        if (index % 4 === 0) {
          ctx.beginPath();
          ctx.moveTo(x * 0.18, y * 0.18);
          ctx.lineTo(x, y);
          ctx.strokeStyle = "rgba(212,202,255,.08)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = index % 11 === 0 ? "rgba(255,96,79,.9)" : `rgba(244,240,255,${0.25 + star.size * 0.12})`;
        ctx.shadowColor = index % 11 === 0 ? "#ff604f" : "#8f6fff";
        ctx.shadowBlur = star.size * 7;
        ctx.fill();
      });
      ctx.restore();
      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", pointer, { passive: true });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      window.cancelAnimationFrame(frame);
      if (visible) frame = window.requestAnimationFrame(draw);
    }, { rootMargin: "120px 0px", threshold: 0.01 });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
    };
  }, []);

  return <canvas className={`portal-field ${className}`} ref={canvasRef} aria-hidden="true" />;
}

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

const systemItems = [
  { label: "RESEARCH", x: 18, y: 14, rotate: -8, style: "solid" },
  { label: "HOOKS", x: 48, y: 7, rotate: 6, style: "outline" },
  { label: "STORY", x: 79, y: 18, rotate: -4, style: "glass" },
  { label: "PROOF", x: 28, y: 42, rotate: 5, style: "glass" },
  { label: "OFFER", x: 68, y: 47, rotate: -7, style: "solid" },
  { label: "CTA", x: 15, y: 68, rotate: 4, style: "outline small" },
  { label: "DATA", x: 53, y: 71, rotate: -4, style: "solid small" },
  { label: "✦", accessibleLabel: "Content spark", x: 87, y: 68, rotate: 0, style: "glass symbol", shape: "circle" },
] as const;

type LabPhysics = {
  engine: Engine;
  bodies: MatterBody[];
  dragConstraint: MatterConstraint | null;
  width: number;
  height: number;
};

function InteractiveSystemLab() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const physicsRef = useRef<LabPhysics | null>(null);
  const frameRef = useRef<number | null>(null);
  const activePointerRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = Engine.create({ enableSleeping: true });
    engine.positionIterations = 12;
    engine.velocityIterations = 10;
    engine.constraintIterations = 4;
    engine.gravity.y = reducedMotion ? 0 : 0.78;
    let visible = false;
    let lastTime = performance.now();
    let resizeFrame = 0;

    const buildWorld = () => {
      const width = container.clientWidth, height = container.clientHeight;
      if (!width || !height) return;
      const previous = physicsRef.current;
      const previousPositions = previous?.bodies.map((body) => ({ x: body.position.x / previous.width, y: body.position.y / previous.height }));
      Composite.clear(engine.world, false, true);
      const wall = 96;
      Composite.add(engine.world, [
        Bodies.rectangle(width / 2, height + wall / 2, width + wall * 2, wall, { isStatic: true }),
        Bodies.rectangle(width / 2, -wall / 2, width + wall * 2, wall, { isStatic: true }),
        Bodies.rectangle(-wall / 2, height / 2, wall, height + wall * 2, { isStatic: true }),
        Bodies.rectangle(width + wall / 2, height / 2, wall, height + wall * 2, { isStatic: true }),
      ]);
      const bodies = itemRefs.current.map((element, index) => {
        const item = systemItems[index];
        const itemWidth = element?.offsetWidth ?? 180, itemHeight = element?.offsetHeight ?? 72;
        const saved = previousPositions?.[index];
        const x = Math.max(itemWidth / 2 + 2, Math.min(width - itemWidth / 2 - 2, (saved?.x ?? item.x / 100) * width));
        const y = Math.max(itemHeight / 2 + 2, Math.min(height - itemHeight / 2 - 2, (saved?.y ?? item.y / 100) * height));
        const options: IBodyDefinition = { angle: item.rotate * Math.PI / 180, density: 0.0018, friction: 0.18, frictionStatic: 0.45, frictionAir: reducedMotion ? 0.09 : 0.012, restitution: 0.58, sleepThreshold: 55 };
        return "shape" in item && item.shape === "circle"
          ? Bodies.circle(x, y, itemWidth / 2, options)
          : Bodies.rectangle(x, y, itemWidth, itemHeight, { ...options, chamfer: { radius: Math.min(itemHeight / 2, 44) } });
      });
      Composite.add(engine.world, bodies);
      physicsRef.current = { engine, bodies, dragConstraint: null, width, height };
    };

    const render = (time: number) => {
      if (!visible) { frameRef.current = null; return; }
      Engine.update(engine, Math.min(16.667, time - lastTime));
      physicsRef.current?.bodies.forEach((body, index) => {
        const element = itemRefs.current[index];
        if (!element) return;
        element.style.left = `${body.position.x}px`;
        element.style.top = `${body.position.y}px`;
        element.style.transform = `translate3d(-50%,-50%,0) rotate(${body.angle}rad)`;
      });
      lastTime = time;
      frameRef.current = window.requestAnimationFrame(render);
    };

    buildWorld();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastTime = performance.now();
      if (visible && frameRef.current === null) frameRef.current = window.requestAnimationFrame(render);
      if (!visible && frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    }, { threshold: 0.05 });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(() => { window.cancelAnimationFrame(resizeFrame); resizeFrame = window.requestAnimationFrame(buildWorld); });
    resizeObserver.observe(container);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.cancelAnimationFrame(resizeFrame);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      Engine.clear(engine);
      Composite.clear(engine.world, false, true);
      physicsRef.current = null;
    };
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>, index: number) => {
    const physics = physicsRef.current, rect = containerRef.current?.getBoundingClientRect(), body = physics?.bodies[index];
    if (!physics || !rect || !body) return;
    event.preventDefault();
    activePointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("dragging");
    Sleeping.set(body, false);
    const worldPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const dragConstraint = Constraint.create({ pointA: worldPoint, bodyB: body, pointB: Vector.rotate(Vector.sub(worldPoint, body.position), -body.angle), stiffness: 0.22, damping: 0.12, length: 0 });
    physics.dragConstraint = dragConstraint;
    Composite.add(physics.engine.world, dragConstraint);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const physics = physicsRef.current, rect = containerRef.current?.getBoundingClientRect();
    if (!physics?.dragConstraint || !rect || activePointerRef.current !== event.pointerId) return;
    event.preventDefault();
    physics.dragConstraint.pointA.x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    physics.dragConstraint.pointA.y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const physics = physicsRef.current;
    if (physics?.dragConstraint) { Composite.remove(physics.engine.world, physics.dragConstraint); physics.dragConstraint = null; }
    activePointerRef.current = null;
    event.currentTarget.classList.remove("dragging");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const body = physicsRef.current?.bodies[index];
    if (!body || !event.key.startsWith("Arrow")) return;
    event.preventDefault();
    Sleeping.set(body, false);
    const impulse = 4.8;
    if (event.key === "ArrowLeft") Body.setVelocity(body, { x: -impulse, y: body.velocity.y });
    if (event.key === "ArrowRight") Body.setVelocity(body, { x: impulse, y: body.velocity.y });
    if (event.key === "ArrowUp") Body.setVelocity(body, { x: body.velocity.x, y: -impulse });
    if (event.key === "ArrowDown") Body.setVelocity(body, { x: body.velocity.x, y: impulse });
  };

  return (
    <section className="interactive-system-section motion-reveal" aria-labelledby="interactive-system-title">
      <div className="interactive-system-head"><div><p className="eyebrow">Interactive content system</p><KineticHeading lines={["STRATEGY", "YOU CAN", "FEEL."]} /></div><div><p>Drag the ingredients. Every strong content engine needs all of them working together.</p><BookCall /></div></div>
      <div className="interactive-lab" ref={containerRef}>
        <div className="lab-grid" aria-hidden="true" />
        {systemItems.map((item, index) => <button ref={(element) => { itemRefs.current[index] = element; }} key={`${item.label}-${index}`} type="button" aria-label={"accessibleLabel" in item ? `${item.accessibleLabel}. Drag or use arrow keys.` : `${item.label}. Drag or use arrow keys.`} className={`lab-chip ${item.style}`} style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate3d(-50%,-50%,0) rotate(${item.rotate}deg)` }} onPointerDown={(event) => onPointerDown(event, index)} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={(event) => onKeyDown(event, index)}>{item.label}</button>)}
        <span className="drag-hint">Drag / throw / use arrow keys</span>
      </div>
    </section>
  );
}

function ResultsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let visible = false;
    let previousTime = performance.now();
    const animate = (time: number) => {
      if (!visible) return;
      const delta = Math.min(32, time - previousTime);
      previousTime = time;
      if (!pausedRef.current) {
        track.scrollLeft += delta * 0.025;
        const loopPoint = track.scrollWidth / 2;
        if (track.scrollLeft >= loopPoint) track.scrollLeft -= loopPoint;
      }
      frame = window.requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      window.cancelAnimationFrame(frame);
      if (visible) {
        previousTime = performance.now();
        frame = window.requestAnimationFrame(animate);
      }
    }, { rootMargin: "120px 0px", threshold: 0.01 });
    observer.observe(track);
    return () => { observer.disconnect(); window.cancelAnimationFrame(frame); };
  }, []);

  const move = (direction: number) => {
    trackRef.current?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.76, 720), behavior: "smooth" });
  };

  return (
    <div className="results-carousel">
      <div className="carousel-toolbar">
        <p>Swipe through the proof library</p>
        <div><button type="button" onClick={() => move(-1)} aria-label="Previous result">←</button><button type="button" onClick={() => move(1)} aria-label="Next result">→</button></div>
      </div>
      <div className="results-track" ref={trackRef} onPointerEnter={() => { pausedRef.current = true; }} onPointerLeave={() => { pausedRef.current = false; }} onFocus={() => { pausedRef.current = true; }} onBlur={() => { pausedRef.current = false; }} aria-label="Continuously moving client proof carousel. Hover or focus to pause.">
        {results.concat(results).map((result, index) => (
          <article className="result-card" key={`${result.label}-${index}`} aria-hidden={index >= results.length}>
            <div className="result-image"><img src={compactImage(result.image)} srcSet={`${compactImage(result.image)} 640w, ${result.image} 1200w`} sizes="(max-width: 760px) 74vw, 34vw" alt="" loading="lazy" decoding="async" /><span>{result.label}</span></div>
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

  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>(".section-heading, .process-copy, .process-screen, .case-panel, .testimonial-strip blockquote, .proof-wall article, .lead-intro, .metrics-grid article, .pipeline-card, .price-card, .faq-sticky, .faq-list article, .book-section > *:not(.book-orbit):not(.book-field)");
    const parallaxTargets = document.querySelectorAll<HTMLElement>("[data-parallax]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("motion-visible");
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    revealTargets.forEach((target) => { target.classList.add("motion-target"); observer.observe(target); });

    let ticking = false;
    const updateScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        document.documentElement.style.setProperty("--page-progress", `${Math.min(1, window.scrollY / maxScroll)}`);
        parallaxTargets.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
          const speed = Number(element.dataset.parallax || 0.035);
          element.style.setProperty("--parallax", `${Math.max(-42, Math.min(42, -centerDelta * speed))}px`);
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => { observer.disconnect(); window.removeEventListener("scroll", updateScroll); };
  }, []);

  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
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
            <PortalField className="hero-field" />
            {results.slice(0, 5).map((result, index) => <div className={`hero-tile tile-${index + 1}`} data-parallax={0.018 + index * 0.008} key={result.label}><img src={compactImage(result.image)} srcSet={`${compactImage(result.image)} 640w, ${result.image} 1200w`} sizes="(max-width: 760px) 52vw, 24vw" alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" fetchPriority={index === 0 ? "high" : "low"} /></div>)}
            <div className="hero-glow" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Done-for-you content systems · Manila / worldwide</p>
            <KineticHeading hero lines={["TURN YOUR", "EXPERTISE INTO", "DEMAND."]} accentLine={2} />
            <p className="hero-lede"><KaraokeText text="We research, script, edit, publish and optimize short-form content that helps expert-led brands earn attention—and turn it into sales conversations." /></p>
            <div className="hero-actions"><BookCall label="Book a discovery call" /><a className="text-link" href="#results">See client results <span>↓</span></a></div>
          </div>
          <div className="hero-proofbar">
            <span>Strategy</span><span>Scripting</span><span>Editing</span><span>Publishing</span><span>Reporting</span>
          </div>
        </section>

        <section className="results-section" id="results">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">02 · Client before & after results</p><KineticHeading lines={["PROOF", "BEFORE", "PROMISES."]} /></div>
            <div><p><KaraokeText text="Put the evidence where buyers can see it. This carousel is built for your approved analytics, feed transformations, inbox wins and pipeline screenshots." /></p><BookCall light /></div>
          </div>
          <ResultsCarousel />
          <p className="proof-disclaimer">Proof placeholders are intentionally labeled. Replace them with approved, redacted client screenshots before launch.</p>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">03 · The service</p><KineticHeading lines={["YOUR CONTENT", "DEPARTMENT,", "WITHOUT THE HIRING."]} accentLine={2} /></div>
            <div><p><KaraokeText text="One senior, connected system from idea to upload. No pile of disconnected freelancers. No half-finished content calendar. No wondering what gets published next." /></p><BookCall /></div>
          </div>
          <div className="service-list">
            {services.map((service) => <Reveal key={service.number}><article className="service-row"><span>{service.number}</span><h3>{service.title}</h3><p>{service.copy}</p><i>↗</i></article></Reveal>)}
          </div>
        </section>

        <InteractiveSystemLab />

        <section className="case-studies-section" id="case-studies">
          <div className="section-heading"><p className="eyebrow">04 · Case studies</p><KineticHeading lines={["THE STORY", "BEHIND THE RESULT."]} /><BookCall light /></div>
          <div className="case-grid">
            {[
              { title: "From scattered posting to a repeatable authority system", image: "/images/invicti-strategy.webp", tag: "Strategy + content operations" },
              { title: "From slow production to a monthly short-form engine", image: "/images/invicti-motion.webp", tag: "Scripting + production" },
              { title: "From attention to tracked sales conversations", image: "/images/invicti-portal.webp", tag: "Publishing + lead flow" },
            ].map((study, index) => <article className={`case-panel case-${index + 1}`} key={study.title}><img src={study.image} alt="" loading="lazy" data-parallax="0.028" /><div className="case-overlay"><p>{study.tag}</p><h3>{study.title}</h3><div><span>Challenge</span><span>System</span><span>Verified outcome</span></div><em>Case-study copy and proof slot</em></div></article>)}
          </div>
          <div className="testimonial-strip" aria-label="Testimonials">
            <p className="eyebrow">Client words</p>
            {[1, 2, 3].map((item) => <blockquote key={item}><span>“</span><p>Add an approved client quote about the process, the experience and the business impact.</p><cite>Client name · Company · permission confirmed</cite></blockquote>)}
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="process-copy">
            <p className="eyebrow">05 · How we work together</p>
            <KineticHeading lines={["ONE SYSTEM.", "SIX CLEAR", "MOVES."]} />
            <p><KaraokeText text="Each cycle turns what you know into strategic content, then turns performance data into the next sharper cycle." /></p>
            <BookCall />
          </div>
          <div className="process-visual">
            <div className="process-screen">
              <div className="screen-top"><span>INVICTI / CONTENT OS</span><i>Cycle 01 · Active</i></div>
              <div className="screen-preview"><img src="/images/project-gallery/video-editing-640.webp" srcSet="/images/project-gallery/video-editing-640.webp 640w, /images/project-gallery/video-editing-1200.webp 1200w" sizes="(max-width: 760px) calc(100vw - 54px), 56vw" alt="A video editing workspace used as a process preview" loading="lazy" decoding="async" data-parallax="0.02" /><span>04: Edit in progress</span></div>
              <div className="screen-timeline">{process.map((step, index) => <span key={step.number} style={{ width: `${12 + index * 3}%` }} />)}</div>
            </div>
            <div className="process-steps">{process.map((step) => <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}</div>
          </div>
        </section>

        <section className="more-results-section" id="more-results">
          <div className="section-heading split-heading"><div><p className="eyebrow">06 · More before & after results</p><KineticHeading lines={["THE RECEIPTS", "KEEP GOING."]} /></div><div><p><KaraokeText text="Use this proof wall for the volume the brief calls for—content performance, profile growth, feed transformations and direct client messages." /></p><BookCall /></div></div>
          <div className="proof-wall">
            {results.concat(results.slice(0, 2)).map((result, index) => <article key={`${result.label}-${index}`}><img src={compactImage(result.image)} srcSet={`${compactImage(result.image)} 640w, ${result.image} 1200w`} sizes="(max-width: 760px) 48vw, 25vw" alt="" loading="lazy" decoding="async" data-parallax={0.02 + (index % 3) * 0.008} /><div><span>{String(index + 1).padStart(2, "0")}</span><b>{index % 2 === 0 ? "Before → after" : "Client result"}</b><small>Verified screenshot slot</small></div></article>)}
          </div>
        </section>

        <section className="lead-results-section" id="lead-results">
          <div className="lead-intro"><p className="eyebrow">07 · Client lead results</p><KineticHeading lines={["ATTENTION IS", "ONLY HALF", "THE JOB."]} /><p><KaraokeText text="Show the bridge from content to commercial outcome: qualified inquiries, booked calls, pipeline and reply-to-call conversion." /></p><BookCall light /></div>
          <div className="metrics-grid">{leadResults.map((result) => <article key={result.label}><strong>{result.metric}</strong><span>{result.label}</span><small>{result.note}</small></article>)}</div>
          <div className="pipeline-card"><div><span>Content</span><i>→</i><span>Qualified attention</span><i>→</i><span>Conversation</span><i>→</i><span>Booked call</span></div><p>Connect screenshots to source data so every claim is credible and easy to verify.</p></div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="section-heading split-heading"><div><p className="eyebrow">08 · Packages</p><KineticHeading lines={["A CONTENT TEAM", "FOR LESS THAN", "ONE FULL-TIME HIRE."]} /></div><div><p><KaraokeText text="Clear starting points. Final scope, platforms and cadence are confirmed after the discovery call." /></p><BookCall /></div></div>
          <div className="pricing-grid">
            {packages.map((plan) => <article className={plan.featured ? "price-card featured" : "price-card"} key={plan.name}>{plan.featured && <span className="popular">Most popular</span>}<header><p>{plan.name}</p><span>{plan.volume}</span></header><h3>{plan.price}<small>/ month</small></h3><p>{plan.description}</p><ul>{plan.features.map((feature) => <li key={feature}><span>＋</span>{feature}</li>)}</ul><a href={BOOKING_LINK}>Book a call <span>↗</span></a></article>)}
          </div>
          <p className="pricing-note">Prices are starting points in USD and exclude paid media, travel, specialist production and third-party fees.</p>
        </section>

        <section className="faq-section" id="faq">
          <div className="faq-sticky"><p className="eyebrow">09 · Frequently asked</p><KineticHeading lines={["ASK", "THE HARD", "QUESTIONS."]} /><p><KaraokeText text="Clear scope. Honest expectations. No mystery around what happens next." /></p><BookCall /></div>
          <div className="faq-list">{faqs.map(([question, answer], index) => <article className={activeFaq === index ? "open" : ""} key={question}><button type="button" onClick={() => setActiveFaq(activeFaq === index ? null : index)} aria-expanded={activeFaq === index}><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><i>{activeFaq === index ? "−" : "+"}</i></button><div className="faq-answer"><p>{answer}</p></div></article>)}</div>
        </section>

        <section className="book-section" id="book-call">
          <PortalField className="book-field" />
          <div className="book-orbit" aria-hidden="true"><span /><span /><span /></div>
          <p className="eyebrow">10 · Your next move</p>
          <KineticHeading lines={["LET’S BUILD THE", "CONTENT SYSTEM", "YOUR SALES TEAM WANTS."]} accentLine={2} />
          <p><KaraokeText text="Bring your offer, your current content and the bottleneck. Leave with a clear recommendation—even if we are not the right fit." /></p>
          <a className="book-button" href={BOOKING_LINK}>Book a discovery call <span>↗</span></a>
          <footer><span>© {new Date().getFullYear()} INVICTI</span><a href="mailto:hello@invicti.agency">hello@invicti.agency</a><a href="#top">Back to top ↑</a></footer>
        </section>
      </main>
    </div>
  );
}
