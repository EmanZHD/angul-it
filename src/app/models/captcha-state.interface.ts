export interface CaptchaState {
    currentStage: number;
    first: number;
    second: number;
    // imageType: string;
    captchaText: string;
    answers: {
        stage1: number[];
        stage2: string;
        stage3: string;
    };

    selectedImages: number[];
    captchaType: string;
    completed: boolean;
}