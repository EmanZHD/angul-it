export interface CaptchaState {
    crono: {
        interval: number | null,
        time: string,
        isStarted: boolean
    },
    stages: {
        stage1: {
            expected: number[],
            selectedImages: number[],
            imageType: string,
            resolved: boolean
        },
        stage2: {
            expected: number,
            data: {
                first: number,
                second: number
            },
            response: number,
            resolved: boolean
        },
        satge3: {
            expected: string,
            response: string,
            resolved: boolean
        }
    },
    currentStage: number,
    // imageType: string;
    completed: boolean
}