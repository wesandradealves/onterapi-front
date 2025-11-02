import type { Meta, StoryObj } from '@storybook/react';
import PublicLayout from './index';

const meta: Meta<typeof PublicLayout> = {
  title: 'Layouts/PublicLayout',
  component: PublicLayout,
  args: {
    children: <div className="text-white">Conteudo</div>
  }
};

export default meta;

type Story = StoryObj<typeof PublicLayout>;

export const Default: Story = {};
