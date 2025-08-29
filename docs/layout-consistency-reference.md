# Layout Consistency Reference Guide

## Visual Layout Inconsistencies Analysis

This document provides a comprehensive reference for identifying and fixing visual inconsistencies in header/sidebar layout separation across the application.

## 1. Before/After Visual Comparisons

### Current State Analysis

#### ✅ **PREFERRED STYLE** - Clean Header/Sidebar Separation
**Example: InboxPage**
```
┌─────────────────────────────────────────────────────────────┐
│ Header (56px height)                                        │
├─────────────┬───────────────────────────────────────────────┤ ← Clean 1px junction
│ Sidebar     │ Main Content                                  │
│ (72px/240px)│ - No visual gaps                              │
│             │ - Sharp corners                               │
│             │ - Seamless border alignment                   │
└─────────────┴───────────────────────────────────────────────┘
```

**Visual Characteristics:**
- **Gap**: 1px border separation (`gap: '1px'`)
- **Corners**: Sharp/angular (border-radius: 0)
- **Alignment**: Perfect header/sidebar border alignment
- **Background**: Consistent `var(--bg-surface-1)` for header/sidebar

#### ❌ **INCONSISTENT STYLE** - Project Pages
**Example: ProjectsPage, ProjectDetailsPage**
```
┌─────────────────────────────────────────────────────────────┐
│ Header (56px height)                                        │
├─────────────┬───────────────────────────────────────────────┤ ← Misaligned junction
│ Sidebar     │ Main Content                                  │
│ (72px/240px)│ - Visual gaps from PageWrapper padding        │
│             │ - Inconsistent corner treatment               │
│             │ - Border misalignment                         │
└─────────────┴───────────────────────────────────────────────┘
```

**Visual Issues:**
- **Gap**: Inconsistent spacing from PageWrapper padding
- **Corners**: Mixed border-radius values
- **Alignment**: Header/sidebar borders don't align perfectly
- **Background**: Inconsistent background treatment

## 2. CSS Code Samples for Fixes

### Core Layout Structure Fixes

```css
/* ============================================================================
   LAYOUT CONSISTENCY FIXES
   ============================================================================ */

/* Ensure sharp corners at all layout junctions */
.app-shell {
  border-radius: 0;
  overflow: hidden; /* Prevent any corner bleeding */
}

.app-body {
  gap: 0; /* Explicit no-gap between sidebar and main content */
  border-radius: 0;
}

/* Header - Sharp corners and consistent borders */
.header {
  height: 56px;
  background-color: var(--bg-surface-1);
  border-bottom: 1px solid var(--border-line);
  border-radius: 0; /* Override any inherited border-radius */
  box-shadow: var(--shadow-elev1);
  z-index: 100;
}

/* Sidebar - Sharp corners and consistent borders */
.sidebar,
.navigation-sidebar {
  background-color: var(--bg-surface-1);
  border-right: 1px solid var(--border-line);
  border-radius: 0; /* Override any inherited border-radius */
  transition: width 0.2s ease;
}

/* Main Content - Clean background and sharp corners */
.main-content {
  flex: 1;
  background-color: var(--bg-base);
  border-radius: 0; /* Override any inherited border-radius */
  overflow-y: auto;
  overflow-x: hidden;
}

/* Ensure PageWrapper doesn't interfere with layout junction */
.page-wrapper {
  border-radius: 0;
}

.page-wrapper--padded {
  /* Reduce top padding to prevent header separation */
  padding: var(--space-4) var(--space-4) var(--space-6) var(--space-4);
}
```

### Design Token Values Reference

```css
/* Spacing tokens used in layout */
--space-1: 4px;   /* Minimal gaps */
--space-2: 8px;   /* Small gaps */
--space-3: 12px;  /* Medium gaps */
--space-4: 16px;  /* Standard padding */
--space-6: 24px;  /* Large padding */

/* Border and radius tokens */
--border-line: #1E2630; /* Dark theme border */
--radius-input: 8px;    /* Standard border radius */
--radius-card: 12px;    /* Card border radius */

/* Background tokens */
--bg-base: #0B0D12;      /* Main content background */
--bg-surface-1: #0F141A; /* Header/sidebar background */
--bg-surface-2: #141A21; /* Secondary surface */

/* Shadow tokens */
--shadow-elev1: 0 1px 2px rgba(0,0,0,.08); /* Header shadow */
```

## 3. Component Usage Examples

### Correct PageWrapper Usage for Consistency

#### ✅ **RECOMMENDED** - Clean Layout Pattern
```tsx
// For pages requiring clean header/sidebar junction
<PageWrapper maxWidth="xl" padding={false}>
  <Container size="xl" padding>
    <Stack direction="vertical" gap="lg">
      {/* Page content */}
    </Stack>
  </Container>
</PageWrapper>
```

#### ✅ **ALTERNATIVE** - Custom Layout Control
```tsx
// For pages with custom layout requirements (like InboxPage)
<PageWrapper maxWidth="full" padding={false}>
  <div style={{
    display: 'flex',
    height: 'calc(100vh - 56px)', // Account for header height
    gap: '1px', // Minimal visual separation
    backgroundColor: 'var(--border-line)' // Creates clean 1px borders
  }}>
    {/* Custom layout content */}
  </div>
</PageWrapper>
```

#### ❌ **AVOID** - Inconsistent Pattern
```tsx
// This creates visual gaps and inconsistent spacing
<PageWrapper maxWidth="xl" padding> {/* padding=true causes issues */}
  <Stack direction="vertical" gap="lg">
    {/* Content gets extra padding that breaks junction alignment */}
  </Stack>
</PageWrapper>
```

### Container Component Best Practices

```tsx
// Consistent container usage
<Container 
  size="xl"           // Max width: 1280px
  padding={true}      // Horizontal padding: var(--space-4)
>
  {/* Content */}
</Container>

// For full-width layouts
<Container 
  size="full"         // No max-width constraint
  padding={false}     // No horizontal padding
>
  {/* Full-width content */}
</Container>
```

### Stack Component for Consistent Spacing

```tsx
// Vertical content spacing
<Stack 
  direction="vertical" 
  gap="lg"            // var(--space-6) = 24px
  align="stretch"
>
  {/* Vertically stacked content */}
</Stack>

// Horizontal element spacing
<Stack 
  direction="horizontal" 
  gap="md"            // var(--space-4) = 16px
  align="center"
  justify="between"
>
  {/* Horizontally arranged content */}
</Stack>
```

## 4. Visual Test Cases

### Test Case 1: Header/Sidebar Junction
**What to Check:**
- [ ] No visible gap between header bottom border and sidebar top
- [ ] Header and sidebar borders align perfectly
- [ ] Sharp corners at the junction (no border-radius)
- [ ] Consistent background colors

**CSS Inspector Values:**
```css
.header {
  border-bottom: 1px solid var(--border-line);
  border-radius: 0;
}

.sidebar {
  border-right: 1px solid var(--border-line);
  border-radius: 0;
}
```

### Test Case 2: Main Content Alignment
**What to Check:**
- [ ] Main content background is `var(--bg-base)`
- [ ] No unexpected padding at the top
- [ ] Content flows naturally from header
- [ ] Scrolling behavior is smooth

**CSS Inspector Values:**
```css
.main-content {
  background-color: var(--bg-base);
  border-radius: 0;
  padding-top: 0; /* Should not have top padding */
}
```

### Test Case 3: Responsive Behavior
**What to Check:**
- [ ] Mobile sidebar overlay maintains sharp corners
- [ ] Header height remains 56px across breakpoints
- [ ] Border alignment preserved on all screen sizes

**Breakpoint Testing:**
- Desktop: ≥1024px
- Tablet: 768px - 1023px  
- Mobile: <768px

## 5. Page-Specific Implementation Guide

### ProjectsPage Fix
```tsx
// BEFORE (inconsistent)
<PageWrapper maxWidth="xl" padding>

// AFTER (consistent)
<PageWrapper maxWidth="xl" padding={false}>
  <Container size="xl" padding>
```

### ProjectDetailsPage Fix
```tsx
// BEFORE (inconsistent)
<PageWrapper maxWidth="xl" padding>

// AFTER (consistent)  
<PageWrapper maxWidth="xl" padding={false}>
  <Container size="xl" padding>
```

### InboxPage (Already Correct)
```tsx
// Current implementation is the preferred pattern
<PageWrapper maxWidth="full" padding={false}>
  <div style={{
    display: 'flex',
    height: 'calc(100vh - 56px)',
    gap: '1px',
    backgroundColor: 'var(--border-line)'
  }}>
```

## 6. Verification Checklist

### Visual Verification Steps
1. **Open each page** (Projects, Project Details, Inbox, My Tasks, Design System)
2. **Inspect header/sidebar junction** - should be perfectly aligned
3. **Check for gaps** - only intentional 1px borders should be visible
4. **Verify corner sharpness** - no rounded corners at layout junctions
5. **Test responsive behavior** - consistency across all breakpoints

### CSS Inspector Checklist
- [ ] `.header` has `border-radius: 0`
- [ ] `.sidebar` has `border-radius: 0`  
- [ ] `.main-content` has `border-radius: 0`
- [ ] `.app-body` has `gap: 0`
- [ ] All borders use `var(--border-line)` consistently

### Component Props Checklist
- [ ] `PageWrapper padding={false}` for layout pages
- [ ] `Container padding={true}` for content spacing
- [ ] `Stack gap` values use design system tokens
- [ ] No conflicting margin/padding overrides

---

## Implementation Priority

1. **Phase 1**: Apply CSS fixes for sharp corners (immediate)
2. **Phase 2**: Update PageWrapper usage in ProjectsPage and ProjectDetailsPage  
3. **Phase 3**: Verify all pages match the InboxPage clean separation pattern
4. **Phase 4**: Add automated visual regression tests

This reference ensures consistent Linear-inspired layout styling across all application pages.
