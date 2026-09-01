import { createContext, Fragment, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import { Bodies, Body, Composite, Constraint, Engine, Sleeping, Vector, type IBodyDefinition, type Body as MatterBody, type Constraint as MatterConstraint } from "matter-js";

import { defaultContent, type SiteContent } from "./content";
import { loadPublicContent } from "./public-content";

const compactImage = (source: string) => source.startsWith("/images/project-gallery/") ? source.replace("-1200.webp", "-640.webp") : source;

const ContentContext = createContext<SiteContent>(defaultContent);

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

function BookCall({ light = false, label }: { light?: boolean; label?: string }) {
  const content = useContext(ContentContext);
  const effectiveLabel = label || content.brand.headerCta;
  return <a className={`cta-pill${light ? " light" : ""}`} href="#book-call">{effectiveLabel}<span>↗</span></a>;
}

type LabPhysics = {
  engine: Engine;
  bodies: MatterBody[];
  dragConstraint: MatterConstraint | null;
  width: number;
  height: number;
};

function InteractiveSystemLab() {
  const content = useContext(ContentContext);
  const systemItems = content.interactive.items;
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const physicsRef = useRef<LabPhysics | null>(null);
  const frameRef = useRef<number | null>(null);
  const activePointerRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    itemRefs.current.length = systemItems.length;
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
  }, [systemItems]);

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
      <div className="interactive-system-head"><div><p className="eyebrow">{content.interactive.eyebrow}</p><KineticHeading lines={content.interactive.heading} /></div><div><p>{content.interactive.intro}</p><BookCall /></div></div>
      <div className="interactive-lab" ref={containerRef}>
        <div className="lab-grid" aria-hidden="true" />
        {systemItems.map((item, index) => <button ref={(element) => { itemRefs.current[index] = element; }} key={`${item.label}-${index}`} type="button" aria-label={"accessibleLabel" in item ? `${item.accessibleLabel}. Drag or use arrow keys.` : `${item.label}. Drag or use arrow keys.`} className={`lab-chip ${item.style}`} style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate3d(-50%,-50%,0) rotate(${item.rotate}deg)` }} onPointerDown={(event) => onPointerDown(event, index)} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={(event) => onKeyDown(event, index)}>{item.label}</button>)}
        <span className="drag-hint">{content.interactive.hint}</span>
      </div>
    </section>
  );
}

function ResultsCarousel({ section }: { section: SiteContent["results"] }) {
  const { items: results } = section;
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
        <p>{section.carouselLabel}</p>
        <div><button type="button" onClick={() => move(-1)} aria-label="Previous result">←</button><button type="button" onClick={() => move(1)} aria-label="Next result">→</button></div>
      </div>
      <div className="results-track" ref={trackRef} onPointerEnter={() => { pausedRef.current = true; }} onPointerLeave={() => { pausedRef.current = false; }} onFocus={() => { pausedRef.current = true; }} onBlur={() => { pausedRef.current = false; }} aria-label={section.carouselAria}>
        {results.concat(results).map((result, index) => (
          <article className="result-card" key={`${result.label}-${index}`} aria-hidden={index >= results.length}>
            <div className="result-image"><img src={compactImage(result.image)} srcSet={`${compactImage(result.image)} 640w, ${result.image} 1200w`} sizes="(max-width: 760px) 74vw, 34vw" alt={result.category} loading="lazy" decoding="async" /><span>{result.label}</span></div>
            <div className="result-copy">
              <p>{result.category}</p>
              <div className="before-after"><span>{result.before}<small>{section.beforeCaption}</small></span><b>→</b><span>{result.after}<small>{section.afterCaption}</small></span></div>
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
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    let active = true;
    void (async () => {
      const loaded = await loadPublicContent();
      if (active) setContent(loaded);
    })();
    return () => { active = false; };
  }, []);

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
    <ContentContext.Provider value={content}>
    <div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={`${content.brand.wordmark} home`}>{content.brand.wordmark}<span>®</span></a>
        <nav className={menuOpen ? "site-nav open" : "site-nav"} aria-label="Primary navigation">
          {content.brand.nav.map((item) => <a key={`${item.href}-${item.label}`} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
        </nav>
        <a className="header-cta" href="#book-call">{content.brand.headerCta} <span>↗</span></a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? "×" : "Menu"}</button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-media" aria-hidden="true">
            <PortalField className="hero-field" />
            {content.results.items.slice(0, 5).map((result, index) => <div className={`hero-tile tile-${index + 1}`} data-parallax={0.018 + index * 0.008} key={`${result.label}-${index}`}><img src={compactImage(result.image)} srcSet={`${compactImage(result.image)} 640w, ${result.image} 1200w`} sizes="(max-width: 760px) 52vw, 24vw" alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" fetchPriority={index === 0 ? "high" : "low"} /></div>)}
            <div className="hero-glow" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <KineticHeading hero lines={content.hero.heading} accentLine={content.hero.heading.length - 1} />
            <p className="hero-lede"><KaraokeText text={content.hero.lede} /></p>
            <div className="hero-actions"><BookCall label={content.hero.primaryCta} /><a className="text-link" href="#results">{content.hero.secondaryCta} <span>↓</span></a></div>
          </div>
          <div className="hero-proofbar">
            {content.hero.proofbar.map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="results-section" id="results">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">{content.results.eyebrow}</p><KineticHeading lines={content.results.heading} /></div>
            <div><p><KaraokeText text={content.results.intro} /></p><BookCall light /></div>
          </div>
          <ResultsCarousel section={content.results} />
          <p className="proof-disclaimer">{content.results.disclaimer}</p>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">{content.services.eyebrow}</p><KineticHeading lines={content.services.heading} accentLine={content.services.heading.length - 1} /></div>
            <div><p><KaraokeText text={content.services.intro} /></p><BookCall /></div>
          </div>
          <div className="service-list">
            {content.services.items.map((service, index) => <Reveal key={`${service.number}-${index}`}><article className="service-row"><span>{service.number}</span><h3>{service.title}</h3><p>{service.copy}</p><i>↗</i></article></Reveal>)}
          </div>
        </section>

        <InteractiveSystemLab />

        <section className="case-studies-section" id="case-studies">
          <div className="section-heading"><p className="eyebrow">{content.caseStudies.eyebrow}</p><KineticHeading lines={content.caseStudies.heading} /><BookCall light /></div>
          <div className="case-grid">
            {content.caseStudies.items.map((study, index) => <article className={`case-panel case-${index + 1}`} key={`${study.title}-${index}`}><img src={study.image} alt={study.title} loading="lazy" data-parallax="0.028" /><div className="case-overlay"><p>{study.tag}</p><h3>{study.title}</h3><div>{study.stages.map((stage) => <span key={stage}>{stage}</span>)}</div><em>{study.note}</em></div></article>)}
          </div>
          <div className="testimonial-strip" aria-label="Testimonials">
            <p className="eyebrow">{content.caseStudies.testimonialEyebrow}</p>
            {content.caseStudies.testimonials.map((item, index) => <blockquote key={`${item.citation}-${index}`}><span>“</span><p>{item.quote}</p><cite>{item.citation}</cite></blockquote>)}
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="process-copy">
            <p className="eyebrow">{content.process.eyebrow}</p>
            <KineticHeading lines={content.process.heading} />
            <p><KaraokeText text={content.process.intro} /></p>
            <BookCall />
          </div>
          <div className="process-visual">
            <div className="process-screen">
              <div className="screen-top"><span>{content.process.screenLabel}</span><i>{content.process.screenStatus}</i></div>
              <div className="screen-preview"><img src={compactImage(content.process.previewImage)} srcSet={`${compactImage(content.process.previewImage)} 640w, ${content.process.previewImage} 1200w`} sizes="(max-width: 760px) calc(100vw - 54px), 56vw" alt={content.process.previewAlt} loading="lazy" decoding="async" data-parallax="0.02" /><span>{content.process.previewStatus}</span></div>
              <div className="screen-timeline">{content.process.items.map((step, index) => <span key={`${step.number}-${index}`} style={{ width: `${12 + index * 3}%` }} />)}</div>
            </div>
            <div className="process-steps">{content.process.items.map((step, index) => <article key={`${step.number}-${index}`}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}</div>
          </div>
        </section>

        <section className="more-results-section" id="more-results">
          <div className="section-heading split-heading"><div><p className="eyebrow">{content.proofWall.eyebrow}</p><KineticHeading lines={content.proofWall.heading} /></div><div><p><KaraokeText text={content.proofWall.intro} /></p><BookCall /></div></div>
          <div className="proof-wall">
            {content.proofWall.items.map((result, index) => <article key={`${result.label}-${index}`}><img src={compactImage(result.image)} srcSet={`${compactImage(result.image)} 640w, ${result.image} 1200w`} sizes="(max-width: 760px) 48vw, 25vw" alt={result.category} loading="lazy" decoding="async" data-parallax={0.02 + (index % 3) * 0.008} /><div><span>{String(index + 1).padStart(2, "0")}</span><b>{result.category}</b><small>{result.note}</small></div></article>)}
          </div>
        </section>

        <section className="lead-results-section" id="lead-results">
          <div className="lead-intro"><p className="eyebrow">{content.leadResults.eyebrow}</p><KineticHeading lines={content.leadResults.heading} /><p><KaraokeText text={content.leadResults.intro} /></p><BookCall light /></div>
          <div className="metrics-grid">{content.leadResults.items.map((result, index) => <article key={`${result.label}-${index}`}><strong>{result.metric}</strong><span>{result.label}</span><small>{result.note}</small></article>)}</div>
          <div className="pipeline-card"><div>{content.leadResults.pipeline.map((step, index) => <Fragment key={`${step}-${index}`}><span>{step}</span>{index < content.leadResults.pipeline.length - 1 && <i>→</i>}</Fragment>)}</div><p>{content.leadResults.pipelineNote}</p></div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="section-heading split-heading"><div><p className="eyebrow">{content.pricing.eyebrow}</p><KineticHeading lines={content.pricing.heading} /></div><div><p><KaraokeText text={content.pricing.intro} /></p><BookCall /></div></div>
          <div className="pricing-grid">
            {content.pricing.items.map((plan, index) => <article className={plan.featured ? "price-card featured" : "price-card"} key={`${plan.name}-${index}`}>{plan.featured && <span className="popular">{content.pricing.popularLabel}</span>}<header><p>{plan.name}</p><span>{plan.volume}</span></header><h3>{plan.price}<small>{content.pricing.billingSuffix}</small></h3><p>{plan.description}</p><ul>{plan.features.map((feature, featureIndex) => <li key={`${feature}-${featureIndex}`}><span>＋</span>{feature}</li>)}</ul><a href={content.brand.bookingLink}>{content.pricing.cardCta} <span>↗</span></a></article>)}
          </div>
          <p className="pricing-note">{content.pricing.note}</p>
        </section>

        <section className="faq-section" id="faq">
          <div className="faq-sticky"><p className="eyebrow">{content.faq.eyebrow}</p><KineticHeading lines={content.faq.heading} /><p><KaraokeText text={content.faq.intro} /></p><BookCall /></div>
          <div className="faq-list">{content.faq.items.map(({ question, answer }, index) => <article className={activeFaq === index ? "open" : ""} key={`${question}-${index}`}><button type="button" onClick={() => setActiveFaq(activeFaq === index ? null : index)} aria-expanded={activeFaq === index}><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><i>{activeFaq === index ? "−" : "+"}</i></button><div className="faq-answer"><p>{answer}</p></div></article>)}</div>
        </section>

        <section className="book-section" id="book-call">
          <PortalField className="book-field" />
          <div className="book-orbit" aria-hidden="true"><span /><span /><span /></div>
          <p className="eyebrow">{content.book.eyebrow}</p>
          <KineticHeading lines={content.book.heading} accentLine={content.book.heading.length - 1} />
          <p><KaraokeText text={content.book.intro} /></p>
          <a className="book-button" href={content.brand.bookingLink}>{content.book.cta} <span>↗</span></a>
          <footer><span>© {new Date().getFullYear()} {content.book.copyright}</span><a href={`mailto:${content.book.email}`}>{content.book.email}</a><a href="#top">{content.book.backToTop}</a></footer>
        </section>
      </main>
    </div>
    </ContentContext.Provider>
  );
}
