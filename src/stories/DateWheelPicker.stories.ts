import type { Meta, StoryObj } from "@storybook/react";
import { WheelPicker } from "../components/wheel-picker/WheelPicker";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/DateWheelPicker",
  component: WheelPicker,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof WheelPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    containerHeight: 175,
    containerWidth: 297,
    itemHeight: 35,
  },
};
