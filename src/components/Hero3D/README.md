# Portfolio character hero

The supplied PNG is currently the portrait fallback. It is **not a 3D mesh**:
perspective movement cannot reveal continuous 3D side geometry. No generated GLB is
included. The available image-to-3D catalogue listed Meshy but its required
`generate_3d` operation was unavailable in this session.

## Replace the portrait with a model

1. Reconstruct the supplied full-body reference as a textured GLB containing both
   Jay and the entire chair. Preserve the seated pose, glasses, watch and boots.
   Do not rig/re-pose or export a camera/background as part of the subject.
2. Review the face and hidden surfaces: a single front image cannot establish
   accurate side/back identity. Additional photographs or manual refinement may
   be needed. Aim for 30–60k triangles, 1–2K textures and preferably under 8 MB.
3. Save the approved file as `public/models/jay-seated.glb`.
4. Set `modelUrl: '/models/jay-seated.glb'` in `heroConfig.js`.
   Adjust `modelYaw` in radians if necessary. No animation code changes required.

`CharacterScene.jsx` loads GLB/GLTF through useGLTF, normalizes bounds, uses a
perspective camera fitted to the entire rotation envelope, and adds studio
lighting and shadows. The GSAP playhead drives a half turn from rear to front
while the homepage scrolls into the introduction, reverses with scroll, and
never autoplays. Only the portrait layer is pinned, without adding scroll space;
it releases once the introduction is fully in view. Rendering uses
on-demand frames, a capped pixel ratio, and pauses updates offscreen. The image
remains visible while loading and after loading/WebGL errors.

Mobile/tablet (<1024px), short windows, reduced-motion and data-saving connections
use the original portrait. Mobile and reduced-motion layouts do not pin. Mobile
scroll reveals the portrait immediately before the introduction; reduced motion
shows the front statically. The photo uses two backface-hidden surfaces: the
original front and a generated photorealistic rear view on the reverse. The rear
image infers unseen details from the supplied front reference; it is not a
verified rear photograph or a 3D reconstruction. Both assets retain their PNG
alpha. There is no silhouette filter or extra mirroring. Generation provenance
and the complete prompt are in `rear-view-prompt.md`.
During the portrait reveal, a static charcoal studio background is visible and
the video is paused and hidden. Once scroll and scrub smoothing finish, the
original `/video/hero-3.mp4` fades in and resumes from its paused position.
Reversing into the reveal pauses it again. It retains muted playback, looping,
framing and the original fade/blur (now measured after the reveal endpoint).
Mobile uses its own reveal endpoint; reduced motion uses the intro boundary
without rotating or pinning. A hidden tab pauses playback, and blocked playback
leaves the static background visible. Existing copy, CTA, quote
interaction, navigation and below-the-fold sections are retained. The intro's
old independent vertical parallax is removed so it cannot fight the handoff.

Run `npm run dev`, `npm run build`, and targeted lint:
`npx eslint src/components/mainhero.jsx src/components/Hero3D`.
