import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

const normalizeRole = (rawRole?: string | null): 'DOCTOR' | 'CAREGIVER' | 'PATIENT' | null => {
  if (!rawRole) {
    return null;
  }
  const role = rawRole.replace(/^ROLE_/i, '').toUpperCase();
  if (role === 'SOIGNANT' || role === 'DOCTOR') {
    return 'DOCTOR';
  }
  if (role === 'ACCOMPAGNANT' || role === 'CAREGIVER') {
    return 'CAREGIVER';
  }
  if (role === 'PATIENT') {
    return 'PATIENT';
  }
  return null;
};

export const roleGuard = (requiredRole: 'DOCTOR' | 'CAREGIVER' | 'PATIENT'): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      return router.createUrlTree(['/login']);
    }

    const currentRole = normalizeRole(currentUser.role);
    if (!currentRole || currentRole !== requiredRole) {
      return router.createUrlTree(['/home']);
    }

    return true;
  };
};
