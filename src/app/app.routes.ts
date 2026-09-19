import { Routes } from '@angular/router';
import { App } from './app';
import { CaptchaComponent } from './captcha/captcha';
import { HomeComponent } from './home/home';
import { captchaGuard } from './core/guards/captchaGuard';
import { ResultComponent } from './result/result';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "captcha",
        component: CaptchaComponent
    },
    {
        path: "result",
        component: ResultComponent,
        canActivate: [captchaGuard]
    }
];
