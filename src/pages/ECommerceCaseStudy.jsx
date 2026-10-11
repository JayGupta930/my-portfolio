import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HeroIllustration,
  ProcessIllustration,
  Shop,
  Sketch,
} from "../components/ECommerce/Illustrations";
import {
  AdminPanelShowcase,
  BrowserFrame,
  StorefrontShowcase,
  StorefrontOverview,
  AdminOverview,
} from "../components/ECommerce/CommerceDemo";
import { commerceProjects } from "../components/ECommerce/projectData";
import {
  ProblemStories,
  ProblemOverview,
  AdminCapabilities,
  EcosystemTransition,
  CustomerJourney,
  BeforeAfter,
} from "../components/ECommerce/Storytelling";
import "./ECommerceCaseStudy.css";
import "../components/ECommerce/Overview.css";

const sections = [
  ["problem", "Problem"],
  ["storefront", "Storefront"],
  ["admin", "Admin"],
];
const extraLabels = {
  process: "How I build",
  "real-projects": "Actual projects",
  solutions: "Your solution",
  build: "Let's talk",
};
const stages = [
  [
    "Discover",
    "Understand the business, products, audience, requirements, and customer journey.",
  ],
  [
    "Design",
    "Shape the visual identity, storefront structure, and responsive shopping experience.",
  ],
  [
    "Develop",
    "Connect the frontend, backend, database, admin workflows, and agreed integrations.",
  ],
  [
    "Test & Launch",
    "Validate responsive layouts, core workflows, checkout, integrations, and deployment.",
  ],
];

function revealSection(id, smooth) {
  const target = document.getElementById(id);
  if (!target) return;
  let parent = target;
  while (parent) {
    if (parent.tagName === "DETAILS") parent.open = true;
    parent = parent.parentElement;
  }
  requestAnimationFrame(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: smooth && !reduce ? "smooth" : "instant",
      block: "start",
    });
    const focusTarget =
      target.tagName === "DETAILS" ? target.querySelector("summary") : target;
    focusTarget.focus({ preventScroll: true });
  });
}

function StoryArrow({ note }) {
  return (
    <div className="ec-story-arrow" aria-hidden="true">
      <span className="ec-note">{note}</span>
      <svg
        viewBox="0 0 260 58"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M8 12C90-9 205 6 239 45m-19-5 20 7-2-18" />
      </svg>
    </div>
  );
}

function OverviewStep({
  id,
  number,
  label,
  title,
  summary,
  detail,
  link,
  children,
}) {
  return (
    <section
      id={id}
      className="ec-section ec-overview-step"
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
    >
      <div className="ec-overview-copy">
        <p className="ec-eyebrow">
          <span>{number}</span> / {label}
        </p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{summary}</p>
        <a className="ec-overview-link" href={`#${detail}`}>
          {link} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="ec-overview-art">{children}</div>
    </section>
  );
}

function HandDrawnArrow({ next, note }) {
  return (
    <a
      className="ec-connector"
      href={`#${next}`}
      aria-label={`Continue to ${sections.find((s) => s[0] === next)?.[1] || extraLabels[next]}`}
    >
      <span className="ec-note">{note}</span>
      <svg
        viewBox="0 0 300 106"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          className="ec-draw"
          pathLength="1"
          d="M23 9c129-13 237 23 173 48-38 15-70-1-46-18 33-23 79 25 71 58m-12-12 12 13 13-13"
        />
      </svg>
    </a>
  );
}

function IllustratedSection({
  id,
  index,
  title,
  intro,
  children,
  className = "",
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      className={`ec-section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <header className="ec-section-heading">
        <p className="ec-eyebrow">
          <span>{index ? String(index).padStart(2, "0") : "↗"}</span> /{" "}
          {sections.find(([key]) => key === id)?.[1] || extraLabels[id]}
        </p>
        <h2 id={`${id}-title`}>{title}</h2>
        {intro && <p className="ec-intro">{intro}</p>}
      </header>
      {children}
    </section>
  );
}

function ProjectPreview({ project, index }) {
  const [view, setView] = useState("Storefront");
  const screenshot =
    view === "Catalog" ? project.catalogScreenshot : project.screenshot;
  return (
    <article className={`ec-project-feature ec-project-feature-${index}`}>
      <div className="ec-project-preview">
        <BrowserFrame title={`${project.name} · ${view}`}>
          <a
            href={screenshot}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} ${view.toLowerCase()} screenshot at full size`}
          >
            <img
              src={screenshot}
              alt={`${project.name} ${view.toLowerCase()} screenshot supplied by the project owner`}
              loading="lazy"
              width="1520"
              height="733"
            />
          </a>
        </BrowserFrame>
        <div
          className="ec-preview-tabs"
          aria-label={`${project.name} screenshot views`}
        >
          {(project.catalogScreenshot
            ? ["Storefront", "Catalog"]
            : ["Storefront"]
          ).map((item) => (
            <button
              key={item}
              aria-pressed={view === item}
              onClick={() => setView(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="ec-project-copy">
        <span className="ec-eyebrow">0{index + 1} / PROJECT SKETCHBOOK</span>
        <h3>{project.name}</h3>
        <p>{project.context}</p>
        <p className="ec-note">{project.note}</p>
        <p className="ec-preview-caption">
          Visible in the supplied screenshots:
        </p>
        <ul>
          {project.capabilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="ec-actions">
          {project.caseStudyUrl && (
            <a href={project.caseStudyUrl}>View Case Study ↗</a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              Live Demo ↗
            </a>
          )}
          <a href={screenshot} target="_blank" rel="noreferrer">
            View full-size preview ↗
          </a>
        </div>
      </div>
    </article>
  );
}

function ProjectShowcase() {
  const available = commerceProjects.filter((project) => project.screenshot);
  return (
    <>
      {available.map((project, index) => (
        <ProjectPreview key={project.name} project={project} index={index} />
      ))}
      {available.length < commerceProjects.length && (
        <div className="ec-project-note">
          <span className="ec-note">the next pages in the sketchbook</span>
          <div>
            {commerceProjects
              .filter((p) => !p.screenshot)
              .map((project) => (
                <p key={project.name}>
                  <strong>{project.name}</strong>
                  <span>{project.context}</span>
                </p>
              ))}
          </div>
          <p>
            Project screenshots are being added. Detailed capabilities and live
            links will appear once verified.
          </p>
        </div>
      )}
      <Link className="ec-text-link" to="/projects">
        Explore all portfolio projects ↗
      </Link>
    </>
  );
}

function SolutionComparison() {
  return (
    <>
      <svg
        className="ec-fork"
        viewBox="0 0 700 90"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M350 0v25C351 63 165 15 165 82m-11-12 11 13 12-13M350 25c0 38 186-10 186 57m-11-12 11 13 12-13" />
      </svg>
      <div className="ec-solutions">
        {[
          {
            title: "Ready-to-launch platform",
            label: "A / A CLEAR STARTING POINT",
            text: "For businesses that fit an existing e-commerce structure, with a defined feature set and agreed customization.",
            items: [
              "Storefront and product catalog setup",
              "Brand customization",
              "Agreed shopping features",
              "Deployment and launch support",
            ],
            cta: "Explore Ready-to-Launch",
            topic: "ready-to-launch",
          },
          {
            title: "Custom e-commerce development",
            label: "B / BUILT AROUND YOUR BUSINESS",
            text: "For a tailored customer experience, specialized workflows, or business-specific integrations.",
            items: [
              "Custom UI/UX and business workflows",
              "Required backend integrations",
              "Custom administration features",
              "Agreed deployment and support",
            ],
            cta: "Discuss a Custom Project",
            topic: "custom-ecommerce",
          },
        ].map((solution, i) => (
          <article key={solution.topic}>
            <div className="ec-solution-art">
              {i === 0 ? (
                <Sketch label="A ready-to-launch storefront">
                  <Shop x={63} y={40} />
                  <path
                    d="m252 50 8 9 20-26"
                    stroke="var(--ec-accent)"
                    strokeWidth="3"
                  />
                </Sketch>
              ) : (
                <ProcessIllustration type={1} />
              )}
            </div>
            <p className="ec-eyebrow">{solution.label}</p>
            <h3>{solution.title}</h3>
            <p>{solution.text}</p>
            <ul>
              {solution.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="ec-scope">
              Potential deliverables, subject to agreed scope.
            </p>
            <Link
              className={`ec-button ${i ? "ec-button-outline" : ""}`}
              to={`/contact?topic=${solution.topic}`}
            >
              {solution.cta} ↗
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

export default function ECommerceCaseStudy() {
  const [active, setActive] = useState("problem");
  const [orders, setOrders] = useState([]);
  const mainRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "From Scattered Chats to a Smarter Store — Jay Gupta";
    const elements = [...mainRef.current.querySelectorAll(".ec-section")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("ec-in-view");
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    const updateActive = () => {
      const reached = [
        ...mainRef.current.querySelectorAll(
          ".ec-overview-step, .ec-detail-chapter[open]",
        ),
      ].filter(
        (element) =>
          element.getBoundingClientRect().top <= window.innerHeight * 0.4,
      );
      setActive(
        reached.at(-1)?.dataset.chapter || reached.at(-1)?.id || "problem",
      );
    };
    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActive);
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    revealSection(id, false);
  }, [location.hash]);

  function handleAnchor(event) {
    const anchor = event.target.closest('a[href^="#"]');
    if (
      !anchor ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target = document.getElementById(anchor.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    history.pushState(history.state, "", anchor.hash);
    revealSection(target.id, true);
  }

  return (
    <main className="ec-page" ref={mainRef} onClick={handleAnchor}>
      <a className="ec-skip" href="#storefront-demo">
        Skip to interactive demo
      </a>
      <div className="ec-page-top">
        <Link to="/projects">← Back to projects</Link>
        <span>A VISUAL E-COMMERCE STORY / BY JAY GUPTA</span>
      </div>
      <nav className="ec-section-nav" aria-label="Case study chapters">
        {sections.map(([id, label], i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`${i + 1}. ${label}`}
            aria-current={active === id ? "step" : undefined}
          >
            <span>0{i + 1}</span>
            <span className="ec-nav-label">{label}</span>
          </a>
        ))}
      </nav>
      <section
        id="idea"
        className="ec-section ec-hero"
        tabIndex={-1}
        aria-labelledby="idea-title"
      >
        <div className="ec-hero-copy">
          <p className="ec-eyebrow">
            <span>THE CONCEPT</span> / THE IDEA → THE EXPERIENCE
          </p>
          <h1 id="idea-title">
            From Scattered Chats to a <span>Smarter Online Store.</span>
          </h1>
          <p>
            An organized shopping experience for customers. A central control
            panel for the business behind it.
          </p>
          <ul className="ec-hero-labels">
            <li>Organized Product Catalog</li>
            <li>Seamless Shopping Journey</li>
            <li>Centralized Store Management</li>
          </ul>
          <a className="ec-button" href="#problem">
            See How It Works <span>↗</span>
          </a>
          <p className="ec-note">
            Good products deserve a great little corner of the internet.
          </p>
        </div>
        <div className="ec-hero-art">
          <span className="ec-art-caption">THE BIG PICTURE, SKETCHED OUT.</span>
          <HeroIllustration />
          <span className="ec-hero-stamp">
            PRODUCTS + PEOPLE
            <br />+ A CONNECTED STORE
          </span>
        </div>
      </section>
      <HandDrawnArrow next="problem" note="first, untangle the everyday" />
      <div className="ec-quick-story" aria-label="The story in three steps">
        <OverviewStep
          id="problem"
          number="01"
          label="The problem"
          title={
            <>
              Selling Is Easy.
              <br />
              <span>Managing Isn't.</span>
            </>
          }
          summary="Scattered chats, no organized catalog, size confusion, and manual order management."
          detail="problem-details"
          link="Understand the challenges"
        >
          <ProblemOverview />
        </OverviewStep>
        <StoryArrow note="give every product a place" />
        <OverviewStep
          id="storefront"
          number="02"
          label="The storefront"
          title={
            <>
              Everything Customers
              <br />
              <span>Need to Shop.</span>
            </>
          }
          summary="One organized catalog for products, sizes, variants, cart, and checkout."
          detail="storefront-demo"
          link="Try the shopping journey"
        >
          <StorefrontOverview />
        </OverviewStep>
        <StoryArrow note="one order, both sides connected" />
        <OverviewStep
          id="admin"
          number="03"
          label="The control room"
          title={
            <>
              The Business,
              <br />
              <span>Organized in One Place.</span>
            </>
          }
          summary="Products, orders, inventory, and customer information in one central interface."
          detail="admin-demo"
          link="Explore the control room"
        >
          <AdminOverview />
        </OverviewStep>
      </div>
      <section
        className="ec-deeper ec-section"
        id="full-story"
        tabIndex={-1}
        aria-labelledby="full-story-title"
      >
        <header className="ec-section-heading">
          <p className="ec-eyebrow">THE FULL STORY / GO AS DEEP AS YOU LIKE</p>
          <h2 id="full-story-title">
            Want to See How It
            <br />
            <span>All Comes Together?</span>
          </h2>
          <p className="ec-intro">
            Explore the challenges, the thinking behind the solution, and how a
            connected e-commerce system can simplify everyday operations.
          </p>
        </header>
        <details
          className="ec-detail-chapter"
          id="problem-details"
          data-chapter="problem"
        >
          <summary>
            <span className="ec-detail-number">01</span>
            <span>
              <strong>Understanding the Problems</strong>
              <small>Five everyday challenges, illustrated.</small>
            </span>
            <span className="ec-expand-mark" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="ec-chapter-body">
            <ProblemStories />
            <EcosystemTransition />
          </div>
        </details>
        <details
          className="ec-detail-chapter"
          id="storefront-details"
          data-chapter="storefront"
        >
          <summary>
            <span className="ec-detail-number">02</span>
            <span>
              <strong>How the Storefront Helps</strong>
              <small>From finding a product to placing a sample order.</small>
            </span>
            <span className="ec-expand-mark" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="ec-chapter-body">
            <p className="ec-detail-intro">
              A catalog answers the first questions. Product details and
              available sizes help customers choose; a bag and checkout bring
              those choices into one order.
            </p>
            <div id="storefront-demo" className="ec-demo-anchor" tabIndex={-1}>
              <div className="ec-demo-disclosure">
                <span className="ec-status-dot" /> INTERACTIVE CONCEPT{" "}
                <span>
                  Fictional products. No payments or personal details.
                </span>
              </div>
              <StorefrontShowcase
                onOrder={(order) => setOrders((current) => [...current, order])}
              />
            </div>
            <CustomerJourney />
          </div>
        </details>
        <details
          className="ec-detail-chapter"
          id="admin-details"
          data-chapter="admin"
        >
          <summary>
            <span className="ec-detail-number">03</span>
            <span>
              <strong>How the Admin Portal Helps</strong>
              <small>See the same order from the business owner's side.</small>
            </span>
            <span className="ec-expand-mark" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="ec-chapter-body">
            <p className="ec-detail-intro">
              Keep product images, categories, pricing, order status, stock, and
              customer context in one workspace. Place a demo order above, then
              follow it here.
            </p>
            <div id="admin-demo" className="ec-demo-anchor" tabIndex={-1}>
              <AdminPanelShowcase
                orders={orders}
                onProcess={(index) =>
                  setOrders((current) =>
                    current.map((order, i) =>
                      i === index ? { ...order, status: "Processed" } : order,
                    ),
                  )
                }
                onReset={() => setOrders([])}
              />
            </div>
            <AdminCapabilities />
          </div>
        </details>
      </section>
      <BeforeAfter />
      <details className="ec-more">
        <summary>From sketch to launch: my process</summary>
        <IllustratedSection
          id="process"
          index={0}
          title={
            <>
              From Sketch
              <br />
              to <span>Store Launch.</span>
            </>
          }
          intro="A thoughtful process, from the first conversation to the final checks."
        >
          <div className="ec-roadmap">
            {stages.map(([title, description], i) => (
              <article key={title}>
                <ProcessIllustration type={i} />
                <div className="ec-roadmap-step">
                  <span>0{i + 1}</span>
                  <svg
                    viewBox="0 0 160 30"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 18q65-22 147-1m-11-8 13 8-13 8" />
                  </svg>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </IllustratedSection>
      </details>
      <HandDrawnArrow
        next="real-projects"
        note="from the board to the browser"
      />
      <IllustratedSection
        id="real-projects"
        index={0}
        title={
          <>
            Different Businesses.
            <br />
            <span>Different Solutions.</span>
          </>
        }
        intro="The concept above explains the possibilities. These separate projects show my actual storefront work."
      >
        <ProjectShowcase />
      </IllustratedSection>
      <details className="ec-more">
        <summary>Find the right approach for your business</summary>
        <HandDrawnArrow
          next="solutions"
          note="now, where does your story begin?"
        />
        <IllustratedSection
          id="solutions"
          index={0}
          title={
            <>
              Your Business.
              <br />
              <span>Your Way to Sell Online.</span>
            </>
          }
          intro="Two starting points. One shared goal: a store that fits your business."
        >
          <SolutionComparison />
        </IllustratedSection>
      </details>
      <HandDrawnArrow
        next="build"
        note="let’s make something that works for you"
      />
      <IllustratedSection
        id="build"
        index={0}
        title={
          <>
            Your E-commerce
            <br />
            Journey <span>Starts Here.</span>
          </>
        }
        className="ec-final"
      >
        <div className="ec-final-layout">
          <div>
            <p className="ec-intro">
              Whether you need a ready-to-launch store or a tailored e-commerce
              solution, let’s find the right fit for your business.
            </p>
            <div className="ec-actions">
              <Link className="ec-button" to="/contact?topic=ecommerce-quote">
                Get a Quote →
              </Link>
              <Link className="ec-text-link" to="/contact?topic=ecommerce">
                Discuss Your Project ↗
              </Link>
            </div>
            <p className="ec-note">Your idea. Our next conversation.</p>
          </div>
          <HeroIllustration complete />
        </div>
      </IllustratedSection>
    </main>
  );
}
