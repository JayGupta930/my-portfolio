// Add the finished character + chair GLB to public/models, then set this URL.
// The portrait is an honest fallback, not a reconstructed 360-degree model.
export const heroConfig = {
  modelUrl: null, // '/models/jay-seated.glb'
  posterUrl: '/images/jay-seated-portrait.webp',
  posterSrcSet: '/images/jay-seated-portrait-480.webp 480w, /images/jay-seated-portrait-768.webp 768w, /images/jay-seated-portrait.webp 1024w',
  // Generated rear-view interpretation of the supplied front photograph.
  rearPosterUrl: '/images/jay-seated-rear.webp',
  rearPosterSrcSet: '/images/jay-seated-rear-480.webp 480w, /images/jay-seated-rear-768.webp 768w, /images/jay-seated-rear.webp 1024w',
  // Adjust only if the supplied GLB faces away from the camera (radians).
  modelYaw: 0,
};
