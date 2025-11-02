import { getServerSideProps } from './index';

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
});
