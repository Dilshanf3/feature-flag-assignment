import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Badge from './Badge';

const meta = {
  title: 'UI Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral']
    }
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'Neutral',
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="success">Approved</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Rejected</Badge>
      <Badge variant="info">Information</Badge>
      <Badge variant="neutral">Draft</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All badge variants displayed together.',
      },
    },
  },
};