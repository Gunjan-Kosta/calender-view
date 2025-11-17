import React from 'react';
import type { Preview } from "@storybook/react";
import '../src/index.css'; // Import tailwind styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="font-sans">
        <Story />
      </div>
    ),
  ],
};

export default preview;
