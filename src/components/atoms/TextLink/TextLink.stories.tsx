import type { Meta, StoryObj } from '@storybook/react';
import TextLink from './index';

const meta: Meta<typeof TextLink> = {
  title: 'Atoms/TextLink',
  component: TextLink,
  args: {
    href: '#',
    children: 'Recuperar senha'
  }
};

export default meta;

type Story = StoryObj<typeof TextLink>;

export const Primary: Story = {};

export const Inverted: Story = {
  args: {
    variant: 'inverted'
  }
};
