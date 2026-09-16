export interface CaptchaState {
    currentStage: number;
    answers: {
        stage1: number[];
        stage2: string;
        stage3: string;
    };

    selectedImages: number[];
    captchaType: string;
    completed: boolean;
}