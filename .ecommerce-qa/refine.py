from pathlib import Path
p=Path('src/pages/ECommerceCaseStudy.jsx');s=p.read_text(encoding='utf-8')
s=s.replace('  StorefrontShowcase,','  StorefrontShowcase,\n  StorefrontOverview,\n  AdminOverview,')
s=s.replace('  ProblemStories,','  ProblemStories,\n  ProblemOverview,\n  AdminCapabilities,')
s=s.replace('import "./ECommerceCaseStudy.css";', 'import "./ECommerceCaseStudy.css";\nimport "../components/ECommerce/Overview.css";')
s=s.replace('document.title = "From Idea to Online Store — Jay Gupta";', 'document.title = "From Scattered Chats to a Smarter Store — Jay Gupta";')
a=s.index('      const reached = elements');b=s.index('      setActive',a)
s=s[:a]+'''      const reached = [...mainRef.current.querySelectorAll(".ec-overview-step, .ec-detail-chapter[open]")]
        .filter(element => element.getBoundingClientRect().top <= window.innerHeight * 0.4);
'''+s[b:]
s=s.replace('setActive(reached.at(-1)?.id || "problem");','setActive(reached.at(-1)?.dataset.chapter || reached.at(-1)?.id || "problem");')
a=s.index('  useEffect(() => {\n    if (!location.hash)');b=s.index('  function handleAnchor',a)
s=s[:a]+'''  useEffect(() => {
    if (!location.hash) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    revealSection(id, false);
  }, [location.hash]);

'''+s[b:]
a=s.index('    const reduce = window.matchMedia',s.index('  function handleAnchor'));b=s.index('\n  }',a)
s=s[:a]+'''    revealSection(target.id, true);'''+s[b:]
s=s.replace('<a className="ec-skip" href="#storefront">','<a className="ec-skip" href="#storefront-demo">')
a=s.index('      <IllustratedSection\n        id="problem"');b=s.index('      <details className="ec-more">\n        <summary>From sketch',a)
s=s[:a]+'''      <div className="ec-quick-story" aria-label="The story in three steps">
        <OverviewStep id="problem" number="01" label="The problem"
          title={<>Selling Is Easy.<br /><span>Managing Isn't.</span></>}
          summary="Scattered chats, no organized catalog, size confusion, and manual order management."
          detail="problem-details" link="Understand the challenges">
          <ProblemOverview />
        </OverviewStep>
        <StoryArrow note="give every product a place" />
        <OverviewStep id="storefront" number="02" label="The storefront"
          title={<>Everything Customers<br /><span>Need to Shop.</span></>}
          summary="One organized catalog for products, sizes, variants, cart, and checkout."
          detail="storefront-demo" link="Try the shopping journey">
          <StorefrontOverview />
        </OverviewStep>
        <StoryArrow note="one order, both sides connected" />
        <OverviewStep id="admin" number="03" label="The control room"
          title={<>The Business,<br /><span>Organized in One Place.</span></>}
          summary="Products, orders, inventory, and customer information in one central interface."
          detail="admin-demo" link="Explore the control room">
          <AdminOverview />
        </OverviewStep>
      </div>
      <section className="ec-deeper ec-section" id="full-story" tabIndex={-1} aria-labelledby="full-story-title">
        <header className="ec-section-heading">
          <p className="ec-eyebrow">THE FULL STORY / GO AS DEEP AS YOU LIKE</p>
          <h2 id="full-story-title">Want to See How It<br /><span>All Comes Together?</span></h2>
          <p className="ec-intro">Explore the challenges, the thinking behind the solution, and how a connected e-commerce system can simplify everyday operations.</p>
        </header>
        <details className="ec-detail-chapter" id="problem-details" data-chapter="problem">
          <summary><span className="ec-detail-number">01</span><span><strong>Understanding the Problems</strong><small>Five everyday challenges, illustrated.</small></span><span className="ec-expand-mark" aria-hidden="true">+</span></summary>
          <div className="ec-chapter-body"><ProblemStories /><EcosystemTransition /></div>
        </details>
        <details className="ec-detail-chapter" id="storefront-details" data-chapter="storefront">
          <summary><span className="ec-detail-number">02</span><span><strong>How the Storefront Helps</strong><small>From finding a product to placing a sample order.</small></span><span className="ec-expand-mark" aria-hidden="true">+</span></summary>
          <div className="ec-chapter-body">
            <p className="ec-detail-intro">A catalog answers the first questions. Product details and available sizes help customers choose; a bag and checkout bring those choices into one order.</p>
            <div id="storefront-demo" className="ec-demo-anchor" tabIndex={-1}>
              <div className="ec-demo-disclosure"><span className="ec-status-dot" /> INTERACTIVE CONCEPT <span>Fictional products. No payments or personal details.</span></div>
              <StorefrontShowcase onOrder={order => setOrders(current => [...current, order])} />
            </div>
            <CustomerJourney />
          </div>
        </details>
        <details className="ec-detail-chapter" id="admin-details" data-chapter="admin">
          <summary><span className="ec-detail-number">03</span><span><strong>How the Admin Portal Helps</strong><small>See the same order from the business owner's side.</small></span><span className="ec-expand-mark" aria-hidden="true">+</span></summary>
          <div className="ec-chapter-body">
            <p className="ec-detail-intro">Keep product images, categories, pricing, order status, stock, and customer context in one workspace. Place a demo order above, then follow it here.</p>
            <div id="admin-demo" className="ec-demo-anchor" tabIndex={-1}>
              <AdminPanelShowcase orders={orders}
                onProcess={index => setOrders(current => current.map((order,i) => i === index ? {...order, status:"Processed"} : order))}
                onReset={() => setOrders([])} />
            </div>
            <AdminCapabilities />
          </div>
        </details>
      </section>
      <BeforeAfter />
'''+s[b:]
# Shared fragment navigation opens all enclosing native accordions before scrolling.
a=s.index('function HandDrawnArrow')
s=s[:a]+'''function revealSection(id, smooth) {
  const target = document.getElementById(id);
  if (!target) return;
  let parent = target;
  while (parent) {
    if (parent.tagName === "DETAILS") parent.open = true;
    parent = parent.parentElement;
  }
  requestAnimationFrame(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "instant", block: "start" });
    const focusTarget = target.tagName === "DETAILS" ? target.querySelector("summary") : target;
    focusTarget.focus({ preventScroll: true });
  });
}

function StoryArrow({note}) {
  return <div className="ec-story-arrow" aria-hidden="true"><span className="ec-note">{note}</span><svg viewBox="0 0 260 58" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 12C90-9 205 6 239 45m-19-5 20 7-2-18" /></svg></div>;
}

function OverviewStep({id, number, label, title, summary, detail, link, children}) {
  return <section id={id} className="ec-section ec-overview-step" tabIndex={-1} aria-labelledby={`${id}-title`}>
    <div className="ec-overview-copy"><p className="ec-eyebrow"><span>{number}</span> / {label}</p><h2 id={`${id}-title`}>{title}</h2><p>{summary}</p><a className="ec-overview-link" href={`#${detail}`}>{link} <span aria-hidden="true">↗</span></a></div>
    <div className="ec-overview-art">{children}</div>
  </section>;
}

'''+s[a:]
p.write_text(s,encoding='utf-8')
# All detailed problem context is visible once its chapter is expanded.
p=Path('src/components/ECommerce/Storytelling.jsx');s=p.read_text(encoding='utf-8');s=s.replace('<p>{problem.text}</p>\n            <details className="ec-problem-detail">\n              <summary>More context</summary>\n              <p>{problem.detail}</p>\n            </details>','<p>{problem.detail}</p>')
s=s.replace('target: "#storefront"','target: "#storefront-demo"').replace('target: "#admin"','target: "#admin-demo"')
s=s.replace('The inventory tab totals quantities ordered during this session.','The inventory view pairs each product with a clearly labeled sample stock count.')
s=s.replace('No real customer data, delivery records, sales analytics, or notifications.','All customer records and sales analytics are fictional demonstration data.')
s=s.replace('"Try it in the demo",','"Try it in the demo",')
p.write_text(s,encoding='utf-8')
# Match garment art and language to the palette; links open the detailed dashboard.
p=Path('src/components/ECommerce/CommerceDemo.jsx');s=p.read_text(encoding='utf-8-sig')
replacements={'#d9c5aa':'#ab8cdb','#929e8c':'#7672c0','#b3a5c8':'#c0a3ed','#403c42':'#34264e','#24212a':'#b58be9','#453f46':'#d5b6ff','#665d74':'#57406f','#786b88':'#ead7ff','#b2bdaa':'#9c8dd4','#66745d':'#d3baff','#4f594b':'#e2ccff','#a38b6f':'#e2c6ff','Warm sand':'Soft lilac','warm sand':'soft lilac','Muted sage':'Dusky indigo','muted sage':'dusky indigo','"sage"':'"indigo"','"sand"':'"lilac"','href="#admin"':'href="#admin-demo"','FORM & FIELD':'THE LITTLE STORE','Form & Field':'The Little Store','form & field':'the little store','EVERYDAY, CONSIDERED.':'AN ILLUSTRATED SHOP.','THE SLOW SEASON / 26':'PRODUCTS → OPTIONS → YOUR BAG','THE EVERYDAY COLLECTION':'A PLACE FOR EVERY PRODUCT','Less noise.':'Find your thing.','More you.':'Make it yours.','Quiet colors. Easy layers. Room to be yourself.':'Browse the catalog. Choose a size. Build your bag.'}
for a,b in replacements.items(): s=s.replace(a,b)
s=s.replace('strokeWidth="1.2"','strokeWidth="1.8"')
s=s.replace('                f&f','                ls').replace('>f&f<','>ls<')
p.write_text(s,encoding='utf-8')
# Replace the old storefront palette at its source (including old cascade fixes).
colors={'#f4f1ea':'#100d24','#292c28':'#e8ddf7','#d1c9bc':'#8264a5','#e9e5dc':'#17112d','#6f7069':'#c6b0e1','#d7d2c8':'#503866','#7044a5':'#d4b4ff','#55476b':'#e5d1ff','#6c7067':'#b9a2d2','#e1e4d9':'#1c1433','#303a2b':'#eee5fa','#69735f':'#b58be9','#5b6453':'#c3b2d9','#35422b22':'#8245ec22','#2c3529':'#8245ec','#e7e1d6':'#1c1630','#636058':'#c4afdd','#dce0d5':'#211935','#e6dfeb':'#281b3d','#70716a':'#b9a5d0','#f4f1eacc':'#100d24dd','#606558':'#c4b1dc','#b8baaf':'#806497','#303c2e':'#8245ec','#4f6844':'#c4a3ed','#465540':'#9c62ef','#eceae2':'#19122e','#555e4c':'#cab3e5','#63785a':'#c3a1f5','#63675f':'#c5acdf','#d7d0df':'#302241'}
for file in ['src/components/ECommerce/PremiumDemo.css','src/pages/ECommerceCaseStudy.css']:
 p=Path(file);s=p.read_text(encoding='utf-8-sig')
 for a,b in sorted(colors.items(),key=lambda x:-len(x[0])):s=s.replace(a,b)
 s=s.replace('Georgia,\n    serif','var(--ec-interface-font, inherit)').replace('Georgia,\n    serif;','inherit;')
 # font shorthand cannot inherit via var in family: use the existing site family explicitly.
 s=s.replace('var(--ec-interface-font, inherit)','"Poppins", sans-serif')
 p.write_text(s,encoding='utf-8')
