import { useEffect, useRef } from "react";
import {
  Sketch,
  Person,
  Box,
  Shop,
  ProblemIllustration,
} from "./Illustrations";
import "./Storytelling.css";

function CurvedLink({ to, children }) {
  return (
    <a className="ec-problem-link" href={to}>
      <svg
        viewBox="0 0 100 42"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M3 29C28 3 64 7 92 25m-14-1 15 2-7-13" />
      </svg>
      <span>{children}</span>
    </a>
  );
}

function Label({ x, y, children }) {
  return (
    <text x={x} y={y} className="ec-svg-note" fill="currentColor" stroke="none">
      {children}
    </text>
  );
}

function DashboardDrawing() {
  return (
    <g>
      <path fill="var(--ec-paper)" d="m31 32 258 3-2 158-257-3Z" />
      <path d="M32 57h255M92 58v131M45 77h32m-32 22h25m-25 22h29m-29 23h22" />
      <path
        stroke="var(--ec-accent)"
        d="m110 77 161 1m-161 28 161 1m-161 28 161 1m-161 28 161 1"
      />
      <path d="m115 91 5 5 9-10m-14 39 5 5 9-10m-14 39 5 5 9-10m22-58h75m-75 29h75m-75 28h75" />
      <Label x={119} y={222}>
        one shared workspace
      </Label>
    </g>
  );
}

function BusinessProblemScene({ type }) {
  if (type === 1) return <ProblemIllustration type={1} />;
  return (
    <Sketch
      label={
        [
          "Instagram and WhatsApp conversations scatter addresses, payment notes, and orders around an owner and notebook",
          "",
          "T-shirt size cards marked S, M, L and XL with uncertain availability and inventory boxes",
          "An order book with pending, confirmed, shipped and delivered notes scattered around it",
          "Disconnected product, image, price and stock records surrounding an empty central workspace",
        ][type]
      }
      viewBox="0 0 400 270"
    >
      {type === 0 && (
        <>
          <g transform="translate(146 60) scale(.8)">
            <Person working />
          </g>
          <path fill="var(--ec-paper)" d="m211 165 93-8 8 70-94 10Z" />
          <path d="m228 181 59-6m-57 20 62-6m-59 21 43-5" />
          {[
            [8, 15, "Instagram"],
            [234, 13, "WhatsApp"],
            [8, 139, "address?"],
            [266, 95, "paid?"],
          ].map(([x, y, label]) => (
            <g key={label} transform={`translate(${x} ${y})`}>
              <path fill="var(--ec-paper)" d="M2 2h120v42H40L25 56V44H2Z" />
              <Label x={12} y={29}>
                {label}
              </Label>
            </g>
          ))}
          <path
            stroke="var(--ec-accent)"
            d="M91 82q-4 30 48 40m-9-12 10 12-15 2M292 63q-8 14-41 21M56 208q25 45 126 17m-13-7 15 7-11 8"
          />
        </>
      )}
      {type === 2 && (
        <>
          {["S", "M", "L", "XL"].map((size, i) => (
            <g
              key={size}
              transform={`translate(${15 + i * 96} ${25 + (i % 2) * 16})`}
            >
              <path
                fill="var(--ec-paper)"
                d="m22 3-19 17 13 18 9-6-3 49 50 1-2-50 10 7 11-18L72 4 59 12H36Z"
              />
              <Label x={37} y={55}>
                {size}
              </Label>
              <path stroke="var(--ec-accent)" d="M24 99h44" />
              <Label x={32} y={124}>
                ?
              </Label>
            </g>
          ))}
          <Box x={36} y={175} />
          <path d="m161 195 101-10 5 57-101 9Z" />
          <Label x={176} y={221}>
            check stock
          </Label>
          <path
            stroke="var(--ec-accent)"
            d="M313 163q39 53-37 64m12-9-12 9 14 5"
          />
        </>
      )}
      {type === 3 && (
        <>
          <path
            fill="var(--ec-paper)"
            d="M77 49q53-14 120 1 62-14 128 2l-6 165q-57-12-122 0-62-14-119-1Z"
          />
          <path d="M197 52v160m-100-139 79 3m-80 19 78 4m-79 21 79 3m-79 21 79 3m-79 21 64 3m58-93 80-1m-80 26 66-1m-66 27 75-1" />
          {[
            [12, 21, "pending"],
            [233, 24, "confirmed"],
            [9, 243, "shipped?"],
            [253, 249, "delivered?"],
          ].map(([x, y, label]) => (
            <Label key={label} x={x} y={y}>
              {label}
            </Label>
          ))}
          <path
            stroke="var(--ec-accent)"
            d="M44 91q-49 78 20 94m-10-13 10 13-16 1M337 68q51 62 0 110m4-15-4 15 14-6"
          />
        </>
      )}
      {type === 4 && (
        <>
          {[
            [13, 17, "photos"],
            [256, 12, "prices"],
            [14, 191, "products"],
            [253, 190, "stock"],
          ].map(([x, y, label]) => (
            <g key={label} transform={`translate(${x} ${y})`}>
              <path fill="var(--ec-paper)" d="m0 0 113 4-3 45-112-3Z" />
              <Label x={12} y={30}>
                {label}
              </Label>
            </g>
          ))}
          <path
            strokeDasharray="4 6"
            d="M100 76 154 105m143-32-58 32M111 183l42-25m136 25-49-25"
          />
          <path fill="var(--ec-paper)" d="m147 92 99 2-1 71-100-2Z" />
          <Label x={171} y={132}>
            one place?
          </Label>
        </>
      )}
    </Sketch>
  );
}

const businessProblems = [
  {
    title: "Orders Scattered Everywhere",
    text: "Enquiries, addresses, and order details live in different conversations.",
    detail:
      "An order starts in Instagram DMs, the address arrives on WhatsApp, and the payment confirmation lives in another chat. Remembering who ordered what becomes a job of its own.",
    notes: [
      "Lost customer details",
      "Missed follow-ups",
      "“Who ordered this?”",
    ],
    solution: "Bring orders into one queue",
    target: "#admin-demo",
  },
  {
    title: "No Proper Product Catalog",
    text: "Photos, prices, and descriptions are scattered across posts and messages.",
    detail:
      "Every enquiry starts the same loop: send photos, repeat prices, check availability. Without one place to browse, a customer can leave before finding the right product.",
    notes: [
      "Photos across posts",
      "Repeat price questions",
      "No complete view",
    ],
    solution: "Give every product a place",
    target: "#storefront-demo",
  },
  {
    title: "Sizes, Variants & Stock Confusion",
    text: "Customers have to ask about every size, color, and available option.",
    detail:
      "“Is medium available in black?” Manually checking every size and variant slows the conversation. Outdated stock notes can turn a promising order into a delay or cancellation.",
    notes: ["S / M / L / XL", "Confirm one by one", "Availability changes"],
    solution: "Plan clear options and stock visibility",
    target: "#storefront-demo",
  },
  {
    title: "Manual Order Management",
    text: "Owners copy customer details and track each order status by hand.",
    detail:
      "Copying details into a notebook is only the start. Pending, confirmed, shipped, delivered: each update needs attention, and finding an old order means searching all over again.",
    notes: [
      "Copy. Check. Repeat.",
      "Where is that order?",
      "More orders, more admin",
    ],
    solution: "Follow an order through the demo",
    target: "#admin-demo",
  },
  {
    title: "No Centralized Business Control",
    text: "Product updates and stock notes get harder to organize as the store grows.",
    detail:
      "A price changes here, a photo changes there, and the stock list sits somewhere else. Social media brings attention; the growing catalog still needs an organized place to operate.",
    notes: ["Disconnected updates", "A growing catalog", "No shared overview"],
    solution: "Connect the shop and the control room",
    target: "#admin-demo",
  },
];

export function ProblemStories() {
  return (
    <div className="ec-problem-stories">
      {businessProblems.map((problem, i) => (
        <article
          className={`ec-problem-story ec-problem-story-${i}`}
          key={problem.title}
        >
          <div className="ec-problem-scene">
            <BusinessProblemScene type={i} />
            <div className="ec-scene-notes">
              {problem.notes.map((note) => (
                <span className="ec-note" key={note}>
                  {note}
                </span>
              ))}
            </div>
          </div>
          <div className="ec-problem-copy">
            <p className="ec-eyebrow">FRICTION / 0{i + 1}</p>
            <h3>{problem.title}</h3>
            <p>{problem.detail}</p>
            <CurvedLink to={problem.target}>{problem.solution}</CurvedLink>
          </div>
        </article>
      ))}
    </div>
  );
}

export function EcosystemTransition() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          ref.current.classList.add("ec-organized");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      id="ecosystem"
      tabIndex={-1}
      className="ec-ecosystem"
      aria-labelledby="ecosystem-title"
    >
      <p className="ec-note">less scattered. more connected.</p>
      <h3 id="ecosystem-title">
        What If Everything Worked
        <br />
        <span>From One Place?</span>
      </h3>
      <p className="ec-intro">
        Instead of managing products, enquiries, and orders across disconnected
        conversations and spreadsheets, bring the shopping experience and
        business operations into one organized system.
      </p>
      <div className="ec-ecosystem-board">
        <div className="ec-ecosystem-input">
          <BusinessProblemScene type={4} />
          <span className="ec-note">all the loose ends…</span>
        </div>
        <svg
          className="ec-merge-arrow"
          viewBox="0 0 150 130"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            pathLength="1"
            d="M3 10C70 10 30 63 137 64M3 65h134M3 120c67 0 27-55 134-56m-19-12 21 12-21 13"
          />
        </svg>
        <div className="ec-ecosystem-hub">
          <Sketch
            label="One storefront connected to one management workspace"
            viewBox="0 0 430 255"
          >
            <Shop x={15} y={24} scale={0.9} />
            <g transform="translate(183 60) scale(.72)">
              <DashboardDrawing />
            </g>
            <path
              stroke="var(--ec-accent)"
              d="M128 202q80 51 190 8m-16-4 17 4-10 13"
            />
            <Label x={21} y={195}>
              the customer
            </Label>
            <Label x={260} y={36}>
              the business
            </Label>
          </Sketch>
        </div>
      </div>
      <ol className="ec-transformation-flow">
        {[
          "Scattered Chats",
          "Organized Storefront",
          "Centralized Admin Portal",
        ].map((label, i) => (
          <li key={label}>
            <span>0{i + 1}</span>
            {label}
            {i < 2 && <b aria-hidden="true">↝</b>}
          </li>
        ))}
      </ol>
      <p className="ec-muted">
        An illustrative system design. The working demo below shows the
        catalog-to-order connection; production features depend on the agreed
        scope.
      </p>
    </div>
  );
}

export function CustomerJourney() {
  return (
    <div id="customer-journey" tabIndex={-1} className="ec-detailed-journey">
      <p className="ec-note">from “how much?” to “here’s my order”</p>
      <ol>
        {[
          [
            "Browse Products",
            "Explore one catalog and filter by category.",
            "Try it in the demo",
          ],
          [
            "Discover Product Details",
            "Open an item for its image, description, and price.",
            "Try it in the demo",
          ],
          [
            "Choose Size or Variant",
            "Make available options clear before buying.",
            "Try it in the demo",
          ],
          [
            "Add to Cart",
            "Collect products, check the total, or remove an item.",
            "Try it in the demo",
          ],
          [
            "Checkout",
            "Review the bag before placing a sample order.",
            "Demo uses a fictional customer",
          ],
          [
            "Place an Order",
            "Send the sample order to the connected admin view.",
            "Simulated · no payment",
          ],
        ].map(([title, text, status], i) => (
          <li key={title}>
            <span className="ec-journey-number">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <small>{status}</small>
          </li>
        ))}
      </ol>
      <p className="ec-muted">
        A production checkout would collect the required delivery details. This
        demonstration collects no personal information and has no payment
        integration.
      </p>
    </div>
  );
}

export function AdminCapabilities() {
  return (
    <div className="ec-control-notes">
      <p className="ec-note">one workspace, a clearer next step ↴</p>
      <div>
        {[
          [
            "01",
            "Product information",
            "Names, prices, and categories together in a read-only sample catalog.",
            "Product creation, editing, and image uploads require a scoped implementation.",
          ],
          [
            "02",
            "Order management",
            "Incoming demo orders show items, quantities, totals, and a New → Processed status.",
            "Try placing an order above, then mark it processed below.",
          ],
          [
            "03",
            "Inventory context",
            "The inventory view pairs each product with a clearly labeled sample stock count.",
            "Live stock, size-level availability, and automatic deduction are not connected.",
          ],
          [
            "04",
            "Customer context",
            "A fictional customer record keeps the demo order count in context.",
            "All customer records and sales analytics are fictional demonstration data.",
          ],
        ].map(([number, title, text, note]) => (
          <article key={number}>
            <span className="ec-eyebrow">{number} / CONTROL ROOM</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <small>{note}</small>
            <svg
              viewBox="0 0 130 42"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6q94-13 104 29m-12-8 12 9 6-14" />
            </svg>
          </article>
        ))}
      </div>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <div className="ec-before-after" aria-labelledby="ec-before-after-title">
      <header>
        <p className="ec-eyebrow">
          THE TRANSFORMATION / TWO SIDES OF THE SAME BUSINESS
        </p>
        <h3 id="ec-before-after-title">
          Same products.
          <br />
          <span>A more connected way to work.</span>
        </h3>
      </header>
      <div className="ec-comparison-scenes">
        <article>
          <span className="ec-note">before: keep checking the chats</span>
          <BusinessProblemScene type={0} />
          <h4>Selling Through Scattered Conversations</h4>
          <ul>
            <li>Product photos shared one by one</li>
            <li>Repeated price and size questions</li>
            <li>Orders copied into a notebook</li>
            <li>Stock notes that need checking</li>
            <li>Customer details across chats</li>
          </ul>
        </article>
        <svg
          className="ec-before-after-arrow"
          viewBox="0 0 150 140"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          aria-hidden="true"
        >
          <path pathLength="1" d="M5 68c35-74 74-63 115-4m-32-3 36 7-7-35" />
        </svg>
        <article>
          <span className="ec-note">after: give the work a home</span>
          <Sketch label="An organized order management workspace">
            <DashboardDrawing />
          </Sketch>
          <h4>A Centralized E-commerce System</h4>
          <ul>
            <li>One organized product catalog</li>
            <li>Clear product information and supported options</li>
            <li>A structured shopping journey</li>
            <li>Orders in one management interface</li>
            <li>One place for supported store operations</li>
          </ul>
        </article>
      </div>
      <p className="ec-muted">
        Illustrative before-and-after workflows, not measured client results.
        Available options and operations depend on the actual implementation.
      </p>
    </div>
  );
}

export function ProblemOverview() {
  return (
    <div className="ec-chaos-overview">
      <Sketch
        label="Instagram and WhatsApp messages, scattered product photos, size questions and handwritten orders connected by tangled arrows"
        viewBox="0 0 600 340"
      >
        <g transform="translate(241 106) scale(.85)">
          <Person working />
        </g>
        <g transform="rotate(-5 120 70)">
          <path fill="var(--ec-paper)" d="M20 25h186v68h-38l-23 21 2-21H20Z" />
          <Label x={35} y={49}>
            Instagram
          </Label>
          <text x="35" y="75" fill="#c6afdF" stroke="none" fontSize="13">
            How much? Size M?
          </text>
        </g>
        <g transform="rotate(4 470 69)">
          <path
            fill="var(--ec-paper)"
            d="M380 29h188v72H434l-23 19 3-19h-34Z"
          />
          <Label x={396} y={54}>
            WhatsApp
          </Label>
          <text x="396" y="81" fill="#c6afdf" stroke="none" fontSize="13">
            Sent my address…
          </text>
        </g>
        <g transform="translate(35 145) rotate(-10)">
          <path fill="#211632" d="M0 0h115v124H0Z" />
          <path
            d="m28 34 19-9q11 12 22 0l20 9-12 23-9-5v39H44V52l-8 5Z"
            stroke="#c9a6ff"
          />
          <path d="M12 108h89" />
          <Label x={12} y={-10}>
            photos here…
          </Label>
        </g>
        <g transform="translate(422 165) rotate(7)">
          <path
            fill="#211632"
            d="M0 0h139v123l-13-7-13 7-13-7-13 7-13-7-13 7-13-7-13 7-13-7-9 7Z"
          />
          <Label x={14} y={28}>
            order #?
          </Label>
          <path d="M15 45h101M15 65h77M15 85h95" stroke="#ad8ccc" />
          <text x="14" y="110" fill="#bda1dc" stroke="none" fontSize="12">
            paid / packed / ?
          </text>
        </g>
        <path
          d="M209 53c73-3 22 72 126 63m-13-9 15 9-16 9M398 144c-29-17-12-52-59-40m7-10-9 11 14 6M141 243c63 45 105-29 63-30s4 62 89 53m-14-7 17 7-15 9M403 257c-40-25-3-74-55-72m11-8-14 9 13 8"
          stroke="#9e6be2"
          strokeDasharray="5 5"
        />
        <Label x={195} y={324}>
          one sale. so many loose ends.
        </Label>
        <g transform="rotate(-9 328 45)">
          <path d="M260 12h112v48H260Z" fill="#221239" stroke="#b18adf" />
          <Label x={269} y={42}>
            S? M? XL?
          </Label>
        </g>
      </Sketch>
    </div>
  );
}
