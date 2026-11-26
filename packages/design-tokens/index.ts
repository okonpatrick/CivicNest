let warnedDeprecatedColorAccent = false;

const primitiveValues = {
  color: {
    neutral: {
      0: "#ffffff",
      50: "#f5f7f4",
      600: "#53665d",
      900: "#183229",
    },
    green: {
      50: "#edf5f0",
      700: "#39765c",
    },
    red: {
      50: "#fff4f3",
      700: "#702424",
    },
  },
  typography: {
    family: {
      sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    size: {
      caption: "0.8rem",
      body: "1.125rem",
      heading: "2.5rem",
    },
    weight: {
      regular: "400",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      body: "1.6",
      compact: "1.25",
    },
  },
  spacing: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    8: "2rem",
  },
  sizing: {
    icon: "1.25rem",
    controlMinHeight: "2.75rem",
    contentMaxWidth: "64rem",
    radiusCard: "0.75rem",
  },
  responsive: {
    compact: "40rem",
    wide: "64rem",
  },
  opacity: {
    disabled: "0.55",
    active: "0.88",
  },
  focus: {
    width: "3px",
    offset: "3px",
  },
} as const;

export interface CivicNestSemanticTokenTaxonomy {
  readonly color: {
    readonly text: {
      readonly primary: (typeof primitiveValues.color.neutral)[900];
      readonly muted: (typeof primitiveValues.color.neutral)[600];
      readonly inverse: (typeof primitiveValues.color.neutral)[0];
    };
    readonly surface: {
      readonly canvas: (typeof primitiveValues.color.neutral)[50];
      readonly card: (typeof primitiveValues.color.neutral)[0];
      readonly interactiveHover: (typeof primitiveValues.color.green)[50];
    };
    readonly emphasis: {
      readonly primary: (typeof primitiveValues.color.green)[700];
    };
    readonly border: {
      readonly emphasis: (typeof primitiveValues.color.green)[700];
    };
    readonly state: {
      readonly success: (typeof primitiveValues.color.green)[700];
      readonly error: (typeof primitiveValues.color.red)[700];
      readonly errorSurface: (typeof primitiveValues.color.red)[50];
    };
  };
  readonly typography: {
    readonly family: {
      readonly body: typeof primitiveValues.typography.family.sans;
    };
    readonly size: {
      readonly caption: typeof primitiveValues.typography.size.caption;
      readonly body: typeof primitiveValues.typography.size.body;
      readonly heading: typeof primitiveValues.typography.size.heading;
    };
    readonly weight: {
      readonly regular: typeof primitiveValues.typography.weight.regular;
      readonly semibold: typeof primitiveValues.typography.weight.semibold;
      readonly bold: typeof primitiveValues.typography.weight.bold;
    };
    readonly lineHeight: {
      readonly body: typeof primitiveValues.typography.lineHeight.body;
      readonly compact: typeof primitiveValues.typography.lineHeight.compact;
    };
  };
  readonly spacing: {
    readonly inline: {
      readonly compact: (typeof primitiveValues.spacing)[1];
      readonly regular: (typeof primitiveValues.spacing)[2];
      readonly relaxed: (typeof primitiveValues.spacing)[3];
    };
    readonly stack: {
      readonly compact: (typeof primitiveValues.spacing)[2];
      readonly regular: (typeof primitiveValues.spacing)[4];
      readonly relaxed: (typeof primitiveValues.spacing)[8];
    };
    readonly inset: {
      readonly card: (typeof primitiveValues.spacing)[5];
    };
  };
  readonly sizing: {
    readonly icon: {
      readonly default: typeof primitiveValues.sizing.icon;
    };
    readonly control: {
      readonly minHeight: typeof primitiveValues.sizing.controlMinHeight;
    };
    readonly content: {
      readonly maxWidth: typeof primitiveValues.sizing.contentMaxWidth;
    };
    readonly radius: {
      readonly card: typeof primitiveValues.sizing.radiusCard;
    };
  };
  readonly responsive: {
    readonly breakpoint: {
      readonly compact: typeof primitiveValues.responsive.compact;
      readonly wide: typeof primitiveValues.responsive.wide;
    };
    readonly gutter: {
      readonly page: (typeof primitiveValues.spacing)[8];
    };
  };
  readonly focus: {
    readonly ring: {
      readonly color: (typeof primitiveValues.color.neutral)[900];
      readonly width: typeof primitiveValues.focus.width;
      readonly offset: typeof primitiveValues.focus.offset;
    };
  };
  readonly interaction: {
    readonly hover: {
      readonly surface: "#edf5f0";
    };
    readonly disabled: {
      readonly opacity: typeof primitiveValues.opacity.disabled;
    };
    readonly active: {
      readonly opacity: typeof primitiveValues.opacity.active;
    };
  };
}

/**
 * Public semantic aliases grouped by user-facing role. Primitive scales remain
 * private so consumers depend on stable meaning rather than raw palette slots.
 */
export const civicNestSemanticTokenTaxonomy: CivicNestSemanticTokenTaxonomy = {
  color: {
    text: {
      primary: primitiveValues.color.neutral[900],
      muted: primitiveValues.color.neutral[600],
      inverse: primitiveValues.color.neutral[0],
    },
    surface: {
      canvas: primitiveValues.color.neutral[50],
      card: primitiveValues.color.neutral[0],
      interactiveHover: primitiveValues.color.green[50],
    },
    emphasis: {
      primary: primitiveValues.color.green[700],
    },
    border: {
      emphasis: primitiveValues.color.green[700],
    },
    state: {
      success: primitiveValues.color.green[700],
      error: primitiveValues.color.red[700],
      errorSurface: primitiveValues.color.red[50],
    },
  },
  typography: {
    family: {
      body: primitiveValues.typography.family.sans,
    },
    size: {
      caption: primitiveValues.typography.size.caption,
      body: primitiveValues.typography.size.body,
      heading: primitiveValues.typography.size.heading,
    },
    weight: {
      regular: primitiveValues.typography.weight.regular,
      semibold: primitiveValues.typography.weight.semibold,
      bold: primitiveValues.typography.weight.bold,
    },
    lineHeight: {
      body: primitiveValues.typography.lineHeight.body,
      compact: primitiveValues.typography.lineHeight.compact,
    },
  },
  spacing: {
    inline: {
      compact: primitiveValues.spacing[1],
      regular: primitiveValues.spacing[2],
      relaxed: primitiveValues.spacing[3],
    },
    stack: {
      compact: primitiveValues.spacing[2],
      regular: primitiveValues.spacing[4],
      relaxed: primitiveValues.spacing[8],
    },
    inset: {
      card: primitiveValues.spacing[5],
    },
  },
  sizing: {
    icon: {
      default: primitiveValues.sizing.icon,
    },
    control: {
      minHeight: primitiveValues.sizing.controlMinHeight,
    },
    content: {
      maxWidth: primitiveValues.sizing.contentMaxWidth,
    },
    radius: {
      card: primitiveValues.sizing.radiusCard,
    },
  },
  responsive: {
    breakpoint: {
      compact: primitiveValues.responsive.compact,
      wide: primitiveValues.responsive.wide,
    },
    gutter: {
      page: primitiveValues.spacing[8],
    },
  },
  focus: {
    ring: {
      color: primitiveValues.color.neutral[900],
      width: primitiveValues.focus.width,
      offset: primitiveValues.focus.offset,
    },
  },
  interaction: {
    hover: {
      surface: primitiveValues.color.green[50],
    },
    disabled: {
      opacity: primitiveValues.opacity.disabled,
    },
    active: {
      opacity: primitiveValues.opacity.active,
    },
  },
};

export type CivicNestSemanticTokenPath =
  | "color.text.primary"
  | "color.text.muted"
  | "color.text.inverse"
  | "color.surface.canvas"
  | "color.surface.card"
  | "color.surface.interactiveHover"
  | "color.emphasis.primary"
  | "color.border.emphasis"
  | "color.state.success"
  | "color.state.error"
  | "color.state.errorSurface"
  | "typography.family.body"
  | "typography.size.caption"
  | "typography.size.body"
  | "typography.size.heading"
  | "typography.weight.regular"
  | "typography.weight.semibold"
  | "typography.weight.bold"
  | "typography.lineHeight.body"
  | "typography.lineHeight.compact"
  | "spacing.inline.compact"
  | "spacing.inline.regular"
  | "spacing.inline.relaxed"
  | "spacing.stack.compact"
  | "spacing.stack.regular"
  | "spacing.stack.relaxed"
  | "spacing.inset.card"
  | "sizing.icon.default"
  | "sizing.control.minHeight"
  | "sizing.content.maxWidth"
  | "sizing.radius.card"
  | "responsive.breakpoint.compact"
  | "responsive.breakpoint.wide"
  | "responsive.gutter.page"
  | "focus.ring.color"
  | "focus.ring.width"
  | "focus.ring.offset"
  | "interaction.hover.surface"
  | "interaction.disabled.opacity"
  | "interaction.active.opacity";

export type CivicNestSemanticTokenTaxonomyValue =
  CivicNestSemanticTokenLeafValue<CivicNestSemanticTokenTaxonomy>;

type CivicNestSemanticTokenLeafValue<T> = T extends string
  ? T
  : T extends object
    ? CivicNestSemanticTokenLeafValue<T[keyof T]>
    : never;

export interface CivicNestTokens {
  /**
   * @deprecated Use `civicNestSemanticTokens.colorEmphasis` instead. Remains
   * supported with identical value and contrast during the minimum deprecation
   * window (one full minor-release cycle and 90 days) before removal in a
   * future major release.
   */
  readonly colorAccent: "#39765c";
  readonly colorSurface: "#ffffff";
  readonly colorText: "#183229";
  readonly radiusCard: "0.75rem";
  readonly spaceCard: "1.25rem";
}

/**
 * Legacy starter token object preserved with its original five keys during the
 * `colorAccent` deprecation window so exhaustive consumers of
 * `CivicNestTokenName` continue to type-check without modification.
 */
export const civicNestTokens: CivicNestTokens = {
  get colorAccent() {
    if (import.meta.env.DEV && !warnedDeprecatedColorAccent) {
      warnedDeprecatedColorAccent = true;
      console.warn(
        "[CivicNest/@civicnest/design-tokens] `civicNestTokens.colorAccent` is deprecated. Migrate to `civicNestSemanticTokens.colorEmphasis`; `civicNestTokens.colorAccent` remains supported during the deprecation window and will only be removed in a future major release.",
      );
    }
    return primitiveValues.color.green[700];
  },
  colorSurface: primitiveValues.color.neutral[0],
  colorText: primitiveValues.color.neutral[900],
  radiusCard: "0.75rem",
  spaceCard: primitiveValues.spacing[5],
};

export type CivicNestTokenName = keyof CivicNestTokens;
export type CivicNestTokenValue = CivicNestTokens[CivicNestTokenName];

/**
 * Replacement semantic token contract introducing `colorEmphasis` without
 * expanding the legacy `CivicNestTokenName` union for existing exhaustive
 * consumers.
 */
export const civicNestSemanticTokens = {
  colorEmphasis: civicNestSemanticTokenTaxonomy.color.emphasis.primary,
  colorSurface: civicNestSemanticTokenTaxonomy.color.surface.card,
  colorText: civicNestSemanticTokenTaxonomy.color.text.primary,
  radiusCard: "0.75rem",
  spaceCard: civicNestSemanticTokenTaxonomy.spacing.inset.card,
} as const;

export type CivicNestSemanticTokens = typeof civicNestSemanticTokens;
export type CivicNestSemanticTokenName = keyof CivicNestSemanticTokens;
export type CivicNestSemanticTokenValue =
  CivicNestSemanticTokens[CivicNestSemanticTokenName];
