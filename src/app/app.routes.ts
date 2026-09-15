import { Routes } from '@angular/router';
import { App } from './app';
import { CaptchaComponent } from './captcha/captcha';
import { HomeComponent } from './home/home';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "captcha",
        component: CaptchaComponent
    }
];
