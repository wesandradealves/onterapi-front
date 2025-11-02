import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import HomeRedirect, { getServerSideProps } from './index.page';

describe('HomeRedirect page', () => {
  it('redirects to login via getServerSideProps', async () => {
    const result = await getServerSideProps({} as any);
    expect(result).toEqual({
      redirect: {
        destination: '/login',
        permanent: false
      }
    });
  });

  it('renderiza componente vazio', () => {
    const { container } = render(<HomeRedirect />);
    expect(container.firstChild).toBeNull();
  });
});
