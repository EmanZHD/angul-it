import { Injectable } from '@angular/core';
import { CaptchaState } from '../../models/captcha-state.interface';
import { MatDialog } from '@angular/material/dialog';
import { Popup } from '../../popup/popup';
import { Router } from '@angular/router';

//mean her angular creates ine shared instance of this service for your app
@Injectable({
    providedIn: 'root'
})
export class CaptchaStateService {

    private readonly STORAGE_KEY = 'app_session_x7f3';
    private readonly ENCRYPTION_PASSPHRASE = 'passkey';

    captchaTypes = ['palm', 'hydrant', 'stair'];

    public stateReady: Promise<void>;
    constructor(private dialog: MatDialog, private router: Router) {
        this.stateReady = this.loadState();
        console.log("STATE > ", this.stateReady);
    }

    private async getCryptoKey(): Promise<CryptoKey> {
        const enc = new TextEncoder().encode(this.ENCRYPTION_PASSPHRASE);
        const digest = await crypto.subtle.digest('SHA-256', enc); // 32 bytes -> AES-256
        return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
    }

    private async encryptState(plainText: string): Promise<string> {
        const key = await this.getCryptoKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const cipherBuf = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            new TextEncoder().encode(plainText)
        );

        const combined = new Uint8Array(iv.length + cipherBuf.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(cipherBuf), iv.length);

        let binary = '';
        combined.forEach(b => binary += String.fromCharCode(b));
        return btoa(binary);
    }

    private async decryptState(stored: string): Promise<string> {
        const key = await this.getCryptoKey();
        const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
        const iv = combined.slice(0, 12);
        const cipherBytes = combined.slice(12);

        const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBytes);
        return new TextDecoder().decode(plainBuf);
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

    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    openErrorPOpup(error: string) {
        const dialogREf = this.dialog.open(Popup, {
            panelClass: 'captcha-dialog'
        });

        dialogREf.componentInstance.errMessage = error;
    }

    getCaptchType(): string {
        // console.log("TRACK FIRST STAGE > ", this.defaultState.stages.stage1);

        const s1 = this.defaultState.stages.stage1;
        if (!s1.resolved) {
            const ind = Math.floor(Math.random() * this.captchaTypes.length);
            s1.imageType = this.captchaTypes[ind];
            s1.expected = this.correctPositions[s1.imageType];
            s1.selectedImages = [];
            this.saveState();
        }
        return s1.imageType;
    }

    generateMathNumbers() {
        if (!this.defaultState.stages.stage2.expected || !this.defaultState.stages.stage2.resolved) {
            this.defaultState.stages.stage2.data.first = this.randomInt(1, 10);
            this.defaultState.stages.stage2.data.second = this.randomInt(1, 10);
            this.defaultState.stages.stage2.expected = this.defaultState.stages.stage2.data.first + this.defaultState.stages.stage2.data.second;
            return `${this.defaultState.stages.stage2.data.first} + ${this.defaultState.stages.stage2.data.second} = ?`;
        }
        return `${this.defaultState.stages.stage2.data.first} + ${this.defaultState.stages.stage2.data.second} = ?`;
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

        if (!this.defaultState.stages.stage2.resolved) {
            this.generateMathNumbers();
        }

        this.saveState();
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
            this.saveState();
            return "Please provide an answer before proceeding.";
        }

        if (this.defaultState.stages.stage2.expected !== mathAnswer) {
            this.defaultState.stages.stage2.response = null;
            this.defaultState.currentStage = 2;
            this.saveState();
            return "Try Agqin, not correct.";
        }

        this.defaultState.stages.stage2.response = mathAnswer;
        this.defaultState.stages.stage2.resolved = true;
        if (!this.defaultState.stages.satge3.expected) {
            this.generateCaptchaText();
        }
        this.defaultState.currentStage = 3;
        this.saveState();
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
            this.stopCrono();
            this.saveState();
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

        this.saveState();
    }

    isImageSelected(index: number): boolean {
        return this.defaultState.stages.stage1.selectedImages.includes(index);
    }

    startCrono(): void {
        if (this.defaultState.crono.interval !== null) {
            return;
        }

        this.defaultState.crono.isStarted = true;

        this.defaultState.crono.interval = setInterval(() => {
            const time = this.defaultState.crono.time
                .split(':')
                .map(Number);

            time[1]++;

            if (time[1] === 60) {
                time[1] = 0;
                time[0]++;
            }

            this.defaultState.crono.time = time
                .map(v => v.toString().padStart(2, '0'))
                .join(':');

            this.saveState();

        }, 1000);
    }

    stopCrono(): void {
        if (this.defaultState.crono.interval !== null) {
            clearInterval(this.defaultState.crono.interval);
            this.defaultState.crono.interval = null;
        }

        this.defaultState.crono.isStarted = false;

        this.saveState();

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

    saveState(): void {
        const toSave = {
            ...this.defaultState,
            crono: { ...this.defaultState.crono, interval: null }
        };

        this.encryptState(JSON.stringify(toSave))
            .then(encrypted => localStorage.setItem(this.STORAGE_KEY, encrypted))
            .catch(err => console.error('Failed to persist captcha state:', err));
    }


    // saveState(): void {
    //     const toSave = {
    //         ...this.defaultState,
    //         crono: { ...this.defaultState.crono, interval: null }
    //     };
    //     localStorage.setItem('captchaState', JSON.stringify(toSave));
    // }
    async loadState(): Promise<void> {
        const savedRaw = localStorage.getItem(this.STORAGE_KEY);

        if (!savedRaw) {
            return;
        }

        try {
            const savedJson = await this.decryptState(savedRaw);
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
            console.log("CURRENT STATE > ", this.defaultState.stages);
            if (this.defaultState?.stages.stage1.selectedImages.length === 0) {
                this.resetState();
            }
        } catch (error) {
            console.error('ERROR LOADING CAPTCHA STATE:', error);
        }

        // if (this.defaultState.stages.stage1.selectedImages.length === 0) {
        //     this.resetState();
        // }
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
        localStorage.removeItem(this.STORAGE_KEY);
    }

    generateCaptchaText(): string {
        if (!this.defaultState.stages.satge3.expected || this.defaultState.stages.satge3.response.length === 0) {
            console.log("nooooooooooooooooooooo");

            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            this.defaultState.stages.satge3.expected = Array.from({ length: 8 }, () =>
                chars[Math.floor(Math.random() * chars.length)]
            ).join('');
        }
        return this.defaultState.stages.satge3.expected;
    }
}