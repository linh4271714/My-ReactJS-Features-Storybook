import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

import type { Meta, StoryObj } from "@storybook/react";
import { EliceButton } from "../components/button";

//
//
//

const meta: Meta<typeof EliceButton> = {
  title: "Example/Button",
  component: EliceButton,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
};

export default meta;

//
//
//

type Story = StoryObj<typeof EliceButton>;

export const ContainedButton: Story = {
  args: {
    children: "제출",
    variant: "contained",
  },
};

export const ContainedButtonWithLeftIcon: Story = {
  args: {
    children: "Turn off alarm",
    variant: "contained",
    startIcon: <AccessAlarmIcon />,
  },
};

export const DisabledContainedButton: Story = {
  args: {
    children: "제출",
    variant: "contained",
    disabled: true,
  },
};

export const OutlinedButton: Story = {
  args: {
    children: "취소",
    variant: "outlined",
  },
};

export const OutlinedButtonWithRightIcon: Story = {
  args: {
    children: "Turn off alarm",
    variant: "outlined",
    endIcon: <AccessAlarmIcon />,
  },
};

export const DisabledOutlinedButton: Story = {
  args: {
    children: "취소",
    variant: "outlined",
    disabled: true,
  },
};
