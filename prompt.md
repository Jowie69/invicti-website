# Integrate <GalleryHeading /> from ThreeUI using its exact source

You are working in an existing application. Implement this component from the exact source linked or included below. Do not recreate it from the preview, screenshot, description, or filename. just replace the text output into INVICTI Unconquered Within

Component: `GalleryHeading`
Variant: **Glitch Fall** (`falling-diagonal`)
Runtime: Canvas 2D
Source revision: `SHA-256 8e42d2d5b497`

Reference brief:
Broadcast colour torn into flat blocks and slipped rows, with the headline breaking up into two channels over a descending counter-orbit.

## Current configured usage

```tsx
import { GalleryHeading } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <GalleryHeading
        variant="falling-diagonal"
        mode="dark"
        font="sans"
        weight="700"
        headlineSize={1.20}
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}
```

## Exact implementation source

Complete registered source bundle: [https://threeui.com/source-code/gallery-heading.json](https://threeui.com/source-code/gallery-heading.json)

Required registered files:

- `src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx` — component · SHA-256 `fe9856234253bc3c1a13b3afb84f3d84644dfa6d578e7203bb3e1dd5eced1b75`
- `src/shaders/neuform-isolated/sources/gallery-heading.html` — canonical-source · SHA-256 `8e42d2d5b4971bfc4d3c485112c3c51909e20a61b8842bc0dcd8db3ffe2d253a`
- `src/shaders/threeui.css` — shared-style · SHA-256 `efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf`

## Implementation requirements

- Preserve the authored structure, styling, shaders, motion, interactions, responsive behavior, dependencies, and asset paths described by the source.
- Use the configured `<GalleryHeading />` usage above, including the selected variant and props.
- Build directly in the destination project. Do not embed the ThreeUI documentation page and do not approximate the result from its rendered appearance.
- Fetch and read the complete source before editing. If the source cannot be retrieved, stop and report that instead of recreating it.
- After implementation, verify the rendered result and its interactions in the browser.

