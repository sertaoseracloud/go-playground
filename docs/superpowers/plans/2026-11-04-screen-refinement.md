# Screen Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the go-playground screen by removing advanced-only UI elements and reorganizing secondary actions into a "⋯ Mais ações" menu, matching the python-playground reference.

**Architecture:** Remove five UI elements from `index.html` (workspace selector, Grafo tab, Estado tab, Limpar estado button, Apply/Destroy buttons), clean up their JS handlers in `item.js`, remove associated CSS rules, and add a "⋯ Mais ações" dropdown menu for Restaurar and Compartilhar following the python-playground pattern.

**Tech Stack:** Vanilla JS (ESM), CSS custom properties, no build step.

**Spec:** `docs/superpowers/specs/2026-11-04-trilha-300-exercicios-design.md` §4

## Global Constraints

- Python-playground (`../python-playground/`) is the canonical reference for UI structure.
- Terminal macOS-style chrome (traffic lights, title bar) must be preserved.
- All changes must pass existing tests (`npm test`).
- No new dependencies; vanilla JS only.
- Accessibility attributes (`aria-*`, `role`, keyboard navigation) must be maintained or improved.

## Review Focus

1. **Keyboard navigation after removal:** After removing workspace selector and extra tabs, Tab order must still flow logically through remaining interactive elements — verify with keyboard-only navigation.
2. **"Mais ações" menu accessibility:** The new dropdown must be keyboard-navigable (Enter/Space to open, Escape to close, arrow keys within) and announce state to screen readers via `aria-expanded`.
3. **Terminal focus preservation:** Removing `btn-apply` and `btn-destroy` must not break terminal focus behavior — `Executar` and terminal click must still focus correctly.
4. **CSS cleanup completeness:** Removed elements must leave no orphaned CSS rules that increase bundle size or cause specificity conflicts.
5. **Progress/state persistence:** Removing `btn-resetar-estado` must not affect localStorage-based progress tracking — only the visual reset button is removed.

---

### Task 1: Remove workspace selector from HTML and JS

**Files:**
- Modify: `index.html:124-132`
- Modify: `src/ui/item.js` (workspace-related logic)
- Modify: `src/estilo.css` (workspace selector styles)

**Interfaces:**
- Consumes: none
- Produces: cleaner toolbar without workspace dropdown

- [ ] **Step 1: Identify workspace selector markup in index.html**

Read `index.html` lines 120–140. Locate the `<select>` or button group with `id` containing "workspace" or options like "default/dev/homolog/prod". Note exact line range.

- [ ] **Step 2: Remove workspace selector HTML**

Delete the workspace selector element and its container from `index.html`. Preserve surrounding elements (toolbar, action buttons).

- [ ] **Step 3: Remove workspace JS logic from item.js**

Search `src/ui/item.js` for references to workspace selector IDs or workspace-related state. Remove event listeners, state variables, and any conditional logic gated on workspace selection.

- [ ] **Step 4: Remove workspace CSS rules**

Search `src/estilo.css` for selectors targeting the workspace element (class or ID). Remove those rule blocks entirely.

- [ ] **Step 5: Run tests and verify no regressions**

Run: `npm test`
Expected: All tests pass. No console errors about missing workspace elements.

- [ ] **Step 6: Commit**

```bash
git add index.html src/ui/item.js src/estilo.css
git commit -m "refactor: remove workspace selector from playground screen"
```

---

### Task 2: Remove Grafo and Estado output tabs

**Files:**
- Modify: `index.html` (abas de saída section)
- Modify: `src/ui/item.js:191-199` (mostrarSaida function)
- Modify: `src/estilo.css` (grafo/estado panel styles)

**Interfaces:**
- Consumes: none
- Produces: simplified output tabs (only Terminal and Outputs remain)

- [ ] **Step 1: Remove Grafo and Estado tab buttons from HTML**

In `index.html`, find the `[data-saida]` buttons with values `"grafo"` and `"estado"`. Remove both `<button>` elements. Keep the `"terminal"` and `"saidas"` (or equivalent) buttons.

- [ ] **Step 2: Remove Grafo and Estado panel divs from HTML**

Remove the `<div id="saida-grafo">` and `<div id="saida-estado">` elements and their contents from `index.html`.

- [ ] **Step 3: Clean up mostrarSaida in item.js**

In `src/ui/item.js`, update the `saidas` object (around line 191) to remove `grafo` and `estado` entries. The `mostrarSaida` function should only handle remaining panels.

- [ ] **Step 4: Remove grafo/estado CSS rules**

Search `src/estilo.css` for `.saida.grafo`, `.saida.estado`, `#saida-grafo`, `#saida-estado` and related selectors. Remove those rule blocks.

- [ ] **Step 5: Run tests and verify tab switching works**

Run: `npm test`
Expected: All tests pass. Remaining tabs (Terminal, Outputs) switch correctly.

- [ ] **Step 6: Commit**

```bash
git add index.html src/ui/item.js src/estilo.css
git commit -m "refactor: remove Grafo and Estado output tabs"
```

---

### Task 3: Remove Limpar estado, Apply, and Destroy buttons

**Files:**
- Modify: `index.html` (button elements)
- Modify: `src/ui/item.js:50-53,130-143` (el references and onclick handlers)
- Modify: `src/estilo.css` (button styles if unique)

**Interfaces:**
- Consumes: none
- Produces: cleaner action bar; terminal `go clean` command remains available

- [ ] **Step 1: Remove button HTML elements**

In `index.html`, remove:
- `<button id="btn-resetar-estado">` (Limpar estado)
- `<button id="btn-apply">` (Run/Apply)
- `<button id="btn-destroy">` (Clean/Destroy)

Note their exact locations and preserve surrounding markup.

- [ ] **Step 2: Remove el references and onclick handlers in item.js**

In `src/ui/item.js`:
- Remove `apply`, `destroy`, `resetarEstado` from the `el` object (lines ~50-53).
- Remove the `el.apply.onclick`, `el.destroy.onclick`, and `el.resetarEstado.onclick` blocks (lines ~130-143).

- [ ] **Step 3: Verify terminal go clean command still works**

The terminal's `help` output lists `go clean` as unavailable — confirm that `go run`, `go build`, `go test` still work via the terminal prompt. The removed buttons were shortcuts; the terminal path remains.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: All tests pass. No references to removed button IDs.

- [ ] **Step 5: Commit**

```bash
git add index.html src/ui/item.js src/estilo.css
git commit -m "refactor: remove Limpar estado, Apply, and Destroy buttons"
```

---

### Task 4: Add "⋯ Mais ações" dropdown menu

**Files:**
- Modify: `index.html` (action bar area, near btn-executar/btn-enviar)
- Modify: `src/ui/item.js` (menu toggle logic, move Restaurar/Compartilhar)
- Modify: `src/estilo.css` (dropdown menu styles)

**Interfaces:**
- Consumes: existing `btn-restaurar` and `btn-compartilhar` functionality
- Produces: `btn-mais-acoes` toggle button + `menu-mais-acoes` dropdown panel

- [ ] **Step 1: Write failing test for menu toggle behavior**

Create or extend a test file (e.g., `tests/ui/mais-acoes.test.js`) that verifies:
- Clicking `btn-mais-acoes` toggles `aria-expanded` between `"true"` and `"false"`.
- Clicking `btn-mais-acoes` toggles `hidden` on `menu-mais-acoes`.
- Pressing Escape while menu is open closes it and returns focus to `btn-mais-acoes`.

```js
test('btn-mais-acoes toggles menu visibility and aria-expanded', () => {
  // Setup: render action bar with menu
  // Act: click btn-mais-acoes
  // Assert: menu-mais-acoes is visible, aria-expanded="true"
  // Act: click btn-mais-acoes again
  // Assert: menu-mais-acoes is hidden, aria-expanded="false"
});

test('Escape closes menu and returns focus', () => {
  // Setup: open menu
  // Act: press Escape
  // Assert: menu closed, focus on btn-mais-acoes
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/mais-acoes.test.js`
Expected: FAIL — elements don't exist yet.

- [ ] **Step 3: Add "⋯ Mais ações" HTML to index.html**

After `btn-enviar` in the action bar, add:

```html
<div class="mais-acoes">
  <button type="button" id="btn-mais-acoes" class="btn btn-fantasma"
          aria-expanded="false" aria-controls="menu-mais-acoes">⋯ Mais ações</button>
  <div id="menu-mais-acoes" class="menu-mais-acoes" hidden>
    <button id="btn-restaurar" class="btn btn-fantasma">
      <span aria-hidden="true">↺</span> Restaurar <small>voltar ao código original</small></button>
    <button id="btn-compartilhar" class="btn btn-fantasma">
      <span aria-hidden="true">🔗</span> Compartilhar <small>copiar um link com o seu código</small></button>
  </div>
</div>
```

Move existing `btn-restaurar` and `btn-compartilhar` from their current location into this menu. Remove their old positions.

- [ ] **Step 4: Add menu toggle logic to item.js**

In `src/ui/item.js`, add to the `el` object:
```js
maisAcoes: $('btn-mais-acoes'),
menuMaisAcoes: $('menu-mais-acoes'),
```

Add toggle handler:
```js
el.maisAcoes.onclick = () => {
  const aberto = el.menuMaisAcoes.hidden;
  el.menuMaisAcoes.hidden = !aberto;
  el.maisAcoes.setAttribute('aria-expanded', String(aberto));
};
```

Add Escape key handler on `menu-mais-acoes`:
```js
el.menuMaisAcoes.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    el.menuMaisAcoes.hidden = true;
    el.maisAcoes.setAttribute('aria-expanded', 'false');
    el.maisAcoes.focus();
  }
});
```

Close menu when clicking outside (document click listener checking if target is outside `.mais-acoes`).

- [ ] **Step 5: Add dropdown CSS to estilo.css**

Reference python-playground's `.menu-mais-acoes` styles. Key properties:
- `position: absolute` relative to `.mais-acoes` container
- `background`, `border`, `border-radius`, `box-shadow` matching Dracula theme
- `z-index` above editor/terminal
- Button hover/focus states matching existing `.btn-fantasma`

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: All tests pass including new menu toggle tests.

- [ ] **Step 7: Manual verification in browser**

Open the playground. Verify:
- "⋯ Mais ações" button appears after "⬆ Enviar"
- Click opens dropdown with Restaurar and Compartilhar
- Restaurar restores initial code
- Compartilhar copies link
- Escape closes menu
- Keyboard Tab navigates into/out of menu

- [ ] **Step 8: Commit**

```bash
git add index.html src/ui/item.js src/estilo.css tests/ui/mais-acoes.test.js
git commit -m "feat: add ⋯ Mais ações dropdown for secondary actions"
```

---

### Task 5: Final CSS cleanup and visual regression check

**Files:**
- Modify: `src/estilo.css`
- Test: manual browser verification

**Interfaces:**
- Consumes: all previous tasks' changes
- Produces: clean stylesheet with no orphaned rules

- [ ] **Step 1: Audit estilo.css for orphaned rules**

Search `src/estilo.css` for selectors referencing removed IDs/classes:
- `#btn-resetar-estado`, `#btn-apply`, `#btn-destroy`
- `.saida.grafo`, `.saida.estado`, `#saida-grafo`, `#saida-estado`
- Workspace selector classes/IDs
- Any other selectors with zero matches in `index.html`

Remove all orphaned rule blocks.

- [ ] **Step 2: Verify terminal chrome is intact**

Confirm these CSS selectors still exist and are unmodified:
- `.terminal` (macOS window chrome)
- `.traffic-lights`, `.traffic-light`
- `.terminal-titulo`
- `.saida-terminal`, `.campo-terminal`, `.prompt-terminal`

- [ ] **Step 3: Run full test suite**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 4: Visual regression in browser**

Open playground in browser. Compare against python-playground:
- Action bar has: ‹ › | chip + title | ▶ Executar | ⬆ Enviar | ⋯ Mais ações | Layout buttons
- Output tabs: 🖥️ Terminal | 📤 Outputs (only two)
- Terminal has macOS chrome with traffic lights
- No workspace selector, no Grafo/Estado tabs, no standalone Run/Clean buttons

- [ ] **Step 5: Commit**

```bash
git add src/estilo.css
git commit -m "chore: remove orphaned CSS rules after screen refinement"
```