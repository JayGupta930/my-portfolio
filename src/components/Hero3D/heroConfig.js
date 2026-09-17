// Add the finished character + chair GLB to public/models, then set this URL.
// The portrait is an honest fallback, not a reconstructed 360-degree model.
export const heroConfig = {
  modelUrl: null, // '/models/jay-seated.glb'
  posterUrl: '/images/jay-seated-portrait.png',
  // Generated rear-view interpretation of the supplied front photograph.
  rearPosterUrl: '/images/jay-seated-rear.png',
  // Adjust only if the supplied GLB faces away from the camera (radians).
  modelYaw: 0,
};
