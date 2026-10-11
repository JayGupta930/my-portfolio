import { useEffect, useId, useRef, useState } from "react";
import "./PremiumDemo.css";

const products = [
  {
    id: "tee",
    name: "The essential tee",
    category: "Essentials",
    price: 890,
    color: "#ab8cdb",
    kind: "tee",
    stock: 42,
    detail:
      "A relaxed silhouette in heavyweight cotton. Soft lilac, made for everyday layering.",
  },
  {
    id: "shirt",
    name: "Sunday overshirt",
    category: "Layers",
    price: 2490,
    color: "#7672c0",
    kind: "shirt",
    stock: 18,
    detail:
      "An easy, structured layer with a soft brushed finish. Dusky indigo, roomy through the shoulders.",
  },
  {
    id: "hoodie",
    name: "Off-duty hoodie",
    category: "Layers",
    price: 1890,
    color: "#c0a3ed",
    kind: "hoodie",
    stock: 6,
    detail:
      "Soft fleece, a generous hood, and a dropped shoulder. Your slow-day uniform in washed lavender.",
  },
];
const money = (value) => `₹${Math.round(value).toLocaleString("en-IN")}`;

export function BrowserFrame({ title, children, className = "" }) {
  return (
    <div className={`ec-browser ${className}`}>
      <div className="ec-browser-bar">
        <span aria-hidden="true">● ● ●</span>
        <span>{title}</span>
        <span aria-hidden="true">↗</span>
      </div>
      {children}
    </div>
  );
}

function Garment({ product }) {
  const id = useId();
  return (
    <svg
      className="ec-garment"
      viewBox="0 0 260 280"
      role="img"
      aria-label={`${product.name}, ${product.kind === "shirt" ? "indigo" : product.kind === "tee" ? "lilac" : "lavender"} clothing illustration`}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1" y2="1">
          <stop stopColor={product.color} />
          <stop offset=".5" stopColor={product.color} />
          <stop offset="1" stopColor="#34264e" />
        </linearGradient>
      </defs>
      <ellipse cx="130" cy="252" rx="79" ry="9" fill="#b58be9" opacity=".1" />
      <path
        d={
          product.kind === "tee"
            ? "M94 46 65 57 23 113 60 136 77 113 73 234Q130 248 187 234L183 113 200 136 237 113 195 57 166 46Q130 69 94 46Z"
            : "M94 47 65 60 30 207 66 217 82 128 75 238Q130 249 185 238L178 128 194 217 230 207 195 60 166 47Z"
        }
        fill={`url(#${id})`}
        stroke="#d5b6ff"
        strokeWidth="1.8"
      />
      {product.kind === "hoodie" ? (
        <>
          <path
            d="M94 49Q87 5 130 13Q173 5 166 49L150 74 110 74Z"
            fill={product.color}
            stroke="#57406f"
          />
          <path d="M112 49q18-18 36 0l-18 22Z" fill="#57406f" />
          <path
            d="m115 67-3 48m32-48 4 48M106 174l-13 37h74l-13-37Z"
            fill="none"
            stroke="#ead7ff"
          />
        </>
      ) : product.kind === "shirt" ? (
        <>
          <path
            d="m94 47 16 32 20-16 20 16 16-32-36 10Z"
            fill="#9c8dd4"
            stroke="#d3baff"
          />
          <path
            d="M130 64v179M149 102h24v29h-24Z"
            fill="none"
            stroke="#d3baff"
          />
          {[93, 121, 149, 177, 205].map((y) => (
            <circle key={y} cx="134" cy={y} r="2" fill="#e2ccff" />
          ))}
        </>
      ) : (
        <path
          d="M94 46q36 43 72 0m-67 5q31 33 62 0"
          fill="none"
          stroke="#e2c6ff"
          strokeWidth="3"
        />
      )}
      <path
        d="m84 120 6 104m80-87-7 89M80 230q50 12 100 0"
        stroke="#fff"
        opacity=".2"
        fill="none"
      />
    </svg>
  );
}

export function StorefrontShowcase({ onOrder }) {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState("M");
  const [cart, setCart] = useState([]);
  const [screen, setScreen] = useState("shop");
  const [message, setMessage] = useState("");
  const heading = useRef(null);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  function openProduct(product) {
    setSelected(product);
    setSize("M");
    setMessage("");
  }
  function add() {
    const key = `${selected.id}-${size}`;
    setCart((current) =>
      current.some((item) => item.key === key)
        ? current.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...current, { ...selected, key, size, quantity: 1 }],
    );
    setMessage(`${selected.name} · ${size} added to your bag.`);
  }
  function shop() {
    setScreen("shop");
    setSelected(null);
  }
  function placeOrder() {
    if (!cart.length) return;
    onOrder({ items: cart, total, status: "New" });
    setCart([]);
    setScreen("complete");
    setMessage("Demo order sent to the control room below.");
  }
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [screen, selected]);
  return (
    <div className="ec-premium-store">
      <div className="ec-edge-notes">
        <span className="ec-note">browse products ↴</span>
        <span className="ec-note">choose your size → add to cart</span>
      </div>
      <BrowserFrame
        title="THE LITTLE STORE / FICTIONAL CLOTHING STORE"
        className="ec-fashion"
      >
        <div className="ec-fashion-nav">
          <button onClick={shop} aria-label="Form and Field, back to catalog">
            the little store<span>AN ILLUSTRATED SHOP.</span>
          </button>
          <span className="ec-fashion-season">
            PRODUCTS → OPTIONS → YOUR BAG
          </span>
          <button onClick={() => setScreen("cart")}>Bag ({count}) ↗</button>
        </div>
        {screen === "shop" && !selected && (
          <>
            <div className="ec-fashion-hero">
              <div>
                <span>A PLACE FOR EVERY PRODUCT</span>
                <h3>
                  Find your thing.
                  <br />
                  <em>Make it yours.</em>
                </h3>
                <p>Browse the catalog. Choose a size. Build your bag.</p>
              </div>
              <div className="ec-fashion-hero-art">
                <Garment product={products[1]} />
                <span>01 / A NEW KIND OF EVERYDAY</span>
              </div>
            </div>
            <div className="ec-fashion-filter">
              <h4>The daily rotation</h4>
              <div aria-label="Product categories">
                {["All", "Essentials", "Layers"].map((item) => (
                  <button
                    key={item}
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="ec-fashion-products">
              {products
                .filter((p) => category === "All" || category === p.category)
                .map((p, i) => (
                  <article key={p.id}>
                    <button
                      className={`ec-fashion-image ec-tone-${i}`}
                      onClick={() => openProduct(p)}
                      aria-label={`View ${p.name}`}
                    >
                      <span>
                        0{i + 1} / {p.category}
                      </span>
                      <Garment product={p} />
                      <span className="ec-product-open">Explore ↗</span>
                    </button>
                    <div>
                      <h4>{p.name}</h4>
                      <span>{money(p.price)}</span>
                    </div>
                    <p>
                      S – XL ·{" "}
                      {p.kind === "tee"
                        ? "Soft lilac"
                        : p.kind === "shirt"
                          ? "Dusky indigo"
                          : "Washed lavender"}
                    </p>
                    <button
                      className="ec-fashion-link"
                      onClick={() => openProduct(p)}
                    >
                      Choose size +
                    </button>
                  </article>
                ))}
            </div>
          </>
        )}
        {screen === "shop" && selected && (
          <div className="ec-fashion-detail">
            <div className="ec-fashion-image">
              <Garment product={selected} />
            </div>
            <div>
              <button
                className="ec-fashion-link"
                onClick={() => setSelected(null)}
              >
                ← All products
              </button>
              <p>A PLACE FOR EVERY PRODUCT</p>
              <h3 ref={heading} tabIndex={-1}>
                {selected.name}
              </h3>
              <strong>{money(selected.price)}</strong>
              <p>{selected.detail}</p>
              <fieldset>
                <legend>Choose your size</legend>
                <div className="ec-sizes">
                  {["S", "M", "L", "XL"].map((s) => (
                    <button
                      key={s}
                      aria-pressed={size === s}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
              <p className="ec-availability">
                ● In stock · illustrative availability
              </p>
              <button className="ec-fashion-primary" onClick={add}>
                Add to cart — {money(selected.price)}
              </button>
              <button
                className="ec-fashion-link"
                onClick={() => setScreen("cart")}
              >
                View bag ({count}) →
              </button>
            </div>
          </div>
        )}
        {screen === "cart" && (
          <div className="ec-fashion-checkout">
            <h3 ref={heading} tabIndex={-1}>
              Your considered picks.
            </h3>
            {cart.length ? (
              <>
                {cart.map((item) => (
                  <div className="ec-fashion-cart-row" key={item.key}>
                    <Garment product={item} />
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <span>{money(item.price * item.quantity)}</span>
                    <button
                      aria-label={`Remove ${item.name} size ${item.size}`}
                      onClick={() =>
                        setCart((current) =>
                          current.filter((p) => p.key !== item.key),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <p>
                  Total <strong>{money(total)}</strong>
                </p>
                <button
                  className="ec-fashion-primary"
                  onClick={() => setScreen("checkout")}
                >
                  Continue to demo checkout →
                </button>
              </>
            ) : (
              <p>Your bag is empty. Find your everyday favorite.</p>
            )}
            <button className="ec-fashion-link" onClick={shop}>
              ← Keep exploring
            </button>
          </div>
        )}
        {screen === "checkout" && (
          <div className="ec-fashion-checkout">
            <span>ILLUSTRATIVE CHECKOUT</span>
            <h3 ref={heading} tabIndex={-1}>
              Ready for its next chapter.
            </h3>
            <p>
              Sample customer · {count} item{count === 1 ? "" : "s"} ·{" "}
              {money(total)}
            </p>
            <p>
              No personal details or payment needed. This creates a local sample
              order.
            </p>
            <button className="ec-fashion-primary" onClick={placeOrder}>
              Place demo order →
            </button>
            <button
              className="ec-fashion-link"
              onClick={() => setScreen("cart")}
            >
              ← Edit bag
            </button>
          </div>
        )}
        {screen === "complete" && (
          <div className="ec-fashion-checkout">
            <span className="ec-fashion-check">✓</span>
            <h3 ref={heading} tabIndex={-1}>
              One order. Both sides connected.
            </h3>
            <p>Your order is now in the conceptual admin dashboard.</p>
            <a className="ec-fashion-primary" href="#admin-demo">
              Follow the order ↓
            </a>
            <button className="ec-fashion-link" onClick={shop}>
              Back to shop
            </button>
          </div>
        )}
        <p className="ec-fashion-status" role="status">
          {message ||
            "Interactive concept · choose a product, select a size, and try a demo order."}
        </p>
      </BrowserFrame>
      <div className="ec-connected-flow">
        <span>Discover a product</span>
        <b>↝</b>
        <span>Add to cart</span>
        <b>↝</b>
        <span>Place demo order</span>
        <b>↝</b>
        <a href="#admin-demo">See it in the control room ↓</a>
      </div>
    </div>
  );
}

function useCounterProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame;
    let started = false;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => {
      if (media.matches) {
        cancelAnimationFrame(frame);
        setProgress(1);
      }
    };
    finish();
    media.addEventListener("change", finish);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || started) return;
        started = true;
        observer.disconnect();
        if (media.matches) {
          setProgress(1);
          return;
        }
        const start = performance.now();
        function tick(now) {
          const t = Math.min((now - start) / 1100, 1);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.15 },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      media.removeEventListener("change", finish);
    };
  }, [ref]);
  return progress;
}

function SalesChart() {
  const [range, setRange] = useState("7 days");
  const [point, setPoint] = useState(null);
  const gradient = useId();
  const values =
    range === "7 days"
      ? [8, 13, 10, 22, 18, 29, 24]
      : [24, 38, 29, 54, 45, 67, 58];
  const labels =
    range === "7 days"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Sep 1", "Sep 6", "Sep 11", "Sep 16", "Sep 21", "Sep 26", "Sep 30"];
  const max = range === "7 days" ? 40 : 80;
  const coords = values.map((v, i) => [50 + i * 77, 180 - (v / max) * 150]);
  const path = coords.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <section className="ec-analytics" aria-label="Illustrative sales analytics">
      <div className="ec-dash-section-head">
        <div>
          <h4>Sales overview</h4>
          <p>
            {range === "7 days" ? "Sep 24–30, 2026" : "Sep 1–30, 2026"} · sample
            values
          </p>
        </div>
        <select
          aria-label="Sales date range"
          value={range}
          onChange={(e) => {
            setRange(e.target.value);
            setPoint(null);
          }}
        >
          <option>7 days</option>
          <option>30 days</option>
        </select>
      </div>
      <div className="ec-chart-readout" aria-live="polite">
        {point === null
          ? "Hover or focus a point to inspect sales"
          : `${labels[point]} · ${money(values[point] * 1000)}`}
      </div>
      <svg
        viewBox="0 0 550 218"
        role="group"
        aria-label="Sales in Indian rupees"
      >
        <defs>
          <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#a884f5" stopOpacity=".35" />
            <stop offset="1" stopColor="#a884f5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path
              d={`M45 ${30 + i * 75}H530`}
              stroke="#ffffff12"
              strokeDasharray="4 5"
            />
            <text x="0" y={34 + i * 75} fill="#a99cbe" fontSize="10">
              ₹{max - (i * max) / 2}k
            </text>
          </g>
        ))}
        <path d={`${path}L512 180H50Z`} fill={`url(#${gradient})`} />
        <path
          d={path}
          fill="none"
          stroke="#b792ff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {coords.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={point === i ? 6 : 4} fill="#d4bbff" />
            <circle
              cx={x}
              cy={y}
              r="17"
              fill="transparent"
              tabIndex="0"
              role="img"
              aria-label={`${labels[i]}: ${money(values[i] * 1000)}`}
              onMouseEnter={() => setPoint(i)}
              onMouseLeave={() => setPoint(null)}
              onFocus={() => setPoint(i)}
              onBlur={() => setPoint(null)}
            />
            <text
              x={x}
              y="210"
              textAnchor="middle"
              fill="#a99cbe"
              fontSize="10"
            >
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}

const sampleOrders = [
  { id: "FF-0248", customer: "Aarav Shah", total: 2490, status: "Shipped" },
  { id: "FF-0247", customer: "Mira Rao", total: 1780, status: "Processing" },
  { id: "FF-0246", customer: "Kabir Sen", total: 1890, status: "Delivered" },
];
export function AdminPanelShowcase({ orders, onProcess, onReset }) {
  const [tab, setTab] = useState("Overview");
  const ref = useRef(null);
  const progress = useCounterProgress(ref);
  const metrics = [
    ["Total Sales", 124500, true],
    ["Orders", 248],
    ["Products", 86],
    ["Customers", 192],
  ];
  function orderTable() {
    return (
      <section className="ec-dash-orders">
        <div className="ec-dash-section-head">
          <h4>Recent orders</h4>
          <span>{orders.length} from your demo</span>
        </div>
        <div
          className="ec-table-scroll"
          tabIndex="0"
          aria-label="Recent orders table"
        >
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...orders
                  .map((o, i) => ({
                    ...o,
                    id: `DEMO-${String(i + 1).padStart(3, "0")}`,
                    customer: "Sample customer",
                    index: i,
                  }))
                  .reverse(),
                ...sampleOrders,
              ].map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>{o.id}</strong>
                    {o.items && (
                      <small>
                        {o.items
                          .map((p) => `${p.name} / ${p.size} × ${p.quantity}`)
                          .join(", ")}
                      </small>
                    )}
                  </td>
                  <td>{o.customer}</td>
                  <td>{money(o.total)}</td>
                  <td>
                    {o.status === "New" ? (
                      <button
                        className="ec-status-badge ec-status-new"
                        onClick={() => onProcess(o.index)}
                        aria-label={`Mark ${o.id} as processed`}
                      >
                        New → Process
                      </button>
                    ) : (
                      <span
                        className={`ec-status-badge ec-status-${o.status.toLowerCase()}`}
                      >
                        {o.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  function productTable(inventory = false) {
    return (
      <section className="ec-dash-products">
        <div className="ec-dash-section-head">
          <h4>{inventory ? "Available stock" : "Product overview"}</h4>
          <span>Sample catalog</span>
        </div>
        {products.map((p) => (
          <div className="ec-dash-product" key={p.id}>
            <div>
              <Garment product={p} />
            </div>
            <span>
              <strong>{p.name}</strong>
              <small>
                {inventory ? "S / M / L / XL · sample stock" : p.category}
              </small>
            </span>
            <span>{money(p.price)}</span>
            <span className={p.stock < 10 ? "ec-low-stock" : ""}>
              {p.stock} available
            </span>
          </div>
        ))}
        {inventory && (
          <p className="ec-muted">
            Illustrative stock snapshot. Demo orders do not reserve or change
            inventory.
          </p>
        )}
      </section>
    );
  }
  return (
    <div className="ec-premium-admin" ref={ref}>
      <div className="ec-edge-notes">
        <span className="ec-note">sales overview ↴</span>
        <span className="ec-note">track incoming orders ↙</span>
      </div>
      <BrowserFrame title="THE LITTLE STORE / CONTROL ROOM · CONCEPTUAL UI">
        <div className="ec-dash-shell">
          <aside className="ec-dash-sidebar">
            <strong>
              ls<span>STORE DESK</span>
            </strong>
            <nav aria-label="Dashboard views">
              {[
                "Overview",
                "Products",
                "Orders",
                "Inventory",
                "Customers",
                "Settings",
              ].map((item, i) => (
                <button
                  key={item}
                  aria-pressed={tab === item}
                  onClick={() => setTab(item)}
                >
                  <span aria-hidden="true">
                    {["◈", "▧", "↙", "▤", "♧", "⚙"][i]}
                  </span>
                  {item}
                  {item === "Orders" && orders.length > 0 && (
                    <b>{orders.length}</b>
                  )}
                </button>
              ))}
            </nav>
            <small>
              One store.
              <br />
              Everything in view.
            </small>
          </aside>
          <div className="ec-dash-main">
            <header className="ec-dash-header">
              <div>
                <p>YOUR STORE, AT A GLANCE</p>
                <h3>{tab}</h3>
              </div>
              <span>Illustrative demo data</span>
            </header>
            <div className="ec-metrics" aria-label="Fictional sample metrics">
              {metrics.map(([label, value, currency]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong aria-label={currency ? money(value) : String(value)}>
                    {currency
                      ? money(value * progress)
                      : Math.round(value * progress).toLocaleString("en-IN")}
                  </strong>
                  <small>Sample {label.toLowerCase()}</small>
                </div>
              ))}
            </div>
            {tab === "Overview" && (
              <>
                <SalesChart />
                {orderTable()}
                {productTable()}
              </>
            )}
            {tab === "Orders" && orderTable()}
            {tab === "Products" && productTable()}
            {tab === "Inventory" && productTable(true)}
            {tab === "Customers" && (
              <section className="ec-dash-products">
                <h4>Customer directory</h4>
                {[
                  ...sampleOrders.map((o) => o.customer),
                  "Sample customer",
                ].map((name) => (
                  <div className="ec-data-row" key={name}>
                    <strong>{name}</strong>
                    <span>
                      {name === "Sample customer"
                        ? `${orders.length} local demo orders`
                        : "Fictional customer"}
                    </span>
                  </div>
                ))}
                <p className="ec-muted">
                  Sample records only. No personal information is collected.
                </p>
              </section>
            )}
            {tab === "Settings" && (
              <section className="ec-dash-products">
                <h4>Workspace settings</h4>
                <div className="ec-data-row">
                  <span>Store</span>
                  <strong>The Little Store (fictional)</strong>
                </div>
                <div className="ec-data-row">
                  <span>Currency</span>
                  <strong>INR · ₹</strong>
                </div>
                <div className="ec-data-row">
                  <span>Checkout</span>
                  <strong>Simulation only</strong>
                </div>
                <p className="ec-muted">
                  Read-only settings preview. No backend or payment service is
                  connected.
                </p>
              </section>
            )}
            <footer className="ec-admin-bottom">
              <span role="status">
                {orders.length
                  ? `${orders.length} local demo order${orders.length === 1 ? "" : "s"} received. Sample metrics stay fixed.`
                  : "Try checkout above to see your order arrive here."}
              </span>
              <button onClick={onReset} disabled={!orders.length}>
                Reset demo orders
              </button>
            </footer>
          </div>
        </div>
      </BrowserFrame>
      <div className="ec-edge-notes">
        <span className="ec-note">↳ organize products</span>
        <span className="ec-note">monitor available stock ↖</span>
      </div>
    </div>
  );
}

export function StorefrontOverview() {
  return (
    <div className="ec-overview-shop">
      <p className="ec-note ec-preview-note">
        the same products, a clearer path ↴
      </p>
      <BrowserFrame title="THE LITTLE STORE · CONCEPT">
        <div className="ec-mini-store-head">
          <strong>
            the little store<span>YOUR NEXT FAVORITE, ALL IN ONE PLACE.</span>
          </strong>
          <span className="ec-mini-bag">Bag / 01</span>
        </div>
        <div className="ec-mini-catalog">
          {products.map((product) => (
            <div key={product.id}>
              <div>
                <Garment product={product} />
              </div>
              <strong>{product.name}</strong>
              <span>{money(product.price)}</span>
            </div>
          ))}
        </div>
        <div className="ec-mini-options">
          <span>Choose a size</span>
          <div>
            <span>S</span>
            <span className="ec-mini-selected">M</span>
            <span>L</span>
            <span>XL</span>
          </div>
          <span className="ec-note">no need to ask ↗</span>
        </div>
        <div className="ec-mini-checkout">
          <span>
            Catalog <b>↝</b> Your bag <b>↝</b> Checkout
          </span>
          <span>Sample order ✓</span>
        </div>
      </BrowserFrame>
      <p className="ec-mini-disclosure">
        Illustrated preview · try the interactive version below
      </p>
    </div>
  );
}

export function AdminOverview() {
  const ref = useRef(null);
  const progress = useCounterProgress(ref);
  return (
    <div className="ec-overview-dashboard" ref={ref}>
      <p className="ec-note ec-preview-note">every order has a home ↴</p>
      <BrowserFrame title="THE CONTROL ROOM · CONCEPT">
        <div className="ec-mini-dashboard-head">
          <strong>Store overview</strong>
          <span>Illustrative demo data</span>
        </div>
        <div className="ec-mini-metrics">
          <div>
            <span>Total sales</span>
            <strong aria-label={money(124500)}>
              {money(124500 * progress)}
            </strong>
          </div>
          <div>
            <span>Orders</span>
            <strong aria-label="248">{Math.round(248 * progress)}</strong>
          </div>
          <div>
            <span>Products</span>
            <strong aria-label="86">{Math.round(86 * progress)}</strong>
          </div>
        </div>
        <div className="ec-mini-operations">
          <div>
            <span>Sales / sample week</span>
            <svg
              viewBox="0 0 230 92"
              role="img"
              aria-label="Illustrative sales trend for a sample week"
            >
              <path
                d="M5 20h220M5 50h220M5 80h220"
                stroke="#9e78cc22"
                strokeDasharray="3 5"
              />
              <path
                d="M5 75 40 55 75 65 110 31 145 45 180 15 225 26V85H5Z"
                fill="#8245ec22"
              />
              <path
                d="M5 75 40 55 75 65 110 31 145 45 180 15 225 26"
                fill="none"
                stroke="#b68ceb"
                strokeWidth="3"
              />
              <circle cx="180" cy="15" r="4" fill="#e2c7ff" />
            </svg>
          </div>
          <div className="ec-mini-stock">
            <span>Product overview</span>
            {products.slice(0, 2).map((p) => (
              <div key={p.id}>
                <Garment product={p} />
                <span>
                  {p.name}
                  <small>{p.stock} in stock</small>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="ec-mini-order">
          <span>Recent order / FF-0248</span>
          <strong>₹2,490</strong>
          <span>Processing</span>
        </div>
      </BrowserFrame>
      <p className="ec-note ec-preview-note ec-note-right">
        ↳ products, stock & customer context
      </p>
    </div>
  );
}
