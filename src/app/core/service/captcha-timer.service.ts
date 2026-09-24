import { Injectable } from "@angular/core";
import { CaptchaStateService } from "./captcha-state.service";
import { CaptchaState } from "../../models/captcha-state.interface";
import { CaptchaStorageSErvice } from "./captcha-storage.service";

@Injectable({
    providedIn: 'root'
})
export class CaptchaTimerService {

    // private state: CaptchaState;
    constructor(
        private captchaStorage: CaptchaStorageSErvice
    ) {
        // state = this.captchaStateService.getState();
    }

    startCrono(state: CaptchaState): void {
        if (state.crono.interval !== null) {
            return;
        }

        state.crono.isStarted = true;

        state.crono.interval = setInterval(() => {
            const time = state.crono.time
                .split(':')
                .map(Number);

            time[1]++;

            if (time[1] === 60) {
                time[1] = 0;
                time[0]++;
            }

            state.crono.time = time
                .map(v => v.toString().padStart(2, '0'))
                .join(':');

            this.captchaStorage.saveState(state);

        }, 1000);
    }

    stopCrono(state: CaptchaState): void {
        if (state.crono.interval !== null) {
            clearInterval(state.crono.interval);
            state.crono.interval = null;
        }

        state.crono.isStarted = false;

        this.captchaStorage.saveState(state);

    }
}