import { Injectable } from "@angular/core";
import { CaptchaCryptoService } from "./captcha-crypto.service";
import { CaptchaState } from "../../models/captcha-state.interface";
import { CaptchaStateService } from "./captcha-state.service";

@Injectable({
    providedIn: 'root'
})
export class CaptchaStorageSErvice {
    private readonly STORAGE_KEY = 'app_session_x7f3';

    constructor(
        private crypto: CaptchaCryptoService
    ) { }

    public readonly captchaTypes = ['palm', 'hydrant', 'stair'];

    public images = [
        { src: "images/captcha/hydrant00.jpg", alt: "Image 1" },
        { src: "images/captcha/palm00.jpg", alt: "Image 2" },
        { src: "images/captcha/stair.png", alt: "Image 5" },
        { src: "images/captcha/stair00.png", alt: "Image 6" },
        { src: "images/captcha/palm02.jpg", alt: "Image 7" },
        { src: "images/captcha/hydrant02.jpg", alt: "Image 4" },
        { src: "images/captcha/palm03.jpg", alt: "Image 9" },
        { src: "images/captcha/hydrant01.jpg", alt: "Image 3" },
        { src: "images/captcha/palm01.jpg", alt: "Image 8" }
    ];

    public readonly correctPositions: Record<string, number[]> = {
        palm: [1, 4, 6, 8],
        hydrant: [0, 5, 7],
        stair: [2, 3]
    };

    getImages(): { src: string; alt: string }[] {
        return this.images;
    }

    saveState(state: CaptchaState): void {
        const toSave = {
            ...state,
            crono: { ...state.crono, interval: null }
        };

        this.crypto.encryptState(JSON.stringify(toSave))
            .then(encrypted => localStorage.setItem(this.STORAGE_KEY, encrypted))
            .catch(err => console.error('Failed to persist captcha state:', err));
    }

}