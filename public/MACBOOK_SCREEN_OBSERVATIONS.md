# MacBook 3D Screen Replacement - Observations & Context

## Date: 2026-05-26
## Goal: Replace macOS wallpaper on MacBook 3D model with pc-screen.mp4 video

---

## MacBook GLB Model Structure (from console debugging)

The model at `/assets/models/macbook.glb` contains 131 meshes named Object_10 through Object_131.
All materials are `MeshStandardMaterial` type. No semantic mesh names (no "screen", "display", etc.).

### Display-Related Meshes (identified by bounding box analysis):

| Mesh | BBox (x × y × z) | Color | Vertices | Has Texture Map? |
|------|-----------------|-------|----------|------------------|
| Object_26 | 31.91 × 21.18 × 0.135 | #000000 (black) | 9,920 | NO |
| Object_30 | 33.53 × 22.80 × 0.009 | #ffffff (white) | 1,920 | YES |
| Object_40 | 33.53 × 22.80 × 0.069 | #ffffff (white) | 2,408 | YES |
| Object_66 | 35.21 × 10.64 × 0.000 | #ffffff (white) | 8 | YES |
| Object_107 | 0.29 × 0.10 × 0.27 | #ffffff (white) | 180 | YES |
| Object_109 | 0.08 × 0.03 × 0.08 | #305895 (blue) | 181 | NO |
| Object_127 | 27.84 × 0.68 × 0.26 | #ffffff (white) | 10 | YES |

### Key Findings:
1. **Object_30 & Object_40 carry the wallpaper texture** (`material.map` is set on MeshStandardMaterial)
2. **Object_26 is the dark LCD panel** - no texture, just dark color
3. Materials are **shared** between meshes - replacing one mesh's material doesn't fix others
4. The wallpaper is a baked **texture map** on MeshStandardMaterial, not a separate overlay

---

## Video File
- Source: `public/assets/videos/pc-screen.mp4` (confirmed accessible at `/assets/videos/pc-screen.mp4`, HTTP 200)
- Original specified path: `assets/video/pc video 2.mp4` (NOT in public/ - wouldn't be served)
- Loading: Must be appended to DOM for autoplay, needs `playsinline`, `muted`, `loop`

---

## What Worked / Didn't Work

### Tests that proved code execution:
- **Red test**: Applying red MeshBasicMaterial to ALL meshes turns entire MacBook red ✓
- **Console logging**: All mesh names, sizes, textures correctly logged ✓
- **Keyboard video**: Earlier approach showed video on keyboard (size-filter caught wrong meshes)

### Attempts that failed:
1. Replacing materials by mesh name (Object_26, 30, 40) - wallpaper persisted due to material sharing
2. Hiding textured meshes (Object_30, 40 invisible) - other meshes still had wallpaper
3. Cloning materials - cloned materials weren't the ones rendered
4. Setting `material.map = null` - didn't propagate to shared instances

---

## Recommended Final Approach

**Strategy**: Don't identify screen meshes. Instead:
1. After model loads, traverse all meshes
2. For any mesh with `material.map` set (has a texture), replace `material` with a new `MeshBasicMaterial` using the video texture
3. This completely bypasses the shared material problem
4. For non-textured body meshes, apply tuning as before

### Critical Code Pattern:
```javascript
model.traverse((object) => {
  if (!meshCandidate.isMesh) return;
  const mat = meshCandidate.material as (THREE.Material & { map?: THREE.Texture });
  if (mat?.map) {
    // Replace entire material - don't try to modify in-place
    meshCandidate.material = new MeshBasicMaterial({
      map: videoTexture, // will be set when video loads
      side: DoubleSide,
      toneMapped: false
    });
  }
});
```

### Timing Solution:
- Create the screen material FIRST
- Set it on meshes during traverse
- When video loads via `loadeddata`, set `videoTexture` and update `screenMaterial.map`
- Since all meshes SHARE the same `screenMaterial` instance, one update fixes all

---

## Dev Server
- Astro dev server runs at `http://localhost:4322/` (port 4321 was in use)
- Video path: `/assets/videos/pc-screen.mp4`