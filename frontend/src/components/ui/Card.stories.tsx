import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Card, { CardHeader, CardContent, CardFooter } from './Card';
import Button from './Button';

const meta = {
  title: 'UI Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg']
    }
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-neutral-600">This is a simple card with some content inside it.</p>
      </div>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Card with Header</h3>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600">
          This card includes a header section that's visually separated from the content.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Complete Card</h3>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-600">
          This card has header, content, and footer sections. Perfect for forms or detailed information displays.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button variant="primary" size="sm">
            Save
          </Button>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const NoPadding: Story = {
  args: {
    padding: 'none',
  },
  render: (args) => (
    <Card {...args}>
      <div className="p-4 bg-neutral-50">
        <h3 className="text-lg font-semibold mb-2">No Padding Card</h3>
        <p className="text-neutral-600">This card has no internal padding, giving you full control over spacing.</p>
      </div>
    </Card>
  ),
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
  },
  render: (args) => (
    <Card {...args}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Small Padding</h3>
        <p className="text-neutral-600">This card has small internal padding.</p>
      </div>
    </Card>
  ),
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
  },
  render: (args) => (
    <Card {...args}>
      <div>
        <h3 className="text-lg font-semibold mb-2">Large Padding</h3>
        <p className="text-neutral-600">This card has large internal padding for a more spacious feel.</p>
      </div>
    </Card>
  ),
};