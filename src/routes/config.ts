export interface RouteAccessRule {
  pattern: RegExp;
  requiresAuth?: boolean;
  publicOnly?: boolean;
  allowedRoles?: string[];
  redirect?: string;
}

export const routeAccessRules: RouteAccessRule[] = [
  { pattern: /^\/dashboard/, requiresAuth: true, redirect: '/login' },
  {
    pattern: /^\/settings/,
    requiresAuth: true,
    allowedRoles: ['SUPER_ADMIN', 'CLINIC_OWNER', 'MANAGER'],
    redirect: '/dashboard'
  },
  { pattern: /^\/login$/, publicOnly: true, redirect: '/dashboard' },
  { pattern: /^\/recover$/, publicOnly: true, redirect: '/dashboard' },
  { pattern: /^\/two-factor$/, publicOnly: true, redirect: '/dashboard' }
];
