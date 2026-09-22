import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard = (expectedRoles: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (!user) {
      router.navigate(['/connexion']);
      return false;
    }

    if (expectedRoles.includes(user.role)) {
      return true;
    }

    // Redirection automatique selon le rôle de l'utilisateur s'il tente d'accéder à un autre espace
    if (user.role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else if (user.role === 'agent') {
      router.navigate(['/agent/dashboard']);
    } else {
      router.navigate(['/candidat/dashboard']);
    }
    return false;
  };
};
