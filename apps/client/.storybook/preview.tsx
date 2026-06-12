import type { Decorator, Preview } from "@storybook/react";
import React from "react";

import "../src/index.css";

function MockGlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen p-6 flex items-start justify-center">
      <div className="w-full max-w-3xl">{children}</div>
    </div>
  );
}

const withGlobalProvider: Decorator = (Story) => (
  <MockGlobalProvider>
    <Story />
  </MockGlobalProvider>
);

const preview: Preview = {
  decorators: [withGlobalProvider],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
