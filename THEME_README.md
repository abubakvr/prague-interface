# Theme System Documentation

## Overview

This application now supports light and dark themes with a comprehensive theme switching system. Users can choose between Light, Dark, or System (follows OS preference) themes.

## Features

### Theme Options

- **Light Theme**: Clean, bright interface with blue accents
- **Dark Theme**: Dark interface with slate colors for better eye comfort
- **System Theme**: Automatically follows the user's operating system preference

### Theme Persistence

- Theme selection is automatically saved to localStorage
- Theme persists across browser sessions
- System theme automatically updates when OS preference changes

## Implementation Details

### Theme Context (`src/context/ThemeContext.tsx`)

- Provides theme state management throughout the application
- Handles localStorage persistence
- Listens for system theme changes
- Exports `useTheme` hook for components

### Theme Toggle Component (`src/components/ThemeToggle.tsx`)

- Dropdown menu for theme selection
- Shows current theme with appropriate icon
- Positioned above the settings button in the sidebar

### Updated Components

The following components now support both light and dark themes:

1. **SideBar** - Navigation sidebar with theme-aware colors
2. **TopBar** - Top navigation bar with responsive theme support
3. **Header** - Authentication pages header
4. **SettingsModal** - Settings modal with theme-aware form styling

### Tailwind Configuration

- Dark mode enabled using `class` strategy
- Custom color palette for sidebar themes
- CSS variables for background and foreground colors

### CSS Variables

```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
}

.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
}
```

## Usage

### In Components

```tsx
import { useTheme } from "@/context/ThemeContext";

export function MyComponent() {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`transition-colors duration-200 ${
        resolvedTheme === "dark"
          ? "bg-slate-800 text-slate-100"
          : "bg-white text-gray-900"
      }`}
    >
      Content
    </div>
  );
}
```

### Theme-Aware Styling Patterns

```tsx
// Background colors
className={`${
  resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'
}`}

// Text colors
className={`${
  resolvedTheme === 'dark' ? 'text-slate-100' : 'text-gray-900'
}`}

// Border colors
className={`${
  resolvedTheme === 'dark' ? 'border-slate-600' : 'border-gray-300'
}`}

// Hover states
className={`hover:${
  resolvedTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
}`}
```

## Color Palette

### Light Theme

- Primary: Blue tones (#1e40af, #1d4ed8, #1e3a8a)
- Background: White (#ffffff)
- Text: Dark grays (#0f172a, #374151)
- Borders: Light grays (#d1d5db, #e5e7eb)

### Dark Theme

- Primary: Slate tones (#0f172a, #1e293b, #020617)
- Background: Dark slate (#0f172a)
- Text: Light slates (#f8fafc, #e2e8f0)
- Borders: Medium slates (#475569, #64748b)

## Browser Support

- Modern browsers with CSS custom properties support
- Automatic fallback to light theme for unsupported browsers
- Graceful degradation for older browsers

## Future Enhancements

- Additional theme options (e.g., high contrast, custom colors)
- Theme-specific component variants
- Animation preferences per theme
- Export/import theme configurations
