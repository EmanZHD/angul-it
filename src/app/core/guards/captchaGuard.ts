import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CaptchaStateService } from '../service/captcha-state.service';

export const captchaGuard: CanActivateFn = () => {
    const captchaState = inject(CaptchaStateService);
    const router = inject(Router);
    console.log('Guard sees completed:', captchaState.getState().completed); 
    if (captchaState.getState().completed) {
        return true;
    }

    return router.createUrlTree(['/']);
};