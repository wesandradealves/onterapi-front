import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from './index';

describe('LoadingOverlay', () => {
  it('renders when visible', () => {
    render(<LoadingOverlay isVisible />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('does not render when hidden', () => {
    const { container } = render(<LoadingOverlay isVisible={false} />);
    expect(container).toBeEmptyDOMElement();
  });
});
