import { useCallback, useEffect, useRef, useState } from "react";

const colorPalette = ["#38bdf8", "#f97316", "#a855f7", "#22c55e", "#f43f5e", "#facc15", "#ffffff"];

const CanvasBoard = ({ isDrawer }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [strokeColor, setStrokeColor] = useState(colorPalette[0]);
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [isDrawing, setIsDrawing] = useState(false);

  const configureContext = useCallback(
    (context) => {
      if (!context) {
        return;
      }
      context.strokeStyle = strokeColor;
      context.lineWidth = strokeWidth;
      context.lineCap = "round";
      context.lineJoin = "round";
    },
    [strokeColor, strokeWidth],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) {
      return;
    }

    const { width, height } = wrapper.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);

    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = "rgba(15, 23, 42, 0.92)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    contextRef.current = context;
    configureContext(context);
  }, [configureContext]);

  useEffect(() => {
    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  useEffect(() => {
    if (contextRef.current) {
      configureContext(contextRef.current);
    }
  }, [strokeColor, strokeWidth, configureContext]);

  const getCursorPosition = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches[0]) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    if (!isDrawer || !contextRef.current) {
      return;
    }
    event.preventDefault();
    const { x, y } = getCursorPosition(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const drawStroke = (event) => {
    if (!isDrawer || !isDrawing || !contextRef.current) {
      return;
    }
    event.preventDefault();
    const { x, y } = getCursorPosition(event);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) {
      return;
    }
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) {
      return;
    }
    contextRef.current.fillStyle = "rgba(15, 23, 42, 0.92)";
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
    configureContext(contextRef.current);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-[320px] w-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/50 sm:h-[360px] lg:h-[420px]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        onMouseDown={startDrawing}
        onMouseMove={drawStroke}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={drawStroke}
        onTouchEnd={stopDrawing}
      />

      {isDrawer ? (
        <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-3 rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-200">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
          <span className="text-sm font-semibold">You are drawing</span>
        </div>
      ) : (
        <div className="pointer-events-none absolute left-1/2 top-6 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-800/90 px-4 py-2 text-slate-300">
          <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-slate-500" />
          <span className="text-sm font-semibold">Sit tight, a new drawing is happening!</span>
        </div>
      )}

      <div className="relative z-10 mt-auto flex items-center justify-between gap-6 bg-slate-950/80 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          {colorPalette.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setStrokeColor(color)}
              className={`h-9 w-9 rounded-full border-2 ${
                strokeColor === color ? "border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Change stroke color to ${color}`}
              disabled={!isDrawer}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-300">
          <label htmlFor="stroke-width" className="hidden sm:block">
            Brush
          </label>
          <input
            id="stroke-width"
            type="range"
            min={2}
            max={18}
            value={strokeWidth}
            onChange={(event) => setStrokeWidth(Number(event.target.value))}
            disabled={!isDrawer}
            className="h-1 w-28 cursor-pointer accent-sky-400"
          />
          <button
            type="button"
            onClick={clearCanvas}
            disabled={!isDrawer}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvasBoard;
