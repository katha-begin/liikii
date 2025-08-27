# Desktop UI PRD — Linear‑Style Template (Windows & Linux)

> **Goal**: Deliver a reusable desktop front‑end template that mirrors the style and UX pattern of the provided reference (Linear‑like, dark UI). This PRD covers **UI only** (with minimal shell behaviors) and focuses on a **Projects** main view that can be replicated across projects. Platforms: **Windows + Linux**. Shell: Electron‑class or equivalent. Integrates with **Python/DCC launchers** and **environment managers (Rez, Conda)** at the UI level.

---

## 0. Summary & Principles

* **Task-centric, project container model**: Top-level **Projects**; items are **Tasks**. Expose **Episode / Sequence / Shot** in UI chrome for MVP (labels visible; can be read-only stubs).
* **Style**: Minimal, quiet, monochrome base with **soft pastel accents (Monet-inspired)**. “White chromatic chrome” highlights for borders.
* **Themes**: **Dark + Light** toggle (default: Dark). Light is off-white (toned)
* **Desktop niceties**: Native notifications, tray icon, native menu bar, in-app auto-update with **build channel & build picker**.
* **Template-first**: Screens are composed from a JSON layout + widget registry (modular, per-project color palette overrides).
* **No telemetry** in MVP. **Keyboard shortcuts not required** for MVP. **Right‑click context menus** included.

Success snapshot (MVP):

* The app launches to **Projects** view with linear-like chrome (header, sidebar, content tabs, filter row, empty states).
* From the sidebar, user can **Import CSV** and **Invite People** (link), and open project(s).
* From header, user can **Add project**, open **Display** options, access **Search** (non‑command‑palette MVP), and open the **Build Picker/Updater**.
* From menu or launcher button, user can pick a **DCC**, choose **Rez/Conda env**, and run a **Python script**.

---

## 1. Non‑Functional (Desktop Shell)

* **Platforms**: Windows 10/11; Ubuntu 22.04+ (X11/Wayland).
* **Scaling**: 100%–300% DPI. Must look crisp on **4K/HiDPI**.
* **Window**: Frameless optional; min width 1120px; responsive up to 4K. Persist window size/state.
* **Menu bar**: File, Edit, View, Tools, Help. (See §7.3)
* **Tray**: Quick actions (Open, Build channel, Quit).
* **Notifications**: Native system notifications (assignments, imports). Toggle in Settings.
* **Auto‑update**: Channels **Stable / Beta / Nightly** + **Specific build picker** (dropdown with build list). User consent before switch.

---

## 2. Visual Language (Design Tokens)

**Typeface**: Inter (fallback: system UI sans).
**Density**: Compact, generous whitespace around content; strict 4px grid.

### 2.1 Spacing & Radius

* Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40px
* Radius: Card 12px; Input 8px; Toolbar/Chip 999px
* Shadows (subtle): Elev0 none; Elev1 `0 1px 2px rgba(0,0,0,.08)`; Elev2 `0 8px 20px rgba(0,0,0,.10)`

### 2.2 Color — Dark Theme (default)

* **bg/base**: `#0B0D12`
* **bg/surface-1**: `#0F141A`
* **bg/surface-2**: `#141A21`
* **border/line**: `#1E2630`
* **text/primary**: `#E6EAF2`
* **text/secondary**: `#A8B0BE`
* **icon/quieter**: `#7A8392`
* **accent/pastels (Monet)**:

  * lilac: `#CBB7E8`
  * blue: `#B7D3F2`
  * pink: `#F4C6D7`
  * mint: `#CDE8D6`
  * butter: `#F9E7A1`
* **semantic**: success `#8BD3A9`, warning `#F7C97F`, danger `#F2A6A6`, info `#9CC7F5`
* **white‑chrome edge (border highlight)**: gradient token (see 2.4)

### 2.3 Color — Light Theme (toggle)

* **bg/base**: `#F7F8FA` (off‑white, not pure)
* **bg/surface-1**: `#FFFFFF`
* **bg/surface-2**: `#F2F4F7`
* **border/line**: `#E6EAF2`
* **text/primary**: `#0F141A`
* **text/secondary**: `#475569`
* **accent/pastels**: reuse Monet set above at \~90% saturation

### 2.4 White Chromatic Chrome (iridescent border)

Use CSS gradient masked as a 1–2px border:

```
--chrome-gradient: conic-gradient(from 180deg,
  rgba(255,255,255,.9), rgba(240,248,255,.7), rgba(255,240,245,.7), rgba(255,255,255,.9));
```

Applied via border-image or pseudo-element with mask; opacity tuned per theme.

### 2.5 Typography

* H1: 20/28 • Semibold
* H2: 16/24 • Semibold
* Body: 14/20 • Medium
* Caption: 12/16 • Medium
* Mono (IDs): 12/16 • Regular

---

## 3. Global Layout Anatomy (copy style of screenshot)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  A) HEADER (sticky)                                                       │
├──────────────┬───────────────────────────────────────────────┬─────────────┤
│  B) SIDEBAR  │  C) CONTENT AREA                               │  (optional │
│  (collaps.)  │   • Tab bar: Projects | All projects | New view │  right rail)│
│              │   • Filter row                                  │             │
│              │   • Empty state / list / grid                   │             │
└──────────────┴────────────────────────────────────────────────┴─────────────┘
```

### 3.1 Header (mirror reference 1:1)

* **Left**: Workspace switcher/breadcrumb (caret), back/forward chevrons.
* **Center**: App title (`Workspace » Projects`) and **Search field**.
* **Right**: Link/share icon, **+ Add project** (primary), Display (view options ▾), theme toggle, notifications, user avatar.
* **Height**: 56–64px. Sticky with Elev1 shadow when content scrolls.
* **States**: Compact on scroll (–8px height). All icons monochrome; active icon uses pastel accent.

### 3.2 Sidebar (collapsible + hover expand)

* **Width**: 72px (collapsed) → 240px (expanded). Animation ≤200ms.
* **Sections** (MVP; keep labels):

  * Workspace group (avatar + name)
  * **Inbox**, **My issues** (rename to **My tasks** at label level), **Projects**, **Views**, **More**
  * **Your teams**: Team switcher; under team: **Issues/Tasks**, **Projects**, **Views**
  * **Try**: **Import issues (CSV)**, **Invite people**
  * Bottom: **Help (?)**
* **Active state**: Accent pill and left rail highlight; in collapsed state show tooltip labels.
* **Right‑click on items**: New tab (window), Pin to top, Rename (if allowed).

### 3.3 Content Tabs (within Projects)

* Left‑aligned tab row: **Projects • All projects • New view**
* Tab interaction: Click = switch; Right‑click = “Open in new window”, “Duplicate view”, “Rename”.

### 3.4 Filter Row (beneath tabs)

* **Filter** button (icon) opening popover; chips for active filters.
* Right side: **Display** mirror control (density, grouping, sort). Persist per view.

### 3.5 Empty State (Projects)

* Centered illustration (mono line cube stack), Title **Projects**, body copy, two CTAs:

  * **Primary**: *Create new project* (button shows shortcut hint `P then C` visually only; no shortcut required to function)
  * **Secondary**: *Documentation* (external link)
* Empty state appears when no projects match filters and when the org has zero projects.

---

## 4. Page Templates

### 4.1 Projects (Main)

* Default landing after first run or role default.
* When content exists: show **projects list** (dense rows) with columns: Name, Owner, Status, Updated, Actions (⋯). Sort by Updated desc.
* When empty: use **Empty State** (§3.5).

### 4.2 All Projects (Aggregated)

* Same table with extra columns (Team, #Tasks, Health). Export CSV in ⋯ menu.

### 4.3 New View (Saved View Template)

* Dialog: Name, Scope (workspace/team), Base (Projects/Tasks), Visible fields, Default filters. Saves to **Views** in sidebar.

---

## 5. Components (Inventory & Specs)

**Buttons**: Primary (pastel accent fill), Secondary (outline), Tertiary (ghost).
**Inputs**: Subtle 1px border (`line` token), 8px radius, focus ring accent.
**Tabs**: Underline indicator, hover pastel tint.
**Table/List**: 48px row height; zebra optional; hover row highlight; ellipsis overflow; right‑click menu.
**Chips**: Rounded, 999px; quiet by default; active uses accent fill.
**Iconography**: Mono line; 16–20px grid; secondary tone.
**Toasts**: Bottom-right; 3s auto‑dismiss.
**Tooltips**: Delay 500ms; contain optional hint text.
**Dialogs**: 560–640px width; scrim 40%.
**Theme Toggle**: Sun/Moon icon in header.
**CSV Import Wizard**: 3 steps (Upload → Map columns → Validate/Import). See §8.

---

## 6. Interactions & Context Menus (MVP)

* **No global keyboard palette** in MVP.
* **Right‑click** on: Sidebar items, Tab items, Table rows. Menu items:

  * Sidebar: Open in new window, Pin, Rename, Remove
  * Tab: Duplicate, Rename, Open in new window
  * Row: Open, Open in new window, Copy link, Export as CSV row, Delete (if allowed)
* **Theme toggle**: persists per user.
* **Hover expand** sidebar: expand after 200ms hover; collapse on mouseout unless pinned.

---

## 7. Desktop Shell Menus & Build Picker

### 7.1 Native Menu Bar

* **File**: New Project…, Import CSV…, Exit
* **Edit**: Undo, Redo, Cut, Copy, Paste, Select All
* **View**: Reload, Toggle DevTools, Zoom In/Out/Reset, Toggle Theme
* **Tools**: DCC Launcher…, Environment Manager…, Build Picker…
* **Help**: Documentation, About

### 7.2 Tray Menu

* Open Lumen (app), Build channel (radio), Quit

### 7.3 Auto‑Update & Build Picker UI

* Access from header (update badge) or Tools → Build Picker…
* Modal: Channel selector (Stable/Beta/Nightly), Available builds (list with version/date), Changelog pane, **Switch & Restart** button. Confirm dialog.

---

## 8. CSV Import (MVP)

Entry points: Sidebar **Import issues** (renamed “Import tasks”), File → Import CSV…

* **Step 1: Upload** — Drag & drop CSV, file size hint, encoding auto‑detect.
* **Step 2: Map** — Map CSV columns → fields: Title, Description, Assignee, Due, Status, Project, Episode, Sequence, Shot, Tags. Save mapping preset.
* **Step 3: Validate & Import** — Show row errors inline; skip/continue. Summary toast and link to imported view.

---

## 9. DCC & Python Integration (UI Layer)

**Goal**: Let users launch DCCs and scripts with correct environments from the desktop client.

### 9.1 Launcher Entry

* Header **rocket icon** or Tools → **DCC Launcher…** opens panel.
* Panel sections:

  1. **Application**: Dropdown (Maya, Houdini, Nuke, Blender, …)
  2. **Environment**: Tabs **Rez** / **Conda**.

     * Rez: package set selector (e.g., `studio/maya2024/arnold7`), resolve log preview.
     * Conda: env selector; Python path preview.
  3. **Script** (optional): File picker for Python to run on launch; arguments field.
  4. **Project Context**: Project/Episode/Sequence/Shot pickers (auto-filled from current selection).
* **Launch** button; a **dry‑run** shows env vars preview. Errors shown inline.
* **Recent launches** list (last 5); pin favorites.

### 9.2 Env Manager (Settings)

* Configure Rez package sources; conda env roots; default DCC mappings and tokens (e.g., `EP`, `SEQ`, `SHOT`).
* Test buttons to verify resolution on this machine.

---

## 10. Theming per Project (Simple Overrides)

Each project may select a **pastel accent** and optional **illustration** for empty states.

* UI control on Project settings: Accent swatches (lilac/blue/pink/mint/butter) + custom hex.
* Stores as `project.theme = { accent, emptyIllustration }` and applies to chips, primary buttons, and subtle card borders.

---

## 11. Accessibility & Scaling

* Contrast: text ≥ 4.5:1; pastel accents paired with neutral text.
* Focus rings: 2px accent ring on all interactive elements.
* Keyboard navigable (native tab order), even though no shortcuts MVP.
* DPI: Respect OS scaling; icons and 1px hairlines scale via CSS transforms to remain crisp.

---

## 12. Performance

* Initial paint ≤ 1200ms on mid‑spec workstation.
* Virtualize lists (projects table) over 200 rows.
* Defer heavy modules (CSV wizard, DCC launcher) until opened.

---

## 13. Security & Privacy

* No telemetry collection in MVP.
* External docs open in system browser (not embedded).
* Import CSV runs locally; files not uploaded externally.

---

## 14. Out of Scope (MVP)

* Command palette; full keyboard shortcut system
* Advanced permissions; audit logs; integrations beyond CSV
* Analytics dashboards; resource heatmaps

---

## 15. Acceptance Criteria (MVP)

1. **Header & Sidebar** match reference layout; dark theme by default; light theme toggle works.
2. **Projects** page: tabs (Projects/All projects/New view), filter row, empty state with 2 CTAs.
3. **Right‑click** works on sidebar items, tabs, and table rows (menus per §6).
4. **Import CSV** wizard completes and creates tasks into the selected project.
5. **Auto‑update** modal lists channels and builds; switching build prompts and restarts.
6. **DCC Launcher** resolves Rez/Conda env preview and can dry‑run + launch.
7. **4K scaling** verified; crisp borders including white‑chrome edge.
8. **Per‑project accent** color overrides apply to chips/buttons without breaking contrast.

---

## 16. Template System (Single‑File JSON)

The UI can be instantiated from a single JSON file (stored per workspace) that defines navigation, routes, and widgets. Example:

```json
{
  "templateId": "desktop-linear-v1",
  "theme": { "default": "dark", "accent": "#CBB7E8", "whiteChrome": true },
  "nav": [
    { "id": "inbox", "label": "Inbox", "icon": "inbox" },
    { "id": "myTasks", "label": "My tasks", "icon": "person" },
    { "id": "projects", "label": "Projects", "icon": "box" },
    { "id": "views", "label": "Views", "icon": "grid" },
    { "id": "more", "label": "More", "icon": "dots" }
  ],
  "try": [
    { "id": "importCsv", "label": "Import tasks (CSV)", "icon": "upload" },
    { "id": "invite", "label": "Invite people", "icon": "user-plus" }
  ],
  "pages": {
    "projects": {
      "tabs": ["Projects", "All projects", "New view"],
      "filters": { "enabled": true, "chips": ["Project: All", "Dept: All", "Assignee: Any"] },
      "emptyState": {
        "title": "Projects",
        "body": "Projects are larger units of work with a clear outcome…",
        "primary": { "label": "Create new project" },
        "secondary": { "label": "Documentation", "href": "https://docs.example.com" }
      }
    }
  },
  "projectTheme": {
    "allowAccentOverride": true,
    "swatches": ["#CBB7E8","#B7D3F2","#F4C6D7","#CDE8D6","#F9E7A1"]
  }
}
```

---

## 17. File & Naming (Single File Delivery)

* **This PRD** is the source of truth for MVP UI.
* Accompanying implementation should keep UI code in a single entry (e.g., `AppShell.(tsx|py)` for scaffolding) with modular imports hidden behind a widget registry. The **template JSON** (above) lives as one file per workspace.

---

## 18. Open Questions (tracked post‑MVP)

* Do we need a right‑hand **Details rail** in Projects (like a preview) for selection?
* Should the **Display** menu include density & compactness toggles in MVP?
* Preferred locations for **Studio Announce** default landing (Project view vs announcement board)?

---

### End of PRD
