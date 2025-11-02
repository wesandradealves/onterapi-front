import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Seo from './index';

describe('Seo atom', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('injeta metadados basicos', () => {
    render(<Seo title="Titulo" description="Descricao" canonical="https://example.com" />);

    const title = document.querySelector('title');
    expect(title).toHaveTextContent('Titulo');

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute('content', 'Descricao');

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).toHaveAttribute('href', 'https://example.com');
  });
});
