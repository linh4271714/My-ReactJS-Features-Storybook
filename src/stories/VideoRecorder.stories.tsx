import type { Meta, StoryObj } from "@storybook/react";
import { EliceVideoRecorder } from "../components/video-recorder";

//
//
//

const meta: Meta<typeof EliceVideoRecorder> = {
  title: "Example/VideoRecorder",
  component: EliceVideoRecorder,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

export default meta;

//
//
//

type Story = StoryObj<typeof EliceVideoRecorder>;

export const Basic: Story = {
  args: {
    onSubmit: () => {
      console.info("call onSubmit function");
    },
  },
};
