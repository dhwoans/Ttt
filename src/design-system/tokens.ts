export const designTokens = {
  colors: {
    primary: {
      50: "var(--color-primary-50)",
      100: "var(--color-primary-100)",
      300: "var(--color-primary-300)",
      500: "var(--color-primary-500)",
      700: "var(--color-primary-700)",
      900: "var(--color-primary-900)",
    },
    gray: {
      0: "var(--color-gray-0)",
      50: "var(--color-gray-50)",
      100: "var(--color-gray-100)",
      200: "var(--color-gray-200)",
      400: "var(--color-gray-400)",
      700: "var(--color-gray-700)",
      900: "var(--color-gray-900)",
      1000: "var(--color-gray-1000)",
    },
    semantic: {
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      error: "var(--color-error)",
      info: "var(--color-info)",
    },
  },
  typography: {
    fontFamily: {
      display: "var(--font-family-display)",
      body: "var(--font-family-body)",
    },
    fontSize: {
      xs: "var(--font-size-xs)",
      sm: "var(--font-size-sm)",
      md: "var(--font-size-md)",
      lg: "var(--font-size-lg)",
      xl: "var(--font-size-xl)",
      xxl: "var(--font-size-2xl)",
      xxxl: "var(--font-size-3xl)",
    },
    lineHeight: {
      tight: "var(--line-height-tight)",
      normal: "var(--line-height-normal)",
      relaxed: "var(--line-height-relaxed)",
    },
    fontWeight: {
      regular: "var(--font-weight-regular)",
      medium: "var(--font-weight-medium)",
      semibold: "var(--font-weight-semibold)",
      bold: "var(--font-weight-bold)",
      black: "var(--font-weight-black)",
    },
  },
  spacing: {
    1: "var(--spacing-1)",
    2: "var(--spacing-2)",
    3: "var(--spacing-3)",
    4: "var(--spacing-4)",
    5: "var(--spacing-5)",
    6: "var(--spacing-6)",
    8: "var(--spacing-8)",
    10: "var(--spacing-10)",
    12: "var(--spacing-12)",
  },
  radius: {
    xs: "var(--radius-xs)",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    full: "var(--radius-full)",
  },
  shadows: {
    brutal: "5px 5px 0 0 var(--color-black)",
  },
} as const;

export const semanticTokens = {
  button: {
    primary: {
      background: "var(--color-primary-500)",
      text: "var(--color-gray-1000)",
    },
    secondary: {
      background: "var(--color-gray-0)",
      text: "var(--color-gray-1000)",
    },
    danger: {
      background: "var(--color-error)",
      text: "var(--color-gray-0)",
    },
  },
  surface: {
    canvas: "var(--color-gray-50)",
    panel: "var(--color-gray-100)",
    inverse: "var(--color-gray-900)",
  },
  text: {
    primary: "var(--color-gray-1000)",
    secondary: "var(--color-gray-700)",
    inverse: "var(--color-gray-0)",
  },
} as const;

export type DesignTokens = typeof designTokens;
