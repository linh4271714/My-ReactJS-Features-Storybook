import type { Meta, StoryObj } from "@storybook/react";
import { EliceVoiceRecorder } from "../components/voice-recorder";

//
//
//

const meta: Meta<typeof EliceVoiceRecorder> = {
  title: "Example/VoiceRecorder",
  component: EliceVoiceRecorder,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

export default meta;

//
//
//

type Story = StoryObj<typeof EliceVoiceRecorder>;

export const Basic: Story = {
  args: {
    onSubmit: () => {
      console.info("call onSubmit function");
    },
  },
};
