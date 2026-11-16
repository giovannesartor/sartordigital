# Sartor Digital — immersive portfolio

## Direction

A real spatial portfolio introduces the studio through its own products. The opening headline remains the primary message. Soft focus, a forest-green background and lime/emerald accents separate it from the surrounding project captures. The opening stays green in both themes; the redundant bottom wordmark has been removed.

Native scroll moves a Three.js camera through the work, with readable pauses for AgentCore, Trilha Livre and UseAvalIA. Pointer movement changes the viewpoint. The following portfolio preserves filtering, all 17 projects, full project details and outgoing links. Services, architecture, process, contact and support retain the existing content across Portuguese, English and Spanish.

## References and implementation

- Spatial inspiration: [Margem, Profitize](https://profitize.com.br/build/landing-pages/margem), free project package reviewed locally. No template photographs, fake projects or copy were imported.
- Other references reviewed: Lampo, Sopro and Sinal in the agency library.
- Original HTML/CSS/JavaScript implementation and the studio's existing project captures.
- Three.js 0.187.0, official npm distribution, locally bundled/minified with esbuild. MIT license: `assets/vendor/three-LICENSE.txt`.
- Frontend design guidance: Anthropic's free `frontend-design` skill.

## Motion and fallback

No scroll hijacking, smooth-scroll dependency or pinned-scroll framework. Desktop scene is five viewport heights; mobile is 4.4. A visible link skips directly to the complete portfolio.

The renderer caches 17 textures, uses 42 surrounding planes and three featured planes, caps pixel ratio at 1.5 and renders only while the view is changing. Rendering stops offscreen and in hidden tabs. Features synchronize pointer, keyboard and accessibility state with visibility.

Reduced-motion preference and the existing pause control switch to a compact static hero. WebGL failure also reveals a CSS/image fallback. All actual project content remains available outside the canvas. Light/dark palettes affect both DOM and scene fog/background.

## Main assets

- `experience.css` / `experience.js`: common design and homepage interactions.
- `experience-interior.css`: services and support layouts.
- `immersive.css` / `immersive.js`: spatial hero and pointer-following project previews.
- `explorer.js`: existing catalog behavior, with revised project transitions.

## Code-to-work opening refinement

The first viewport now uses original vector signal paths and code/AI motifs at the edges. `hero-signal.svg` and `hero-signal-mobile.svg` provide separately composed desktop and portrait artwork, avoiding random-looking screenshot rectangles behind the opening headline.

Native scroll crossfades this composition into the existing project tunnel from 0.8% to 9% of the hero journey. Camera path, project ordering, geometry, timings and project content are unchanged. The artwork responds subtly to the existing pointer camera and stays static when motion is paused or reduced. WebGL failure retains the vector opening and normal catalog navigation.

## Subtle signal motion

The desktop and mobile vector sources are embedded inline in each localized homepage, with unique gradient IDs. Lines, nodes and code occupy separate pointer-responsive layers; four low-opacity light traces travel slowly along existing paths. Pointer input and smoothing reuse the existing camera values, without changing the project renderer, camera path or scroll timing. CSS animation pauses after the opening, offscreen, in hidden tabs, with the motion control, and under reduced-motion preference. No extra animation-frame loop or dependency was added.

The light reading theme now uses a distinct sage opening (`#d2e3be`) with dark forest text (`#163923`), including the 3D scene background and the services/support headers. The dark theme retains its deep green opening. Vector signals are toned darker in light mode for visual continuity and contrast.
