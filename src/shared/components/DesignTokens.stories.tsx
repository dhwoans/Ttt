import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { designTokens } from "@/design-system/tokens";

function TokenSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full space-y-4 rounded-3xl border-4 border-black bg-white p-6 text-black shadow-[5px_5px_0_0_#000]">
      <h2 className="text-2xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div
        className="h-20 rounded-2xl border-4 border-black"
        style={{ backgroundColor: value }}
      />
      <div className="text-sm font-bold">{label}</div>
      <div className="text-xs text-gray-700">{value}</div>
    </div>
  );
}

function TokenCatalog() {
  const primaryColors = Object.entries(designTokens.colors.primary);
  const grayColors = Object.entries(designTokens.colors.gray);
  const semanticColors = Object.entries(designTokens.colors.semantic);
  const spacingTokens = Object.entries(designTokens.spacing);
  const radiusTokens = Object.entries(designTokens.radius);

  return (
    <div className="w-[min(1100px,100%)] space-y-6 text-black">
      <TokenSection title="Color Tokens">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-black">Primary</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {primaryColors.map(([token, value]) => (
                <Swatch key={token} label={`primary.${token}`} value={value} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-black">Gray</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {grayColors.map(([token, value]) => (
                <Swatch key={token} label={`gray.${token}`} value={value} />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-black">Semantic</h3>
            <div className="grid gap-4">
              {semanticColors.map(([token, value]) => (
                <Swatch key={token} label={`semantic.${token}`} value={value} />
              ))}
            </div>
          </div>
        </div>
      </TokenSection>

      <TokenSection title="Typography Tokens">
        <div className="space-y-4">
          <div
            style={{ fontFamily: designTokens.typography.fontFamily.display }}
          >
            <div className="text-sm font-bold">display</div>
            <div className="text-4xl">Black Han Sans Heading</div>
          </div>
          <div style={{ fontFamily: designTokens.typography.fontFamily.body }}>
            <div className="text-sm font-bold">body</div>
            <div className="text-xl">
              Lexend Mega body copy for system labels and gameplay UI.
            </div>
          </div>
        </div>
      </TokenSection>

      <TokenSection title="Spacing And Radius Tokens">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-lg font-black">Spacing</h3>
            {spacingTokens.map(([token, value]) => (
              <div key={token} className="flex items-center gap-4">
                <div className="w-24 text-sm font-bold">spacing.{token}</div>
                <div className="h-4 bg-black" style={{ width: value }} />
                <div className="text-xs text-gray-700">{value}</div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-black">Radius</h3>
            {radiusTokens.map(([token, value]) => (
              <div key={token} className="flex items-center gap-4">
                <div className="w-24 text-sm font-bold">radius.{token}</div>
                <div
                  className="h-14 w-24 border-4 border-black bg-yellow-300"
                  style={{ borderRadius: value }}
                />
                <div className="text-xs text-gray-700">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </TokenSection>
    </div>
  );
}

const meta = {
  title: "Foundations/Design Tokens",
  component: TokenCatalog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TokenCatalog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Catalog: Story = {};
