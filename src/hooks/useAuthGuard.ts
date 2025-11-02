import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/router';
import { store } from '../store';
import { routeAccessRules } from '../routes/config';

export const resolveGuardRedirect = (redirect: string | undefined, fallback: string) =>
  redirect ?? fallback;

const getSessionSnapshot = () => store.getState().session;

export const useAuthGuard = () => {
  const router = useRouter();
  const session = useSyncExternalStore(store.subscribe, getSessionSnapshot, getSessionSnapshot);

  useEffect(() => {
    if (router.pathname === '/two-factor') {
      if (session.isAuthenticated) {
        router.replace('/dashboard');
        return;
      }

      if (!session.tempToken) {
        router.replace('/login');
        return;
      }
    }

    const rule = routeAccessRules.find(entry => entry.pattern.test(router.pathname));
    if (!rule) {
      return;
    }

    if (rule.publicOnly && session.isAuthenticated) {
      router.replace(resolveGuardRedirect(rule.redirect, '/dashboard'));
      return;
    }

    if (rule.requiresAuth && !session.isAuthenticated) {
      router.replace(resolveGuardRedirect(rule.redirect, '/login'));
      return;
    }

    if (rule.allowedRoles && !rule.allowedRoles.includes(session.role)) {
      router.replace(resolveGuardRedirect(rule.redirect, '/'));
    }
  }, [router, router.pathname, session.isAuthenticated, session.role, session.tempToken]);
};
