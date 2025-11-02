import type { Meta, StoryObj } from '@storybook/react';
import AuthTemplate from './index';

const meta: Meta<typeof AuthTemplate> = {
  title: 'Templates/AuthTemplate',
  component: AuthTemplate,
  args: {
    heading: 'Titulo principal',
    subtitle: 'Subtitulo de apoio para orientar o usuario.',
    form: <div className="p-4 bg-white rounded-lg">Form area</div>,
    footer: <div>Rodape padrao</div>,
    localeSwitcher: <div>Locale</div>,
    topAction: <button type="button">Ajuda</button>
  }
};

export default meta;

type Story = StoryObj<typeof AuthTemplate>;

export const Default: Story = {};
