import { useId } from "react";

// Small reusable drawings keep each scene editable and independently animatable.
export function Sketch({
  label,
  children,
  viewBox = "0 0 320 230",
  className = "",
}) {
  const id = useId();
  return (
    <svg
      className={`ec-sketch ${className}`}
      viewBox={viewBox}
      role="img"
      aria-labelledby={id}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title id={id}>{label}</title>
      {children}
    </svg>
  );
}

export function Box({ x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path fill="var(--ec-paper)" d="m2 17 34-15 35 15-2 43-33 16L3 60Z" />
      <path d="m2 17 34 16 35-16M36 33v43M19 9l35 16v17l-12 5V30" />
      <path d="m12 49 14 6m-14 1 9 4" />
    </g>
  );
}

export function Person({ x = 0, y = 0, working = false }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        fill="var(--ec-paper)"
        d="M28 37c-9-2-13-13-9-23C25-7 59-3 64 17l-3 18-9 14-1 15-23-3 5-15Z"
      />
      <path
        fill="var(--ec-ink)"
        d="M19 24C4-3 48-16 62 5c12 7 9 23 0 31l-7-17c-14 7-19-7-27 1Z"
      />
      <path d="m47 29 3 7-5 1m-9 6q8 5 14-1" />
      <circle cx="38" cy="28" r="1" />
      <path
        fill="var(--ec-accent)"
        d="M29 58C8 65 9 109 4 132l68 2-3-63-18-13q-9 13-22 0Z"
      />
      <path
        d={
          working
            ? "M20 76 9 111l61 8 3-11-44-10 6-18M61 78l17 24 32 3v10l-40 4-18-25"
            : "M20 78 7 111-13 2m72-35 19 23 20-26"
        }
      />
      <path
        fill="var(--ec-paper)"
        d="m5 133 65 1-9 37 11 42-17 1-23-49-3 45-20 1-2-48Z"
      />
      <path d="m7 211-9 9h28v-10m29 3v7h31l-14-9" />
    </g>
  );
}

export function Shop({ x = 0, y = 0, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path fill="var(--ec-paper)" d="m10 36 162-2-2 116-158 2Z" />
      <path
        fill="var(--ec-accent)"
        d="m7 34 15-30 135 2 20 28-1 17q-12 14-25 0-12 13-26 0-11 13-25 0-13 13-25 0-12 13-26 0-12 14-25 0Q9 65 6 51Z"
      />
      <path d="m40 6-9 28m40-29-4 29m39-29 2 29m24-28 9 28M7 34h170" />
      <path d="m29 76 52-1 1 50H28Zm76-1h43v75h-44Z" />
      <path d="m36 111 11-22 14 13 12-8m54 14h1" />
      <path d="M3 153q90-5 178-2" />
    </g>
  );
}

export function ProductDrawing({ kind = "bag" }) {
  return (
    <Sketch
      label={
        kind === "bag"
          ? "Hand-drawn everyday canvas tote"
          : "Hand-drawn ceramic mug"
      }
      viewBox="0 0 160 140"
    >
      {kind === "bag" ? (
        <>
          <path fill="var(--ec-paper)" d="m36 47 88-2 6 77q-50 8-99-1Z" />
          <path d="M58 57V35c0-30 43-31 44 0v22M39 50l-2 64m83-61 4 62" />
          <path
            stroke="var(--ec-accent)"
            strokeWidth="3"
            d="m65 80 14-8 15 8-15 23Zm0 0 14 7 15-7m-15 7v16"
          />
        </>
      ) : (
        <>
          <path fill="var(--ec-paper)" d="m36 44 72 1-5 67q-30 17-61-1Z" />
          <path d="M108 56c46-11 40 56-2 41m4-29c22-4 20 19-3 17M36 44q33 13 72 1M52 28q-12-9 0-19m24 19q-12-9 0-19" />
          <path stroke="var(--ec-accent)" d="m58 72 28 1m-28 9 18 1" />
        </>
      )}
    </Sketch>
  );
}

export function HeroIllustration({ complete = false }) {
  return (
    <Sketch
      label={
        complete
          ? "A shop owner beside their completed online store"
          : "A business owner plans an online store: a storefront emerges from a laptop"
      }
      viewBox="0 0 600 460"
    >
      <ellipse
        cx="317"
        cy="412"
        rx="244"
        ry="15"
        strokeDasharray="3 8"
        opacity=".3"
      />
      <path d="M62 320q225-8 481 1M90 322l-12 87m420-88 15 89" />
      <Person x={108} y={185} working={!complete} />
      <path fill="var(--ec-paper)" d="m251 218 217-4-20 103-214 1Z" />
      <path d="m263 229 188-4-16 78-185 3M229 318h238l-15 12-235-2Z" />
      <Shop x={280} y={complete ? 93 : 63} scale={0.9} />
      <path
        stroke="var(--ec-accent)"
        strokeDasharray="4 7"
        d="m289 221-8-30m140 30 19-24"
      />
      <Box x={451} y={333} />
      <Box x={37} y={342} />
      <path d="m187 302 31-3 2 20-34 2Zm9-3v-8m-99-59-38-5 6-42 38 4Z" />
      <path
        stroke="var(--ec-accent)"
        d="m88 67 6-17 7 17 17 5-17 6-7 16-6-16-16-6Zm399 176 5-12 5 12 12 5-12 5-5 12-5-12-12-5Z"
      />
      <g className="ec-svg-note" fill="currentColor" stroke="none">
        <text x="27" y="142" transform="rotate(-8 27 142)">
          a little idea…
        </text>
        <text x="437" y="86" transform="rotate(7 437 86)">
          your brand
        </text>
        <text x="447" y="190">
          payments
        </text>
        <text x="18" y="304">
          products
        </text>
        <text x="355" y="387">
          ready for launch!
        </text>
      </g>
      <path d="M100 147q38 2 52 32m-11-4 11 4-1-13M476 96q-1 24-31 31m11-7-11 7 13 3M475 198q-7 28-27 38m3-12-3 12 13-2" />
    </Sketch>
  );
}

export function ProblemIllustration({ type }) {
  return (
    <Sketch
      label={
        [
          "WhatsApp and Instagram enquiries scattered around a phone and paper orders",
          "Loose product pictures and price notes on a workspace",
          "A business owner surrounded by boxes and conflicting stock notes",
          "A physical shop disconnected from a customer searching online",
        ][type]
      }
    >
      {type === 0 && (
        <>
          <path fill="var(--ec-paper)" d="m112 35 89 4-7 174-88-6Z" />
          <path d="m124 50 64 3-6 130-63-4Zm12-8 30 2m-21 153h12" />
          <path fill="var(--ec-accent)" d="M20 61h116v44H88l-15 14v-14H20Z" />
          <path
            fill="var(--ec-paper)"
            d="m171 121 124-4 2 46-24 1-13 15-1-15-86 3Z"
          />
          <g className="ec-svg-note" fill="currentColor" stroke="none">
            <text x="31" y="89">
              WhatsApp
            </text>
            <text x="184" y="148">
              Instagram
            </text>
            <text x="220" y="57">
              order?
            </text>
          </g>
          <path d="m34 149 46-5 7 60-48 5Zm10 15 24-3m-22 14 24-3m153-48 14-8m-7 21 18-1" />
        </>
      )}
      {type === 1 && (
        <>
          <path fill="var(--ec-paper)" d="m37 35 108 15-16 132-110-18Z" />
          <path d="m52 61 68 8-7 61-70-8Zm-7 47 23-20 13 18 18-10m-60 46 68 7" />
          <path fill="var(--ec-paper)" d="m178 52 100-15 17 126-99 19Z" />
          <path d="m198 74 57-7 7 59-58 7m12-63v-15q22-13 25 11" />
          <path fill="var(--ec-accent)" d="m105 151 107 14-8 46-107-14Z" />
          <g className="ec-svg-note" fill="currentColor" stroke="none">
            <text x="116" y="186">
              price = ?
            </text>
          </g>
          <path d="m143 26 8-12m5 18 14-4" />
        </>
      )}
      {type === 2 && (
        <>
          <Person x={138} y={6} />
          <Box x={25} y={133} />
          <Box x={69} y={72} />
          <Box x={223} y={135} />
          <path d="m231 28 63 5-6 52-64-5Z" />
          <g className="ec-svg-note" fill="currentColor" stroke="none">
            <text x="235" y="59">
              sold?
            </text>
            <text x="74" y="40">
              in stock?
            </text>
          </g>
          <path d="m124 43 10 16m65-48 9-10m-2 26 15-4" />
        </>
      )}
      {type === 3 && (
        <>
          <Shop x={8} y={51} scale={0.85} />
          <path fill="var(--ec-paper)" d="m210 42 89 3-6 156-87-3Z" />
          <path d="m219 60 66 2-1 29-67-2Z" />
          <circle cx="233" cy="73" r="6" />
          <path
            d="m238 79 7 6M244 177h11m-99-42q27-25 48-11"
            strokeDasharray="3 5"
          />
          <g className="ec-svg-note" fill="currentColor" stroke="none">
            <text x="217" y="131">
              where?
            </text>
          </g>
        </>
      )}
    </Sketch>
  );
}

export function ProcessIllustration({ type }) {
  return (
    <Sketch
      label={
        [
          "Discovery notes and a conversation",
          "A designer drawing a storefront wireframe",
          "A developer building a store in a code editor",
          "A rocket launching beside a completed store",
        ][type]
      }
    >
      {type === 0 && (
        <>
          <path fill="var(--ec-paper)" d="M29 38h159v77h-70l-27 25v-25H29Z" />
          <path
            fill="var(--ec-accent)"
            d="m166 101 117 2v72h-30l-1 22-28-24-58-1Z"
          />
          <path d="M50 61h106M50 78h77m-77 17h93m45 30h67m-67 18h49" />
          <path d="m65 159 70-7 4 60-71 4m11-42 39-3m-37 16 27-3" />
        </>
      )}
      {(type === 1 || type === 2) && (
        <>
          <Person x={21} y={7} working />
          <path fill="var(--ec-paper)" d="m121 59 167 2-3 127-165-3Z" />
          <path d="m122 80 163 2M113 189h182m-136 1-8 23m95-23 10 23" />
          {type === 1 ? (
            <>
              <path d="m139 96 126 1v27H138Zm1 40h34v34h-35Zm44 0h35v34h-35Zm44 0h34v34h-34Z" />
              <path
                stroke="var(--ec-accent)"
                strokeWidth="5"
                d="m105 175 41-47"
              />
            </>
          ) : (
            <>
              <path
                stroke="var(--ec-accent)"
                d="m158 111-16 12 16 13m83-25 16 12-16 13m-28-27-16 29"
              />
              <path d="m144 153 97 1m-97 13 59 1" />
            </>
          )}
        </>
      )}
      {type === 3 && (
        <>
          <Shop x={162} y={101} scale={0.7} />
          <g transform="rotate(25 104 100)">
            <path
              fill="var(--ec-paper)"
              d="M104 14q-48 44-22 119h44q26-74-22-119Z"
            />
            <path
              fill="var(--ec-accent)"
              d="m79 86-23 44 24-9m49-35 24 44-24-9"
            />
            <circle cx="104" cy="69" r="14" />
            <path d="m86 139 5 44 12-16 13 24 9-52m-51 43-8 23m71-41 9 18" />
          </g>
          <path d="m227 25 4 13 14 4-14 4-4 14-4-14-14-4 14-4Z" />
        </>
      )}
    </Sketch>
  );
}
