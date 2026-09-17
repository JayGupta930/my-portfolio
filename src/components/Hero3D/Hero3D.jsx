import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react';

const CharacterScene = lazy(() => import('./CharacterScene'));

class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Hero3D({ progress, modelUrl, posterUrl, rearPosterUrl = posterUrl, modelYaw = 0, onReady }) {
  const [canRender, setCanRender] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Small screens, reduced motion and data-saving connections use the portrait.
    const media = window.matchMedia('(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)');
    const update = () => {
      setCanRender(Boolean(modelUrl) && media.matches && !navigator.connection?.saveData);
      setLoaded(false);
      setFailed(false);
      onReady(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [modelUrl, onReady]);

  const handleReady = useCallback(() => {
    setLoaded(true);
    onReady(true);
  }, [onReady]);

  const handleFailure = useCallback(() => {
    setLoaded(false);
    setFailed(true);
    onReady(false);
  }, [onReady]);

  return (
    <div className="hero3d-visual" role="img" aria-label="Jay Gupta in a black suit and sunglasses, seated in a black leather chair">
      <div className={`hero3d-portrait${loaded ? ' hero3d-portrait--hidden' : ''}`}>
        <img className="hero3d-face hero3d-face--front" src={posterUrl} alt="" width="1024" height="1536" fetchPriority="high" decoding="async" />
        <img className="hero3d-face hero3d-face--back" src={rearPosterUrl} alt="" width="1024" height="1536" fetchPriority="high" decoding="async" aria-hidden="true" />
      </div>
      {canRender && !failed && (
        <SceneBoundary key={modelUrl} onFailure={handleFailure}>
          <Suspense fallback={null}>
            <CharacterScene modelUrl={modelUrl} modelYaw={modelYaw} progress={progress} onReady={handleReady} onFailure={handleFailure} />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}
