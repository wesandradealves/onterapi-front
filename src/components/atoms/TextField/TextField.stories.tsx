import type { Meta, StoryObj } from '@storybook/react';
import TextField from './index';

const meta: Meta<typeof TextField> = {
  title: 'Atoms/TextField',
  component: TextField,
  args: {
    label: 'Email',
    placeholder: 'seuemail@onterapi.com.br'
  }
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    errorMessage: 'Campo obrigatório'
  }
};
