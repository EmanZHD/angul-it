import { Injectable } from '@angular/core';
import { CaptchaState } from '../../models/captcha-state.interface';

//mean her angular creates ine shared instance of this service for your app
@Injectable({
    providedIn: 'root'
})
export class CaptchaStateService {
    constructor() {
        this.loadState();

        if (this.defaultState.crono.interval !== null) {
            clearInterval(this.defaultState.crono.interval);
            this.defaultState.crono.interval = null;
            this.defaultState.crono.isStarted = false;
        }
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
    public readonly correctPositions: Record<string, number[]> = {
        palm: [1, 4, 6, 8],
        hydrant: [0, 5, 7],
        stair: [2, 3]
    };

    getImages(): { src: string; alt: string }[] {
        return this.images;
    }

    private defaultState: CaptchaState = {
        crono: {
            interval: null,
            time: '00:00',
            isStarted: false
        },
        stages: {
            stage1: {
                expected: [],
                selectedImages: [],
                imageType: '',
                resolved: false
            },

            stage2: {
                expected: 0,
                data: {
                    first: 0,
                    second: 0
                },
                response: 0,
                resolved: false
            },
            satge3: {
                expected: '',
                response: '',
                resolved: false
            }
        },
        currentStage: 1,
        // imageType: string;
        completed: false
    }

    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    handleMathCaptcha(): string {
        if (!this.defaultState.stages.stage2.expected) {
            this.defaultState.stages.stage2.data.first = this.randomInt(1, 10);
            this.defaultState.stages.stage2.data.second = this.randomInt(1, 10);
            this.mathProblem = `${this.defaultState.stages.stage2.data.first} + ${this.defaultState.stages.stage2.data.second} = ?`;
            this.defaultState.stages.stage2.expected = this.defaultState.stages.stage2.data.first + this.defaultState.stages.stage2.data.second;
            return this.mathProblem;
        }
        // console.log("CAPTCHA STAGE 2 --z> ", this.defaultState.answers.stage2?.length);

        return `${this.defaultState.stages.stage2.data.first} + ${this.defaultState.stages.stage2.data.second} = ?`;
    }

    handleCaptchaIMages(): string {
        this.defaultState.stages.stage1.resolved = false;

        if (this.selectedImages.length === 0) {
            this.defaultState.currentStage = 1;
            this.openErrorPOpup("Please select at least one image before proceeding.");
            return;
        }

        if (this.selectedImages.length !== this.defaultState.stages.stage1.expected.length &&
            this.defaultState.stages.stage1.expected.every(position => this.selectedImages.includes(position))
        ) {
            this.defaultState.currentStage = 1;
            this.openErrorPOpup(`Not correct try to select just ${this.defaultState.stages.stage1.imageType.toLocaleUpperCase()} .`);
            return;
        }

        // this.captchaStateService.setAnswers(stage, selected);
        this.defaultState.stages.stage1.selectedImages = this.selectedImages;
        this.defaultState.stages.stage1.resolved = true;
        this.getState();
        this.defaultState.currentStage = 2;

        if (!this.defaultState.stages.stage2.resolved) {
            this.mathProblem = this.handleMathCaptcha();
        }

        this.captchaStateService.saveState(this.defaultState);
    }


    // private state: CaptchaState = {
    //     currentStage: 1,
    //     first: 0,
    //     second: 0,
    //     crono: {
    //         interval: null,
    //         time: '00:00',
    //         isStarted: false
    //     },
    //     // imageType: 'palm',
    //     captchaText: '',
    //     answers: {
    //         stage1: [],
    //         stage2: '',
    //         stage3: ''
    //     },
    //     selectedImages: [],
    //     captchaType: '',
    //     completed: false
    // };

    startCrono(): void {
        if (this.defaultState.crono.interval !== null) return; // already running

        this.defaultState.crono.isStarted = true;
        this.defaultState.crono.interval = setInterval(() => {
            const time = this.defaultState.crono.time.split(':').map(Number);
            time[1]++;
            if (time[1] === 60) {
                time[1] = 0;
                time[0]++;
            }
            this.defaultState.crono.time = time
                .map(v => v.toString().padStart(2, '0'))
                .join(':');
            this.saveState(this.defaultState);
        }, 1000);
    }

    stopCrono(): void {
        if (this.defaultState.crono.interval !== null) {
            clearInterval(this.defaultState.crono.interval);
            this.defaultState.crono.interval = null;
        }
        this.defaultState.crono.isStarted = false;
        this.resetState()
    }


    getState(): CaptchaState {
        console.log('Current Captcha State:', this.defaultState);
        return this.defaultState;
    }

    nextStage(): void {
        if (this.defaultState.currentStage < 3) {
            this.defaultState.currentStage += 1;
        } else {
            this.defaultState.completed = true;
        }
    }

    saveState(newState: Partial<CaptchaState>): void {
        this.defaultState = { ...this.defaultState, ...newState };
        localStorage.setItem('captchaState', JSON.stringify(this.defaultState));
    }

    loadState(): void {
        const savedState = localStorage.getItem('captchaState');
        if (savedState) {
            const saved = JSON.parse(savedState);
            this.defaultState = {
                ...this.defaultState,
                ...saved,
                crono: {
                    ...this.defaultState.crono,
                    ...saved.crono
                }
            };
        }
    }

    resetState(): void {
        if (this.defaultState.crono.interval !== null) {
            clearInterval(this.defaultState.crono.interval);
        }
        this.defaultState = {
            crono: {
                interval: null,
                time: '00:00',
                isStarted: false
            },
            stages: {
                stage1: {
                    expected: [],
                    selectedImages: [],
                    imageType: '',
                    resolved: false
                },

                stage2: {
                    expected: 0,
                    data: {
                        first: 0,
                        second: 0
                    },
                    response: 0,
                    resolved: false
                },
                satge3: {
                    expected: '',
                    response: '',
                    resolved: false
                }
            },
            currentStage: 1,
            completed: false
        };
        localStorage.removeItem('captchaState');
    }

    // setAnswers(stage: number, answer: number[] | string): void {
    //     switch (stage) {
    //         case 1:
    //             this.state.answers.stage1 = answer as number[];
    //             break;
    //         case 2:
    //             this.state.answers.stage2 = answer as string;
    //             break;
    //         case 3:
    //             this.state.answers.stage3 = answer as string;
    //             break;
    //         default:
    //             throw new Error('Invalid stage number');
    //     }
    // }

    // generateCaptchaText(): string {
    //     if (this.defaultState.answers.stage3?.length == 0) {
    //         const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    //         this.defaultState.captchaText = Array.from({ length: 8 }, () =>
    //             chars[Math.floor(Math.random() * chars.length)]
    //         ).join('');
    //     }
    //     return this.defaultState.captchaText;
    // }
    generateCaptchaText(): string {
        if (this.defaultState.stages.satge3.response?.length == 0) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            this.defaultState.stages.satge3.expected = Array.from({ length: 8 }, () =>
                chars[Math.floor(Math.random() * chars.length)]
            ).join('');
        }
        return this.defaultState.stages.satge3.expected;
    }
}