import type { Meta, StoryObj } from "@storybook/react";
import { EliceWebcamPictureTaker } from "../components/webcam-picture-taker";

//
//
//

const meta: Meta<typeof EliceWebcamPictureTaker> = {
  title: "Example/WebcamPictureTaker",
  component: EliceWebcamPictureTaker,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

export default meta;

//
//
//

type Story = StoryObj<typeof EliceWebcamPictureTaker>;

export const Basic: Story = {
  args: {
    onSubmit: () => {
      console.info("call onSubmit function");
    },
  },
};
