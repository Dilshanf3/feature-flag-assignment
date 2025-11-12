import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const Welcome = () => (
  <div className="max-w-4xl mx-auto p-8">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">
         Feature Flag Management
      </h1>
      <h2 className="text-2xl text-neutral-700 mb-6">
        Component Library
      </h2>
      <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
        Welcome to the component documentation for the Car Damage Report & Feature Flag Management System. 
        This library showcases all reusable UI components used throughout the application.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="p-6 border border-neutral-200 rounded-lg">
        <h3 className="text-xl font-semibold text-neutral-900 mb-3"> Available Components</h3>
        <ul className="space-y-2 text-neutral-700">
          <li>• <strong>Button</strong> - Primary, secondary, and danger variants</li>
          <li>• <strong>Input</strong> - Form inputs with validation states</li>
          <li>• <strong>Card</strong> - Content containers and layouts</li>
          <li>• <strong>Modal</strong> - Dialog and overlay components</li>
          <li>• <strong>Badge</strong> - Status and category indicators</li>
        </ul>
      </div>

      <div className="p-6 border border-neutral-200 rounded-lg">
        <h3 className="text-xl font-semibold text-neutral-900 mb-3">Features</h3>
        <ul className="space-y-2 text-neutral-700">
          <li>• Interactive component playground</li>
          <li>• Auto-generated documentation</li>
          <li>• Accessibility testing integration</li>
          <li>• Responsive design preview</li>
          <li>• Props controls and examples</li>
        </ul>
      </div>
    </div>

    <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-primary-900 mb-3">Getting Started</h3>
      <p className="text-primary-800 mb-4">
        Navigate through the sidebar to explore different components. Each component includes:
      </p>
      <ul className="list-disc list-inside space-y-1 text-primary-700">
        <li>Interactive examples with different states and variants</li>
        <li>Documentation with prop descriptions and usage examples</li>
        <li>Controls panel to experiment with component properties</li>
        <li>Accessibility guidelines and best practices</li>
      </ul>
    </div>

    <div className="mt-8 text-center text-sm text-neutral-500">
      <p>
        Built with  using Storybook, Next.js, React 19, and Tailwind CSS
      </p>
    </div>
  </div>
);

const meta: Meta<typeof Welcome> = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Welcome to the Feature Flag Management Component Library! This is your starting point for exploring all available UI components.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Introduction: Story = {};