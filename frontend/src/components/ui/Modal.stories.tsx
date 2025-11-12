import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Modal from './Modal';
import Button from './Button';
import { useState } from 'react';

const meta = {
  title: 'UI Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean'
    },
    title: {
      control: 'text'
    }
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Modal Title',
    onClose: () => {},
    children: (
      <div>
        <p className="mb-4">This is a simple modal with some content.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Confirm</Button>
        </div>
      </div>
    ),
  },
};

export const WithForm: Story = {
  args: {
    isOpen: true,
    title: 'Create New Item',
    onClose: () => {},
    children: (
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter name..."
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter description..."
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Create</Button>
        </div>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    isOpen: true,
    title: 'Terms and Conditions',
    onClose: () => {},
    children: (
      <div>
        <div className="prose max-w-none">
          <h3>Terms of Service</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <h4>Privacy Policy</h4>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" size="sm">Decline</Button>
          <Button variant="primary" size="sm">Accept</Button>
        </div>
      </div>
    ),
  },
};

// Interactive story that demonstrates opening/closing
const InteractiveModalTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Interactive Modal"
      >
        <div>
          <p className="mb-4">
            This modal can be opened and closed! Click the X button, press Escape, or click outside to close it.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm">
              Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const Interactive = {
  render: () => <InteractiveModalTemplate />,
  parameters: {
    docs: {
      description: {
        story: 'An interactive example that shows how the modal opens and closes.',
      },
    },
  },
};