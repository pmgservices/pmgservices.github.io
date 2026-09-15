# PMG chart system — authoring reference

All data visuals on this site are rebuilt as editorial charts in the register of
The Economist / FT graphics desks. Read `.preview/charts/forecasting.svg` first —
it is the reference implementation. Match it.

## Hard constraints

- Author a **standalone `.svg` file** only. Do NOT edit `index.html`, `style.css`,
  or any other project file. Your only output is the .svg file(s) named in your task.
- Start the file with `<svg viewBox="..." xmlns="http://www.w3.org/2000/svg" role="img" aria-label="...">`.
  The `aria-label` must describe the chart's *finding* in a full sentence, not its shape.
- Do NOT put a `class` on the root `<svg>` — it is assigned when injected.
- Use the CSS classes and `var(--ct-*)` tokens below. Do NOT hard-code hex values,
  do NOT write `font-family` or `font-size` attributes. If you need a fill, write
  `fill="var(--ct-s2)"` etc.
- No `<defs>`, no gradients, no `filter`, no drop shadows, no glows, no blur.
  These are the house style of the old visuals and are exactly what we are removing.

## Scale rule

Every chart is authored so **1 viewBox unit renders at ~1.4 CSS px**. That is why
the type sizes are shared across different viewBoxes. Use the viewBox you are given.

## Type classes (sizes are viewBox units, already set in CSS)

| class | size | use |
|---|---|---|
| `.ct-title`  | 12.5 | chart headline. Sentence case, short, no full stop. |
| `.ct-sub`    | 8.8  | subtitle — **this is where the unit goes** ("…, %", "$m", "hours per month") |
| `.ct-lbl`    | 8.4  | direct series labels, annotations |
| `.ct-axis`   | 8    | axis tick labels |
| `.ct-src`    | 7.2  | source line |
| `.ct-stat`   | 22   | the single big focal number |
| `.ct-kicker` | 7.2  | small red caps label |
| `.ct-note`   | 7.6  | small muted caps label (letter-spaced) |
| `.ct-focal`  | —    | add to any text to make it accent-red and bold |

## Furniture classes

`.ct-tab` (red rule), `.ct-gridline`, `.ct-rule-line` (hairline), `.ct-tick`,
`.ct-zero` (black baseline), `.ct-axisline`, `.ct-connector`, `.ct-series`,
`.ct-series-2`, `.ct-band` (no contour stroke).

## Colour tokens

- `--ct-ink` #0b1d2c — titles and the zero baseline. **The only black.**
- `--ct-sub` #44606e — subtitles, labels
- `--ct-mute` #8697a1 — axis labels, source
- `--ct-grid` / `--ct-rule` / `--ct-panel` — furniture neutrals
- `--ct-accent` #b61818 — **reserved.** The red tab, and ONE focal callout per
  chart (the headline number and its endpoint marker). Never plot a series in it.
- `--ct-s1 … --ct-s5` (#24475c → #a3bac6) — the steel ramp. Use for every data
  series, every bar, every uncertainty band. Ordered dark→light by importance.

Maximum **two hues plus grey** in any one chart.

## The rules (follow all of them)

1. Red tab top-left: `<rect class="ct-tab" x="14" y="11" width="19" height="2.6"/>`
2. Tab, title, subtitle and source all left-align to the same x (14).
3. Title baseline y=27; subtitle baseline y=38 (for a 160-tall viewBox).
4. **There is no y-axis title, ever.** No rotated text anywhere. The unit lives
   in the subtitle.
5. Y axis: no axis line, no ticks. Tick labels only, **on the right** of the plot.
6. X axis: ticks hang *below* the bottom gridline; the axis line stops at the last tick.
7. Black is used for the zero baseline and nothing else.
8. Horizontal gridlines only. No vertical gridlines, no plot frame, no box.
9. Four or five gridlines maximum. Round numbers only.
10. Paint order: background → panel shading → gridlines → bands → series → labels.
11. **No legend.** Label each series directly at the end of its line, in the
    series colour, using `.ct-lbl`.
12. Uncertainty bands get no stroke. Use `fill-opacity` (0.14 outer, 0.30 inner) —
    **not** `opacity`, which the reveal animation overrides.
13. No markers on every data point. One marker, on the focal point, in accent red.
14. Source line bottom-left, `.ct-src`: `Source: PMG Services client engagement`.
15. Bars and areas must start at zero. Never truncate that baseline.
16. At this size, restraint wins: fewer gridlines, fewer labels, one clear message.

## Reveal animation (keep the site's motion system)

Add these alongside the `ct-` classes:

- `class="ct-series svg-draw" style="--len:240;--d:.7s"` — draws the stroke on.
  `--len` must be **>= the path's real length**.
- `class="svg-fade" style="--d:.9s"` — fades/rises in. On a `<g>` it staggers a group.
- `class="svg-pop" style="--d:1.35s"` — scales in; use for the one focal marker.
- If an element that carries one of these classes needs a resting opacity below 1,
  set it with `--o` in the same style attribute (e.g. `style="--d:.9s;--o:.3"`),
  because the keyframes override the `opacity` attribute. Prefer `fill-opacity`.

Delays should run 0 → ~1.5s, left to right, furniture first and the focal callout last.
