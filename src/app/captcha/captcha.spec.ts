import { TestBed } from '@angular/core/testing';
import { CaptchaStateService } from '../core/service/captcha-state.service';
import { CaptchaGeneratorService } from '../core/service/captcha-generator.service';
import { CaptchaStorageSErvice } from '../core/service/captcha-storage.service';
import { Statement } from '@angular/compiler';
import { CaptchaTimerService } from '../core/service/captcha-timer.service';

describe('CaptchaStateService', () => {
    let service: CaptchaGeneratorService;
    let serviceSTate: CaptchaStateService;
    let serviceSTorage: CaptchaStorageSErvice;
    let serviceGenerator: CaptchaGeneratorService;
    let serviceTIme: CaptchaTimerService

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            providers: [CaptchaGeneratorService, CaptchaStateService, CaptchaStorageSErvice, CaptchaGeneratorService, CaptchaTimerService]
        });

        service = TestBed.inject(CaptchaGeneratorService);
        serviceSTate = TestBed.inject(CaptchaStateService);
        serviceSTorage = TestBed.inject(CaptchaStorageSErvice);
        serviceGenerator = TestBed.inject(CaptchaGeneratorService);
        serviceTIme = TestBed.inject(CaptchaTimerService);

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
        const state = serviceSTate.getState();

        expect(state).toBeTruthy();
        expect(state.currentStage).toBe(1);
        expect(state.completed).toBe(false);
    });

    // CAPTCHA TYPE
    it('should return a captcha type', () => {
        const captchaType = serviceSTate.getCaptchType();

        expect(captchaType).toBeTruthy();
        expect(typeof captchaType).toBe('string');
    });


    // IMAGES
    it('should return captcha images', () => {
        const images = serviceSTorage.getImages();

        expect(images).toBeTruthy();
        expect(images.length).toBeGreaterThan(0);
    });

    it('should return images with src and alt properties', () => {
        const images = serviceSTorage.getImages();

        images.forEach(image => {
            expect(image.src).toBeTruthy();
            expect(image.alt).toBeTruthy();
        });
    });

    it('should toggle an image selection', () => {
        const state = serviceSTate.getState();

        state.stages.stage1.selectedImages = [];

        serviceSTate.toggleImage(0);

        expect(state.stages.stage1.selectedImages).toContain(0);
    });

    it('should remove an image when toggled twice', () => {
        const state = serviceSTate.getState();

        state.stages.stage1.selectedImages = [];

        serviceSTate.toggleImage(0);
        serviceSTate.toggleImage(0);

        expect(state.stages.stage1.selectedImages).not.toContain(0);
    });

    it('should correctly check whether an image is selected', () => {
        const state = serviceSTate.getState();

        state.stages.stage1.selectedImages = [0];

        expect(serviceSTate.isImageSelected(0)).toBe(true);
        expect(serviceSTate.isImageSelected(1)).toBe(false);
    });


    // STAGE 2 - RANDOM MATH CAPTCHA
    it('should generate a math captcha', () => {
        const state = serviceSTate.getState();
        const problem = serviceGenerator.generateMathNumbers(state);

        expect(problem).toBeTruthy();
        expect(typeof problem).toBe('string');
    });

    it('should generate a math captcha containing a plus sign', () => {
        const state = serviceSTate.getState();

        const problem = serviceGenerator.generateMathNumbers(state);

        expect(problem).toContain('+');
    });

    it('should generate a math captcha containing the question mark', () => {
        const state = serviceSTate.getState();

        const problem = serviceGenerator.generateMathNumbers(state);

        expect(problem).toContain('?');
    });

    it('should generate valid numbers in the math captcha', () => {
        const state = serviceSTate.getState();

        const problem = serviceGenerator.generateMathNumbers(state);

        const numbers = problem.match(/\d+/g);

        expect(numbers).toBeTruthy();
        expect(numbers!.length).toBe(2);

        numbers!.forEach(number => {
            expect(Number(number)).not.toBeNaN();
        });
    });

    it('should generate different math problems over multiple calls', () => {
        const problems = new Set<string>();
        const state = serviceSTate.getState();

        for (let i = 0; i < 20; i++) {
            problems.add(serviceGenerator.generateMathNumbers(state));
        }

        expect(problems.size).toBeGreaterThan(1);
    });


    // STAGE 3 - RANDOM TEXT CAPTCHA
    it('should generate captcha text', () => {
        const state = serviceSTate.getState();
        const captchaText = serviceGenerator.generateCaptchaText(state);

        expect(captchaText).toBeTruthy();
        expect(typeof captchaText).toBe('string');
    });

    it('should generate an 8-character captcha text', () => {
        const state = serviceSTate.getState();

        const captchaText = serviceGenerator.generateCaptchaText(state);

        expect(captchaText.length).toBe(8);
    });

    it('should generate captcha text using letters and numbers', () => {
        const state = serviceSTate.getState();
        const captchaText = serviceGenerator.generateCaptchaText(state);

        expect(captchaText).toMatch(/^[A-Za-z0-9]{8}$/);
    });

    it('should generate different captcha texts over multiple calls', () => {
        const captchas = new Set<string>();
        const state = serviceSTate.getState();

        for (let i = 0; i < 20; i++) {
            captchas.add(serviceGenerator.generateCaptchaText(state));
        }

        expect(captchas.size).toBeGreaterThan(1);
    });

    it('should return an error when stage 1 images are incorrect', () => {
        const state = serviceSTate.getState();

        state.stages.stage1.selectedImages = [];

        const result = serviceSTate.handleCaptchaIMages();

        expect(result).not.toBeNull();
        expect(state.stages.stage1.resolved).toBe(false);
    });

    it('should return an error when the math answer is incorrect', () => {
        const state = serviceSTate.getState();

        const first = state.stages.stage2.data.first;
        const second = state.stages.stage2.data.second;

        state.stages.stage2.response = first + second + 1;

        const result = serviceSTate.handleMathCaptcha();

        expect(result).not.toBeNull();
        expect(state.stages.stage2.resolved).toBe(false);
    });

    it('should return an error when the text answer is incorrect', () => {
        const state = serviceSTate.getState();

        state.stages.satge3.response = 'wrongText';

        const result = serviceSTate.handleTextCaptcha();

        expect(result).not.toBeNull();
        expect(state.stages.satge3.resolved).toBe(false);
    });

    // STAGES
    it('should move to the next stage', () => {
        const state = serviceSTate.getState();

        state.currentStage = 1;

        serviceSTate.nextStage();

        expect(state.currentStage).toBe(2);
    });

    it('should move from stage 2 to stage 3', () => {
        const state = serviceSTate.getState();

        state.currentStage = 2;

        serviceSTate.nextStage();

        expect(state.currentStage).toBe(3);
    });


    // RESET
    it('should reset the captcha state', () => {
        const state = serviceSTate.getState();

        state.currentStage = 3;
        state.completed = true;

        serviceSTate.resetState();

        const newState = serviceSTate.getState();

        expect(newState.currentStage).toBe(1);
        expect(newState.completed).toBe(false);
    });


    // TIMER
    it('should start the timer', () => {
        const state = serviceSTate.getState();

        serviceTIme.startCrono(state);

        expect(state.crono.isStarted).toBe(true);
    });

    it('should initialize the timer at 00:00', () => {
        const state = serviceSTate.getState();

        expect(state.crono.time).toBe('00:00');
    });
});