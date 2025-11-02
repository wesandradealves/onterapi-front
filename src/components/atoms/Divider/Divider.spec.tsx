import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Divider from './index';

describe('Divider atom', () => {
  it('renders label when provided', () => {
    render(<Divider label="ou" />);
    expect(screen.getByText('ou')).toBeInTheDocument();
  });
});
