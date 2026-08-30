# BMIPROGRAM UX rules

These rules are release constraints, not optional visual preferences.

## Functional block hierarchy

- Every new functional or informational group must read as a separate visual block.
- Do not present long runs of metadata as one continuous paragraph stack.
- A new user task, result explanation, travel summary, recommendation reason, action area or form step must start with visible vertical separation.
- Adjacent groups must use spacing and/or a subtle divider/background/panel treatment so their boundaries are obvious without relying only on bold labels.
- On mobile, prioritize vertical rhythm over information density.

## Minimum spacing

- Result metadata rows: at least 10 px vertical breathing room between semantic groups.
- Major result sections: at least 24 px separation on desktop and 20 px on mobile.
- Travel panel, recommendation reason and primary actions must each be visually distinct sections.
- Paragraph line-height must remain comfortable; do not compress body text below 1.45 line-height.
- Long value text must wrap naturally and must never force horizontal overflow.

## Mobile result cards

- One-column result-card layout only below 760 px.
- All cards and nested panels use `min-width: 0` and `max-width: 100%`.
- Result metadata is grouped into semantic blocks with padding and separation.
- The `Miért ezt?` explanation must be a standalone block with its own top border/background or equivalent separation.
- Route/map actions must not visually merge into recommendation copy.

## Mobile scaling

- Keep the standard responsive viewport; never disable user pinch zoom with `maximum-scale=1` or `user-scalable=no`.
- Stabilize Safari text sizing with `-webkit-text-size-adjust: 100%` / `text-size-adjust: 100%`.
- Form inputs, selects and textareas must be at least 16 px on mobile so iOS does not auto-zoom the page on focus.
- Interactive controls use `touch-action: manipulation` where appropriate.

## Action buttons

- Buttons that belong to one result action area must use a shared grid and consistent height, padding, radius and typography.
- Use two columns when at least two action labels are short enough to remain readable; long labels span the full row.
- Never force a long action label into a narrow two-column cell.
- On very narrow screens, the action grid may collapse to one column.
- Route/map and primary program actions should align visually and must not use arbitrary per-button widths.

## Wizard anchors

- Every newly rendered form/function step must scroll to the beginning of the new block.
- Internal updates inside a result card (travel data, route map, async enrichment) must not reset the user's scroll position.

## Release protection

Any change that removes these spacing, grouping, mobile scaling, action-grid or anchor guarantees must fail validation before deployment.
