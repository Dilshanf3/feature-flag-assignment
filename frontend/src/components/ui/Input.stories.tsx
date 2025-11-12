import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Input from './Input';

const meta = {
  title: 'UI Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    required: {
      control: 'boolean'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url']
    }
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default Input',
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'user@example.com',
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    placeholder: 'This field is required',
    required: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
    value: 'Disabled value',
  },
};

export const Number: Story = {
  args: {
    label: 'Number Input',
    type: 'number',
    placeholder: '0',
  },
};