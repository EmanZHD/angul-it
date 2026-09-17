import { Injectable } from '@angular/core';
import { CaptchaState } from '../../models/captcha-state.interface';

//mean her angular creates ine shared instance of this service for your app
@Injectable({
    providedIn: 'root'
})
export class CaptchaStateService {
    constructor() {
        this.loadState();
    }
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

    getImages(): { src: string; alt: string }[] {
        return this.images;
    }

    private state: CaptchaState = {
        currentStage: 1,
        first: 0,
        second: 0,
        // imageType: 'palm',
        captchaText: '',
        answers: {
            stage1: [],
            stage2: '',
            stage3: ''
        },
        selectedImages: [],
        captchaType: '',
        completed: false
    };

    getState(): CaptchaState {
        console.log('Current Captcha State:', this.state);
        return this.state;
    }

    nextStage(): void {
        if (this.state.currentStage < 3) {
            this.state.currentStage += 1;
        } else {
            this.state.completed = true;
        }
    }

    saveState(newState: Partial<CaptchaState>): void {
        this.state = { ...this.state, ...newState };
        localStorage.setItem('captchaState', JSON.stringify(this.state));
    }

    loadState(): void {
        const savedState = localStorage.getItem('captchaState');
        if (savedState) {
            this.state = JSON.parse(savedState);
        }
    }

    resetState(): void {
        this.state = {
            currentStage: 1,
            first: 0,
            second: 0,
            // imageType: 'palm',
            captchaText: '',
            answers: {
                stage1: [],
                stage2: '',
                stage3: ''
            },
            selectedImages: [],
            captchaType: '',
            completed: false
        };
        localStorage.removeItem('captchaState');
    }

    setAnswers(stage: number, answer: number[] | string): void {
        switch (stage) {
            case 1:
                this.state.answers.stage1 = answer as number[];
                break;
            case 2:
                this.state.answers.stage2 = answer as string;
                break;
            case 3:
                this.state.answers.stage3 = answer as string;
                break;
            default:
                throw new Error('Invalid stage number');
        }
    }

    // setState(newState: Partial<CaptchaState>): void {
    //     this.state = { ...this.state, ...newState };
    // }

    generateCaptchaText(): string {
        if (this.state.answers.stage3?.length == 0) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            this.state.captchaText = Array.from({ length: 8 }, () =>
                chars[Math.floor(Math.random() * chars.length)]
            ).join('');
        }
        return this.state.captchaText;
    }
}