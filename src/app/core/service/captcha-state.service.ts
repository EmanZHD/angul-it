import { Injectable } from '@angular/core';
import { CaptchaState } from '../../models/captcha-state.interface';
import { Router } from '@angular/router';
import { CaptchaStorageSErvice } from './captcha-storage.service';
import { CaptchaGeneratorService } from './captcha-generator.service';
import { CaptchaTimerService } from './captcha-timer.service';
import { CaptchaCryptoService } from './captcha-crypto.service';

//mean here angular creates ine shared instance of this service for your app
@Injectable({
    providedIn: 'root'
})
export class CaptchaStateService {
    private readonly STORAGE_KEY = 'app_session_x7f3';
    private stateReady: Promise<void>;

    constructor(private router: Router,
        private captchastorage: CaptchaStorageSErvice,
        private captchaGenerator: CaptchaGeneratorService,
        private captchaTimer: CaptchaTimerService,
        private crypto: CaptchaCryptoService
    ) {
        this.stateReady = this.loadState();
        console.log("STATE > ", this.stateReady);
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
                response: null,
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

    async loadState(): Promise<void> {
        const savedRaw = localStorage.getItem(this.STORAGE_KEY);

        if (!savedRaw) {
            return;
        }
        if (!this.defaultState.stages.stage2.resolved) {
            this.captchaGenerator.generateMathNumbers(this.defaultState);
        }

        try {
            const savedJson = await this.crypto.decryptState(savedRaw);
            const saved = JSON.parse(savedJson);

            this.defaultState = {
                ...this.defaultState,
                ...saved,

                crono: {
                    ...this.defaultState.crono,
                    ...saved.crono,
                    interval: null,
                    isStarted: false
                },

                stages: {
                    ...this.defaultState.stages,
                    ...saved.stages,

                    stage1: {
                        ...this.defaultState.stages.stage1,
                        ...saved.stages?.stage1
                    },

                    stage2: {
                        ...this.defaultState.stages.stage2,
                        ...saved.stages?.stage2,

                        data: {
                            ...this.defaultState.stages.stage2.data,
                            ...saved.stages?.stage2?.data
                        }
                    },

                    satge3: {
                        ...this.defaultState.stages.satge3,
                        ...saved.stages?.satge3
                    }
                }
            };
            console.log("CURRENT this.defaultState > ", this.defaultState.stages);
            if (this.defaultState?.stages.stage1.selectedImages.length === 0) {
                this.resetState();
            }
        } catch (error) {
            console.error('ERROR LOADING CAPTCHA STATE:', error);
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
                    response: null,
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
        this.captchastorage.saveState(this.defaultState);
        localStorage.removeItem(this.STORAGE_KEY);
    }


    getCaptchType(): string {
        // console.log("TRACK FIRST STAGE > ", this.defaultState.stages.stage1);
        const s1 = this.defaultState.stages.stage1;
        if (!s1.resolved && s1.selectedImages.length === 0) {
            const ind = Math.floor(Math.random() * this.captchastorage.captchaTypes.length);
            s1.imageType = this.captchastorage.captchaTypes[ind];
            s1.expected = this.captchastorage.correctPositions[s1.imageType];
            s1.selectedImages = [];
            this.captchastorage.saveState(this.defaultState);
        }
        return s1.imageType;
    }

    handleCaptchaIMages(): string | null {
        // console.log("IN THE SERVICE > ", selectedImages, " | ", this.defaultState.stages.stage1.expected);
        const selectedImages = this.defaultState.stages.stage1.selectedImages;
        this.defaultState.stages.stage1.resolved = false;

        if (this.defaultState.stages.stage1.resolved) {
            return "Caught you 👀! Stage already cleared";
        }

        if (selectedImages.length === 0) {
            this.defaultState.currentStage = 1;
            return "Please select at least one image before proceeding.";
        }

        if (selectedImages.length !== this.defaultState.stages.stage1.expected.length ||
            !this.defaultState.stages.stage1.expected.every(position => selectedImages.includes(position))
        ) {
            this.defaultState.currentStage = 1;
            return `Not correct try to select just ${this.defaultState.stages.stage1.imageType.toLocaleUpperCase()}.`;
        }

        this.defaultState.stages.stage1.selectedImages = selectedImages;
        this.defaultState.stages.stage1.resolved = true;
        this.defaultState.currentStage = 2;

        this.captchastorage.saveState(this.defaultState);
        return null;
    }

    handleMathCaptcha(): string | null {
        const stage = this.defaultState.currentStage;
        const mathAnswer = this.defaultState.stages.stage2.response;

        if (this.defaultState.stages.stage2.resolved) {
            return "Caught you 👀! Stage already cleared";
        }
        // console.log("Submitting Captcha for Stage ->", stage);
        if (!mathAnswer) {
            this.defaultState.currentStage = 2;
            this.captchastorage.saveState(this.defaultState);
            return "Please provide an answer before proceeding.";
        }

        if (this.defaultState.stages.stage2.expected !== mathAnswer) {
            this.defaultState.stages.stage2.response = null;
            this.defaultState.currentStage = 2;
            this.captchastorage.saveState(this.defaultState);
            return "Try Agqin, not correct.";
        }

        this.defaultState.stages.stage2.response = mathAnswer;
        this.defaultState.stages.stage2.resolved = true;
        if (!this.defaultState.stages.satge3.expected) {
            this.captchaGenerator.generateCaptchaText(this.defaultState);
        }
        this.defaultState.currentStage = 3;
        this.captchastorage.saveState(this.defaultState);
        return null;
    }

    handleTextCaptcha(): string | null {
        const inputText = this.defaultState.stages.satge3.response.trim();

        if (inputText.length == 0) {
            return "ENter to continue.";
        }
        if (this.defaultState.stages.satge3.expected !== inputText) {
            return "NOt correct";
        } else {
            const state = this.getState();
            state.completed = true;
            this.defaultState.stages.satge3.resolved = true;
            this.captchaTimer.stopCrono(this.defaultState);
            this.captchastorage.saveState(this.defaultState);
            this.router.navigate(["/result"]);
        }
        return null;
    }

    toggleImage(index: number): void {
        const selected = this.defaultState.stages.stage1.selectedImages;
        const pos = selected.indexOf(index);

        if (pos !== -1) {
            selected.splice(pos, 1);
        } else {
            selected.push(index);
        }

        this.captchastorage.saveState(this.defaultState);
    }

    isImageSelected(index: number): boolean {
        return this.defaultState.stages.stage1.selectedImages.includes(index);
    }

    getState(): CaptchaState {
        // console.log('Current Captcha State:', this.defaultState);
        return this.defaultState;
    }

    nextStage(): void {
        if (this.defaultState.currentStage < 3) {
            this.defaultState.currentStage += 1;
        } else {
            this.defaultState.completed = true;
        }
    }
}