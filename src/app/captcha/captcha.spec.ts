import { TestBed } from '@angular/core/testing';
import { CaptchaStateService } from '../core/service/captcha-state.service';

describe('CaptchaStateService', () => {
    let service: CaptchaStateService;

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            providers: [CaptchaStateService]
        });

        service = TestBed.inject(CaptchaStateService);
    });

    afterEach(() => {
        localStorage.clear();
    });

    // CREATION
    it('should create', () => {
        expect(service).toBeTruthy();
    });


    // STATE
    it('should return the initial state', () => {
        const state = service.getState();

        expect(state).toBeTruthy();
        expect(state.currentStage).toBe(1);
        expect(state.completed).toBe(false);
    });

    // CAPTCHA TYPE
    it('should return a captcha type', () => {
        const captchaType = service.getCaptchType();

        expect(captchaType).toBeTruthy();
        expect(typeof captchaType).toBe('string');
    });


    // IMAGES
    it('should return captcha images', () => {
        const images = service.getImages();

        expect(images).toBeTruthy();
        expect(images.length).toBeGreaterThan(0);
    });

    it('should return images with src and alt properties', () => {
        const images = service.getImages();

        images.forEach(image => {
            expect(image.src).toBeTruthy();
            expect(image.alt).toBeTruthy();
        });
    });

    it('should toggle an image selection', () => {
        const state = service.getState();

        state.stages.stage1.selectedImages = [];

        service.toggleImage(0);

        expect(state.stages.stage1.selectedImages).toContain(0);
    });

    it('should remove an image when toggled twice', () => {
        const state = service.getState();

        state.stages.stage1.selectedImages = [];

        service.toggleImage(0);
        service.toggleImage(0);

        expect(state.stages.stage1.selectedImages).not.toContain(0);
    });

    it('should correctly check whether an image is selected', () => {
        const state = service.getState();

        state.stages.stage1.selectedImages = [0];

        expect(service.isImageSelected(0)).toBe(true);
        expect(service.isImageSelected(1)).toBe(false);
    });


    // STAGE 2 - RANDOM MATH CAPTCHA
    it('should generate a math captcha', () => {
        const problem = service.generateMathNumbers();

        expect(problem).toBeTruthy();
        expect(typeof problem).toBe('string');
    });

    it('should generate a math captcha containing a plus sign', () => {
        const problem = service.generateMathNumbers();

        expect(problem).toContain('+');
    });

    it('should generate a math captcha containing the question mark', () => {
        const problem = service.generateMathNumbers();

        expect(problem).toContain('?');
    });

    it('should generate valid numbers in the math captcha', () => {
        const problem = service.generateMathNumbers();

        const numbers = problem.match(/\d+/g);

        expect(numbers).toBeTruthy();
        expect(numbers!.length).toBe(2);

        numbers!.forEach(number => {
            expect(Number(number)).not.toBeNaN();
        });
    });

    it('should generate different math problems over multiple calls', () => {
        const problems = new Set<string>();

        for (let i = 0; i < 20; i++) {
            problems.add(service.generateMathNumbers());
        }

        expect(problems.size).toBeGreaterThan(1);
    });


    // STAGE 3 - RANDOM TEXT CAPTCHA
    it('should generate captcha text', () => {
        const captchaText = service.generateCaptchaText();

        expect(captchaText).toBeTruthy();
        expect(typeof captchaText).toBe('string');
    });

    it('should generate an 8-character captcha text', () => {
        const captchaText = service.generateCaptchaText();

        expect(captchaText.length).toBe(8);
    });

    it('should generate captcha text using letters and numbers', () => {
        const captchaText = service.generateCaptchaText();

        expect(captchaText).toMatch(/^[A-Za-z0-9]{8}$/);
    });

    it('should generate different captcha texts over multiple calls', () => {
        const captchas = new Set<string>();

        for (let i = 0; i < 20; i++) {
            captchas.add(service.generateCaptchaText());
        }

        expect(captchas.size).toBeGreaterThan(1);
    });

    it('should return an error when stage 1 images are incorrect', () => {
        const state = service.getState();

        state.stages.stage1.selectedImages = [];

        const result = service.handleCaptchaIMages();

        expect(result).not.toBeNull();
        expect(state.stages.stage1.resolved).toBe(false);
    });

    it('should return an error when the math answer is incorrect', () => {
        const state = service.getState();

        const first = state.stages.stage2.data.first;
        const second = state.stages.stage2.data.second;

        state.stages.stage2.response = first + second + 1;

        const result = service.handleMathCaptcha();

        expect(result).not.toBeNull();
        expect(state.stages.stage2.resolved).toBe(false);
    });

    it('should return an error when the text answer is incorrect', () => {
        const state = service.getState();

        state.stages.satge3.response = 'wrongText';

        const result = service.handleTextCaptcha();

        expect(result).not.toBeNull();
        expect(state.stages.satge3.resolved).toBe(false);
    });

    // STAGES
    it('should move to the next stage', () => {
        const state = service.getState();

        state.currentStage = 1;

        service.nextStage();

        expect(state.currentStage).toBe(2);
    });

    it('should move from stage 2 to stage 3', () => {
        const state = service.getState();

        state.currentStage = 2;

        service.nextStage();

        expect(state.currentStage).toBe(3);
    });


    // RESET
    it('should reset the captcha state', () => {
        const state = service.getState();

        state.currentStage = 3;
        state.completed = true;

        service.resetState();

        const newState = service.getState();

        expect(newState.currentStage).toBe(1);
        expect(newState.completed).toBe(false);
    });


    // TIMER
    it('should start the timer', () => {
        const state = service.getState();

        service.startCrono();

        expect(state.crono.isStarted).toBe(true);
    });

    it('should initialize the timer at 00:00', () => {
        const state = service.getState();

        expect(state.crono.time).toBe('00:00');
    });
});