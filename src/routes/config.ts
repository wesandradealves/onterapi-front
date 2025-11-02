export interface RouteAccessRule {
  pattern: RegExp;
  requiresAuth?: boolean;
  publicOnly?: boolean;
  allowedRoles?: string[];
  redirect?: string;
}

const DASHBOARD_ROUTE = '/dashboard';
const LOGIN_ROUTE = '/login';
const RECOVER_ROUTE = '/recover';
const TWO_FACTOR_ROUTE = '/two-factor';

export const routeAccessRules: RouteAccessRule[] = [
  { pattern: /^\/dashboard/, requiresAuth: true, redirect: LOGIN_ROUTE },
  {
    pattern: /^\/settings/,
    requiresAuth: true,
    allowedRoles: ['SUPER_ADMIN', 'CLINIC_OWNER', 'MANAGER'],
    redirect: DASHBOARD_ROUTE
  },
  { pattern: new RegExp(`^${LOGIN_ROUTE}$`), publicOnly: true, redirect: DASHBOARD_ROUTE },
  { pattern: new RegExp(`^${RECOVER_ROUTE}$`), publicOnly: true, redirect: DASHBOARD_ROUTE },
  { pattern: new RegExp(`^${TWO_FACTOR_ROUTE}$`), publicOnly: true, redirect: DASHBOARD_ROUTE }
];
