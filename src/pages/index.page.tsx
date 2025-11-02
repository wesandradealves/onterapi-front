import type { GetServerSideProps } from 'next';

const HomeRedirect = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/login',
    permanent: false
  }
});

export default HomeRedirect;
