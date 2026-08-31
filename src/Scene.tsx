import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { Bodies, Body, Composite, Constraint, Engine, Sleeping, Vector, type IBodyDefinition, type Body as MatterBody, type Constraint as MatterConstraint } from "matter-js";

// Karaoke-style word-by-word text animation
function KaraokeText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // start when top hits 80% of screen, finish when top hits 20%
      const start = vh * 0.82;
      const end = vh * 0.22;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(p);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const words = text.split(" ");
  const total = words.length;
  return (
    <span ref={ref} className={`karaoke-text ${className}`} aria-label={text}>
      {words.map((word, i) => {
        const wordStart = i / total;
        const wordEnd = (i + 1) / total;
        const wordProgress = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart)));
        return (
          <span
            key={i}
            className="karaoke-word"
            style={{ "--wp": wordProgress } as CSSProperties}
          >
            {word}{i < total - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

// Scroll-reveal wrapper
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("is-revealed"); observer.disconnect(); } },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal-wrap ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

type CaseStudy = {
  client: string;
  title: string;
  category: string;
  year: string;
  image: string;
  tone: string;
  lead: string;
  result: string;
  services: string[];
};

const services = [
  ["01", "Strategy", "Positioning, audience and a point of view sharp enough to guide every decision."],
  ["02", "Identity", "Names, systems and visual worlds built to stay recognizable while culture moves."],
  ["03", "Experience", "Digital products and campaigns designed to feel inevitable, useful and alive."],
];

const caseStudies: CaseStudy[] = [
  { client: "Northstar Labs", title: "Beyond Form", category: "Brand world", year: "2026", image: "/images/invicti-portal.webp", tone: "violet", lead: "Turning a complex materials company into a magnetic cultural signal.", result: "3.4× qualified demand", services: ["Strategy", "Identity", "Launch"] },
  { client: "Aperture", title: "Money, made clear", category: "Fintech platform", year: "2026", image: "/images/invicti-strategy.webp", tone: "coral", lead: "A calmer financial system for people building their first real future.", result: "+41% activation", services: ["Research", "Product", "System"] },
  { client: "NOVA Culture", title: "New Signal", category: "Digital experience", year: "2025", image: "/images/invicti-motion.webp", tone: "electric", lead: "A living platform that moves at the speed of independent music.", result: "1.8M launch reach", services: ["Narrative", "Digital", "Motion"] },
  { client: "Field Notes", title: "Stay curious", category: "Campaign", year: "2025", image: "/images/invicti-portal.webp", tone: "silver", lead: "A global campaign that made exploration feel personal again.", result: "6 markets launched", services: ["Concept", "Campaign", "Film"] },
  { client: "Hush Audio", title: "Hear everything", category: "Identity refresh", year: "2024", image: "/images/invicti-motion.webp", tone: "rose", lead: "Giving an exacting audio brand a warmer, more human frequency.", result: "+68% brand recall", services: ["Identity", "Packaging", "Web"] },
];

const galleryItems = [
  { image: "/images/project-gallery/ai-automation.jpg", title: "AI Automation", description: "Autonomous workflows that connect tools, decisions and teams.", credit: "Getty Images / Unsplash", source: "https://unsplash.com/photos/ai-artificial-intelligence-concept3d-renderingconceptual-image-aTWKwJllPOA", accent: "#6d4cff", position: "50% 50%" },
  { image: "/images/project-gallery/ai-ugc.jpg", title: "AI UGC", description: "Creator-led campaigns scaled with expressive generative production.", credit: "Ahmet Kurt / Unsplash", source: "https://unsplash.com/photos/a-man-sitting-at-a-desk-with-a-camera-lsp5TIqN7oY", accent: "#ff6b42", position: "50% 46%" },
  { image: "/images/project-gallery/web-scraping.jpg", title: "Web Scraping", description: "Clean, reliable data pipelines built from the open web.", credit: "Getty Images / Unsplash", source: "https://unsplash.com/photos/futuristic-earth-map-technology-abstract-background-represent-global-connection-concept-m2pxgGc1Yas", accent: "#2a9dff", position: "50% 50%" },
  { image: "/images/project-gallery/comfyui.jpg", title: "ComfyUI", description: "Node-based image systems for repeatable generative art direction.", credit: "Philip Oroni / Unsplash", source: "https://unsplash.com/photos/a-computer-keyboard-sitting-on-top-of-a-computer-mouse-AMAYQqzQYaI", accent: "#e946ff", position: "50% 52%" },
  { image: "/images/project-gallery/video-editing.jpg", title: "Video Editing", description: "Sharp stories, tactile pacing and motion that holds attention.", credit: "Stephanie Berbec / Unsplash", source: "https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-desk-oZLz5m5jd18", accent: "#ffba36", position: "50% 48%" },
  { image: "/images/project-gallery/content-creation.jpg", title: "Content Creation", description: "Always-on visual systems made for every channel and format.", credit: "Daiga Ellaby / Unsplash", source: "https://unsplash.com/photos/a-womans-hand-touching-a-cell-phone-with-a-camera-attached-to-it-WVXBdXZ2ga0", accent: "#ff4778", position: "50% 50%" },
  { image: "/images/project-gallery/web-development.jpg", title: "Web Development", description: "Fast, expressive websites engineered around real business goals.", credit: "Behnam Norouzi / Unsplash", source: "https://unsplash.com/photos/a-person-typing-on-a-laptop-on-a-desk-mKhPLJ5JQI4", accent: "#31d6a0", position: "50% 48%" },
  { image: "/images/project-gallery/animation.jpg", title: "Animation", description: "Character, product and interface motion with memorable energy.", credit: "Getty Images / Unsplash", source: "https://unsplash.com/photos/3d-render-abstract-emotional-face-icon-confused-character-illustration-sick-cute-cartoon-monster-emoji-emoticon-toy-aRJLmvhQFV4", accent: "#9b75ff", position: "50% 50%" },
  { image: "/images/project-gallery/copy-writing.jpg", title: "Copy Writing", description: "Distinctive voice systems that make complex offers feel clear.", credit: "Joshua Hoehne / Unsplash", source: "https://unsplash.com/photos/a-notebook-with-a-pen-on-top-of-it-uRf4Yals3ew", accent: "#f2e6ca", position: "50% 50%" },
  { image: "/images/project-gallery/seo.jpg", title: "SEO", description: "Search strategies designed for visibility, authority and growth.", credit: "Resource Database / Unsplash", source: "https://unsplash.com/photos/a-laptop-computer-with-the-word-search-on-it-U7Y4Q3jW-0g", accent: "#81c7ff", position: "50% 52%" },
];

function PortalField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let frame = 0, width = 0, height = 0, dpr = 1;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = Array.from({ length: 115 }, (_, i) => ({
      angle: (i / 115) * Math.PI * 2 + Math.sin(i * 9.13),
      radius: 0.12 + ((i * 37) % 86) / 100,
      size: 0.35 + ((i * 19) % 13) / 8,
      speed: 0.3 + ((i * 11) % 17) / 20,
    }));
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const pointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 78;
      targetY = (event.clientY / window.innerHeight - 0.5) * 56;
    };
    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = reduced ? 0 : time * 0.00022;
      mouseX += (targetX - mouseX) * 0.055; mouseY += (targetY - mouseY) * 0.055;
      const cx = width * 0.5 + mouseX, cy = height * 0.49 + mouseY, unit = Math.min(width, height);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * 0.58);
      glow.addColorStop(0, "rgba(212,198,255,.24)"); glow.addColorStop(0.15, "rgba(115,76,255,.12)");
      glow.addColorStop(0.58, "rgba(32,14,78,.03)"); glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.14 + mouseX * 0.0008);
      stars.forEach((star, i) => {
        const pulse = 0.84 + Math.sin(t * 5 * star.speed + i) * 0.12;
        const r = star.radius * unit * 0.54 * pulse, a = star.angle + t * star.speed;
        const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.58;
        if (i % 4 === 0) {
          ctx.beginPath(); ctx.moveTo(x * 0.18, y * 0.18); ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(212,202,255,${0.055 + star.size * 0.025})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = i % 11 === 0 ? "rgba(255,105,91,.9)" : `rgba(244,240,255,${0.25 + star.size * 0.12})`;
        ctx.shadowColor = i % 11 === 0 ? "#ff695b" : "#8f6fff"; ctx.shadowBlur = star.size * 7; ctx.fill();
      });
      ctx.restore(); frame = window.requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", pointer, { passive: true });
    frame = window.requestAnimationFrame(draw);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", pointer); };
  }, []);

  return <canvas className={`portal-field ${className}`} ref={canvasRef} aria-hidden="true" />;
}

const labItems = [
  { label: "CLARITY", x: 18, y: 13, rotate: -8, style: "solid" },
  { label: "AUDIENCE", x: 48, y: 5, rotate: 6, style: "outline" },
  { label: "CULTURE", x: 78, y: 18, rotate: -4, style: "glass" },
  { label: "PROOF", x: 29, y: 39, rotate: 5, style: "glass" },
  { label: "IMPACT", x: 67, y: 46, rotate: -7, style: "solid" },
  { label: "COURAGE", x: 14, y: 62, rotate: 4, style: "outline small" },
  { label: "CRAFT", x: 52, y: 66, rotate: -4, style: "solid small" },
  { label: "✦", accessibleLabel: "Creative spark", x: 87, y: 60, rotate: 0, style: "glass symbol", shape: "circle" },
] as const;

type LabPhysics = {
  engine: Engine;
  bodies: MatterBody[];
  dragConstraint: MatterConstraint | null;
  width: number;
  height: number;
};

function ValidationLab() {
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
    engine.gravity.y = reducedMotion ? 0 : 0.82;
    let visible = false;
    let lastTime = performance.now();
    let resizeFrame = 0;

    const buildWorld = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
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
        const item = labItems[index];
        const elementWidth = element?.offsetWidth ?? 180;
        const elementHeight = element?.offsetHeight ?? 72;
        const saved = previousPositions?.[index];
        const x = Math.max(elementWidth / 2 + 2, Math.min(width - elementWidth / 2 - 2, (saved?.x ?? item.x / 100) * width));
        const y = Math.max(elementHeight / 2 + 2, Math.min(height - elementHeight / 2 - 2, (saved?.y ?? item.y / 100) * height));
        const options: IBodyDefinition = {
          angle: item.rotate * Math.PI / 180,
          density: 0.0018,
          friction: 0.18,
          frictionStatic: 0.45,
          frictionAir: reducedMotion ? 0.09 : 0.012,
          restitution: 0.56,
          sleepThreshold: 55,
        };
        return "shape" in item && item.shape === "circle"
          ? Bodies.circle(x, y, elementWidth / 2, options)
          : Bodies.rectangle(x, y, elementWidth, elementHeight, { ...options, chamfer: { radius: Math.min(elementHeight / 2, 44) } });
      });
      Composite.add(engine.world, bodies);
      physicsRef.current = { engine, bodies, dragConstraint: null, width, height };
    };

    const render = (time: number) => {
      if (visible) {
        Engine.update(engine, Math.min(24, time - lastTime));
        physicsRef.current?.bodies.forEach((body, index) => {
          const element = itemRefs.current[index];
          if (!element) return;
          element.style.left = `${body.position.x}px`;
          element.style.top = `${body.position.y}px`;
          element.style.transform = `translate3d(-50%,-50%,0) rotate(${body.angle}rad)`;
        });
      }
      lastTime = time;
      frameRef.current = window.requestAnimationFrame(render);
    };

    buildWorld();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; lastTime = performance.now(); }, { threshold: 0.05 });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(buildWorld);
    });
    resizeObserver.observe(container);
    frameRef.current = window.requestAnimationFrame(render);

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
    const physics = physicsRef.current;
    const rect = containerRef.current?.getBoundingClientRect();
    const body = physics?.bodies[index];
    if (!physics || !rect || !body) return;
    event.preventDefault();
    activePointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("dragging");
    Sleeping.set(body, false);
    const worldPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const pointB = Vector.rotate(Vector.sub(worldPoint, body.position), -body.angle);
    const dragConstraint = Constraint.create({
      pointA: worldPoint,
      bodyB: body,
      pointB,
      stiffness: 0.22,
      damping: 0.12,
      length: 0,
    });
    physics.dragConstraint = dragConstraint;
    Composite.add(physics.engine.world, dragConstraint);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const physics = physicsRef.current;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!physics?.dragConstraint || !rect || activePointerRef.current !== event.pointerId) return;
    event.preventDefault();
    physics.dragConstraint.pointA.x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    physics.dragConstraint.pointA.y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const physics = physicsRef.current;
    if (physics?.dragConstraint) {
      Composite.remove(physics.engine.world, physics.dragConstraint);
      physics.dragConstraint = null;
    }
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
    <section className="validation-section" id="validation" data-nav="approach" aria-labelledby="validation-title">
      <div className="validation-head"><p className="eyebrow">Validation, not decoration</p><h2 id="validation-title">Ideas get stronger<br />when they collide.</h2><p>Drag the ingredients. The system responds—just like real strategy.</p></div>
      <div className="validation-lab" ref={containerRef}>
        <div className="lab-grid" aria-hidden="true" />
        {labItems.map((item, index) => <button ref={(element) => { itemRefs.current[index] = element; }} key={item.label + index} type="button" aria-label={"accessibleLabel" in item ? `${item.accessibleLabel}. Drag or use arrow keys.` : `${item.label}. Drag or use arrow keys.`} className={`lab-chip ${item.style}`} style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate3d(-50%,-50%,0) rotate(${item.rotate}deg)` }} onPointerDown={(event) => onPointerDown(event, index)} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={(event) => onKeyDown(event, index)}>{item.label}</button>)}
        <span className="drag-hint">Drag / arrow keys</span>
      </div>
    </section>
  );
}

function MediaDialog({ index, onClose, onChange }: { index: number; onClose: () => void; onChange: (index: number) => void }) {
  const item = galleryItems[index];
  return (
    <div className="media-dialog" role="dialog" aria-modal="true" aria-labelledby="gallery-dialog-title" onClick={onClose}>
      <button className="dialog-close" onClick={onClose} aria-label="Close gallery">×</button>
      <button className="dialog-arrow previous" onClick={(event) => { event.stopPropagation(); onChange((index - 1 + galleryItems.length) % galleryItems.length); }} aria-label="Previous image">←</button>
      <figure onClick={(event) => event.stopPropagation()} style={{ "--dialog-accent": item.accent } as CSSProperties}>
        <div className="dialog-visual"><img src={item.image.replace(".jpg", "-1200.webp")} srcSet={`${item.image.replace(".jpg", "-640.webp")} 640w, ${item.image.replace(".jpg", "-1200.webp")} 1200w`} sizes="90vw" width="1600" height="1100" fetchPriority="high" decoding="async" alt={`${item.title} project visual`} style={{ objectPosition: item.position }} /></div>
        <figcaption><span>0{index + 1} / {galleryItems.length}</span><div><strong id="gallery-dialog-title">{item.title}</strong><p>{item.description}</p></div><a href={item.source} target="_blank" rel="noreferrer">{item.credit} ↗</a></figcaption>
      </figure>
      <button className="dialog-arrow next" onClick={(event) => { event.stopPropagation(); onChange((index + 1) % galleryItems.length); }} aria-label="Next image">→</button>
    </div>
  );
}

function CaseDialog({ project, onClose }: { project: CaseStudy; onClose: () => void }) {
  return (
    <div className="case-dialog" role="dialog" aria-modal="true" aria-labelledby="case-dialog-title">
      <button className="dialog-close" onClick={onClose} aria-label="Close case study">×</button>
      <div className="case-dialog-scroll">
        <header><p className="eyebrow">Case study · {project.year}</p><h2 id="case-dialog-title">{project.title}</h2><p>{project.lead}</p></header>
        <div className={`case-dialog-image tone-${project.tone}`}><img src={project.image} width="1586" height="992" decoding="async" alt="" /></div>
        <div className="case-dialog-details"><div><span>Client</span><strong>{project.client}</strong></div><div><span>Scope</span><strong>{project.services.join(" · ")}</strong></div><div><span>Outcome</span><strong>{project.result}</strong></div></div>
        <div className="case-dialog-story"><p>We began by removing category conventions and finding the one belief the brand could own. That became a focused system across message, identity and experience.</p><p>The result is designed to move: consistent enough to build recognition, flexible enough to stay surprising, and clear enough for teams to use without us in the room.</p></div>
        <a href="mailto:hello@invicti.agency?subject=Build%20something%20like%20this">Build something like this <span>↗</span></a>
      </div>
    </div>
  );
}

export function Scene() {
  const [active, setActive] = useState("intro");
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [caseIndex, setCaseIndex] = useState(0);
  const [caseDialog, setCaseDialog] = useState<CaseStudy | null>(null);
  const [hoveredService, setHoveredService] = useState(0);
  const swipeStart = useRef<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const project = caseStudies[caseIndex];

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("section[id], section[data-nav]")];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { const target = entry.target as HTMLElement; setActive(target.dataset.nav || target.id); } }), { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      window.requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
          const speed = Number(element.dataset.parallax || 0.08), rect = element.parentElement?.getBoundingClientRect();
          if (rect) element.style.setProperty("--parallax", `${rect.top * speed}px`);
        });
        const hero = heroRef.current;
        if (hero) {
          const rect = hero.getBoundingClientRect();
          const distance = Math.max(1, rect.height - window.innerHeight);
          const progress = Math.max(0, Math.min(1, -rect.top / distance));
          hero.style.setProperty("--gallery-progress", progress.toFixed(4));
          hero.style.setProperty("--hero-seam", Math.max(0, Math.min(1, (progress - 0.76) / 0.24)).toFixed(4));
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    const modalOpen = galleryIndex !== null || caseDialog !== null;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setGalleryIndex(null); setCaseDialog(null); }
      if (galleryIndex !== null && event.key === "ArrowRight") setGalleryIndex((galleryIndex + 1) % galleryItems.length);
      if (galleryIndex !== null && event.key === "ArrowLeft") setGalleryIndex((galleryIndex - 1 + galleryItems.length) % galleryItems.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [galleryIndex, caseDialog]);

  const changeCase = (next: number) => setCaseIndex((next + caseStudies.length) % caseStudies.length);
  const moveGlow = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#intro" aria-label="INVICTI home">INVICTI<span>®</span></a>
        <nav className="pill-nav" aria-label="Primary navigation">{["intro", "approach", "work", "about"].map((item) => <a key={item} className={active === item ? "active" : ""} href={`#${item}`}>{item}</a>)}</nav>
        <a className="header-contact" href="mailto:hello@invicti.agency">hello@invicti.agency</a>
      </header>

      <main>
        <section className="hero" id="intro" ref={heroRef}>
          <div className="hero-stage">
            <div className="project-wall" aria-label="Our project capabilities">
              {galleryItems.map((item, index) => (
                <button className="project-tile" key={item.title} onClick={() => setGalleryIndex(index)} aria-label={`View ${item.title} project`} style={{ "--tile-accent": item.accent } as CSSProperties}>
                  <img
                    src={item.image.replace(".jpg", "-640.webp")}
                    srcSet={`${item.image.replace(".jpg", "-640.webp")} 640w, ${item.image.replace(".jpg", "-1200.webp")} 1200w`}
                    sizes="(max-width: 760px) 45vw, 25vw"
                    width="1600"
                    height="1100"
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                    style={{ objectPosition: item.position }}
                  />
                  <span className="tile-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="tile-copy"><strong>{item.title}</strong><small>{item.description}</small><i>View project ↗</i></span>
                </button>
              ))}
            </div>
            <div className="hero-vignette" aria-hidden="true" />
            <div className="hero-intro"><p className="eyebrow">Independent AI creative studio<br />Manila / Everywhere</p><p>Ten disciplines. One connected team building smarter systems, stronger stories and digital work with a pulse.</p><div className="hero-actions"><a className="button primary" href="mailto:hello@invicti.agency?subject=Start%20a%20project">Start a project <span>↗</span></a><button className="button ghost" onClick={() => setGalleryIndex(0)}>Explore all ten <span>＋</span></button></div></div>
            <div className="hero-title"><p>We make ambitious ideas</p><h1>UNCONQUERED</h1><span className="within-text">within.</span></div>
            <a className="scroll-cue" href="#approach"><span>Scroll to enter</span><i>↓</i></a>
          </div>
        </section>

        <section className="manifesto" id="approach"><PortalField /><p className="eyebrow">Our conviction</p><h2>Safe work<br />is invisible.</h2><p className="manifesto-copy"><KaraokeText text="We turn sharp strategy into identities, campaigns and digital experiences that refuse to blend in." /></p><div className="orbit-label orbit-one">CLARITY</div><div className="orbit-label orbit-two">COURAGE</div><div className="orbit-label orbit-three">CRAFT</div></section>

        <section className={`services-section service-active-${hoveredService}`} id="services" data-nav="approach" onPointerMove={moveGlow}>
          <div className="section-fade-top" aria-hidden="true" />
          <div className="service-aura" aria-hidden="true" /><div className="section-intro"><Reveal><p className="eyebrow">How we move</p></Reveal><Reveal delay={100}><h2>From first truth<br />to full impact.</h2></Reveal></div>
          <div className="service-layout"><div className="service-visual" aria-hidden="true"><span>0{hoveredService + 1}</span><strong>{services[hoveredService][1]}</strong><i /></div><div className="service-list">{services.map(([number, title, copy], index) => <article className={`service-row${hoveredService === index ? " active" : ""}`} key={title} onPointerEnter={() => setHoveredService(index)}><span>{number}</span><h3>{title}</h3><p><KaraokeText text={copy} /></p><i>↗</i></article>)}</div></div>
          <div className="section-fade-bottom" aria-hidden="true" />
        </section>

        <ValidationLab />

        <section className="work-section" id="work">
          <div className="section-fade-top" aria-hidden="true" />
          <div className="work-head"><Reveal><p className="eyebrow">Selected work · 2024—26</p></Reveal><Reveal delay={80}><h2>BUILT TO<br />BE FELT.</h2></Reveal><Reveal delay={160}><p>Five collaborations. One standard: useful work with a pulse.</p></Reveal></div>
          <div className="case-carousel" aria-roledescription="carousel" aria-label="Selected case studies" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowLeft") changeCase(caseIndex - 1); if (event.key === "ArrowRight") changeCase(caseIndex + 1); }} onPointerDown={(event) => { swipeStart.current = event.clientX; }} onPointerUp={(event) => { if (swipeStart.current === null) return; const delta = event.clientX - swipeStart.current; if (Math.abs(delta) > 45) changeCase(caseIndex + (delta < 0 ? 1 : -1)); swipeStart.current = null; }}>
            <button className="case-peek previous" onClick={() => changeCase(caseIndex - 1)} aria-label="Previous case study"><img src={caseStudies[(caseIndex - 1 + caseStudies.length) % caseStudies.length].image} width="1586" height="992" loading="lazy" decoding="async" alt="" /><span>←</span></button>
            <article className={`case-card tone-${project.tone}`} key={project.title} aria-live="polite"><div className="case-copy"><div className="case-client"><span>{project.client}</span><b>{project.year}</b></div><h3>{project.title}</h3><p>{project.lead}</p><div className="case-services">{project.services.map((service) => <span key={service}>{service}</span>)}</div><button className="button case-button" onClick={() => setCaseDialog(project)}>View case study <span>↗</span></button></div><div className="case-image"><img src={project.image} width="1586" height="992" loading="lazy" decoding="async" alt={`${project.title} project artwork`} /><strong>{project.result}</strong></div></article>
            <button className="case-peek next" onClick={() => changeCase(caseIndex + 1)} aria-label="Next case study"><img src={caseStudies[(caseIndex + 1) % caseStudies.length].image} width="1586" height="992" loading="lazy" decoding="async" alt="" /><span>→</span></button>
          </div>
          <div className="case-controls"><span>0{caseIndex + 1} / 0{caseStudies.length}</span><div>{caseStudies.map((item, index) => <button key={item.title} className={index === caseIndex ? "active" : ""} onClick={() => setCaseIndex(index)} aria-label={`Show ${item.title}`} />)}</div><p>Drag, swipe or use arrow keys</p></div>
        </section>

        <section className="about-section" id="about">
          <div className="section-fade-top" aria-hidden="true" />
          <div className="about-sticky"><p className="eyebrow">About INVICTI</p><h2>SMALL TEAM.<br />BIG NERVE.</h2><div className="about-mark">I<span>+</span></div></div>
          <div className="about-copy"><Reveal><p>INVICTI is an independent creative agency for leaders who would rather define the category than decorate it.</p></Reveal><Reveal delay={120}><p>We stay senior, curious and close to the work—from the first difficult question to the final moving pixel.</p></Reveal><Reveal delay={240}><blockquote><KaraokeText text='"Unconquered" is not an aesthetic. It is the confidence to make the clearest choice, even when it is not the safest one.' /></blockquote></Reveal><div className="about-stats"><div><strong>12</strong><span>Years shaping brands</span></div><div><strong>18</strong><span>Markets reached</span></div><div><strong>01</strong><span>Senior team, start to finish</span></div></div><div className="facts"><span><b>01</b> strategy</span><span><b>02</b> identity</span><span><b>03</b> digital</span><span><b>04</b> campaign</span></div></div>
        </section>

        <section className="contact-section" data-nav="about" onPointerMove={moveGlow}>
          <div className="section-fade-top" aria-hidden="true" />
          <PortalField className="contact-field" /><div className="contact-beam" aria-hidden="true" />
          <Reveal><p className="eyebrow">Have something worth making?</p></Reveal>
          <div className="contact-headline"><Reveal><span>LET’S TALK ABOUT</span></Reveal><Reveal delay={150}><strong>THE NEXT BIG THING</strong></Reveal></div>
          <div className="contact-links"><a href="mailto:hello@invicti.agency">hello@invicti.agency <i>↗</i></a><a href="#work">See the work <i>↓</i></a></div><footer><span>© {new Date().getFullYear()} INVICTI</span><span>Manila · Philippines</span><a href="#intro">Back to top ↑</a></footer></section>
      </main>

      {galleryIndex !== null && <MediaDialog index={galleryIndex} onClose={() => setGalleryIndex(null)} onChange={setGalleryIndex} />}
      {caseDialog && <CaseDialog project={caseDialog} onClose={() => setCaseDialog(null)} />}
    </div>
  );
}
