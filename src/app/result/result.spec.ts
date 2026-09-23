import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ResultComponent } from './result';
import { CaptchaStateService } from '../core/service/captcha-state.service';

describe('ResultComponent', () => {
    let component: ResultComponent;
    let fixture: ComponentFixture<ResultComponent>;

    const miState = {
        currentStage: 3,
        completed: true,
        crono: {
            interval: null,
            time: '00:08',
            isStarted: false
        },
        stages: {
            stage1: {
                expected: [],
                selectedImages: [],
                imageType: 'hydrant',
                resolved: true
            },
            stage2: {
                expected: 10,
                data: {
                    first: 5,
                    second: 5
                },
                response: 10,
                resolved: true
            },
            satge3: {
                expected: 'Ab12Cd34',
                response: 'Ab12Cd34',
                resolved: true
            }
        }
    };

    const mockCaptchaStateService = {
        getState: vi.fn(() => miState),
        resetState: vi.fn()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResultComponent],
            providers: [
                provideRouter([
                    { path: '', component: ResultComponent },
                    { path: 'captcha', component: ResultComponent }
                ]),
                {
                    provide: CaptchaStateService,
                    useValue: mockCaptchaStateService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ResultComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });
    // CREATION
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // TIME
    it('should display the captcha completion time', () => {
        expect(component.formattedTine).toBe('00:08');
    });

    it('should display the time in the template', () => {
        const time = fixture.nativeElement.querySelector(
            '.time-value'
        ) as HTMLElement;

        expect(time).toBeTruthy();
        expect(time.textContent?.trim()).toBe('00:08');
    });

    // PERFORMANCE - LIGHTNING FAST
    it('should show Lightning Fast for a time of 10 seconds or less', () => {
        component['applyPerformance'](10);

        expect(component.performanceLabel).toBe('Lightning Fast');
        expect(component.performanceMessage)
            .toBe('You solved it in record time!');
        expect(component.performanceRating).toBe(5);
        expect(component.performanceColor).toBe('#4caf50');
    });

    it('should show Lightning Fast for a very fast result', () => {
        component['applyPerformance'](5);

        expect(component.performanceLabel).toBe('Lightning Fast');
        expect(component.performanceRating).toBe(5);
    });

    // PERFORMANCE - NORMAL
    it('should show Normal for a time between 11 and 25 seconds', () => {
        component['applyPerformance'](20);

        expect(component.performanceLabel).toBe('Normal');
        expect(component.performanceMessage)
            .toBe('Solid performance. You’re good to go.');
        expect(component.performanceRating).toBe(3);
        expect(component.performanceColor).toBe('#4a7fd6');
    });

    it('should show Normal at exactly 25 seconds', () => {
        component['applyPerformance'](25);

        expect(component.performanceLabel).toBe('Normal');
        expect(component.performanceRating).toBe(3);
    });

    // PERFORMANCE - VERY SLOW
    it('should show Very Slow for a time above 25 seconds', () => {
        component['applyPerformance'](30);

        expect(component.performanceLabel).toBe('Very Slow');
        expect(component.performanceMessage)
            .toBe('Took your time — but the result counts.');
        expect(component.performanceRating).toBe(1);
        expect(component.performanceColor).toBe('#f44336');
    });

    // PERFORMANCE BOUNDARIES
    it('should use Lightning Fast at exactly 10 seconds', () => {
        component['applyPerformance'](10);

        expect(component.performanceLabel).toBe('Lightning Fast');
    });

    it('should use Normal at exactly 11 seconds', () => {
        component['applyPerformance'](11);

        expect(component.performanceLabel).toBe('Normal');
    });

    it('should use Very Slow at exactly 26 seconds', () => {
        component['applyPerformance'](26);

        expect(component.performanceLabel).toBe('Very Slow');
    });

    // TEMPLATE
    it('should display the congratulations title', () => {
        const title = fixture.nativeElement.querySelector(
            '.title'
        ) as HTMLElement;

        expect(title).toBeTruthy();
        expect(title.textContent?.trim()).toBe('Congratulations!');
    });

    it('should display the completion message', () => {
        const subtitle = fixture.nativeElement.querySelector(
            '.subtitle'
        ) as HTMLElement;

        expect(subtitle).toBeTruthy();
        expect(subtitle.textContent?.trim())
            .toBe('You have successfully completed the CAPTCHA.');
    });

    it('should display the performance label', () => {
        const badge = fixture.nativeElement.querySelector(
            '.performance-badge'
        ) as HTMLElement;

        expect(badge).toBeTruthy();
        expect(badge.textContent?.trim()).toBe('Lightning Fast');
    });

    it('should display the performance message', () => {
        const message = fixture.nativeElement.querySelector(
            '.message'
        ) as HTMLElement;

        expect(message).toBeTruthy();
        expect(message.textContent?.trim())
            .toBe('You solved it in record time!');
    });

    // STARS
    it('should display five rating stars', () => {
        const stars = fixture.nativeElement.querySelectorAll(
            '.rating mat-icon'
        );

        expect(stars.length).toBe(5);
    });

    it('should fill all five stars for a rating of 5', () => {
        const stars = fixture.nativeElement.querySelectorAll(
            '.rating mat-icon.filled'
        );

        expect(stars.length).toBe(5);
    });

    // HOME BUTTON
    it('should reset the state when going home', () => {
        component.goHome();

        expect(mockCaptchaStateService.resetState)
            .toHaveBeenCalled();
    });

    it('should navigate to home when going home', () => {
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        component.goHome();

        expect(navigateSpy)
            .toHaveBeenCalledWith(['/']);
    });

    // TRY AGAIN BUTTON
    it('should reset the state when trying again', () => {
        component.tryAgain();

        expect(mockCaptchaStateService.resetState)
            .toHaveBeenCalled();
    });

    it('should navigate to captcha when trying again', () => {
        const router = TestBed.inject(Router);
        const navigateSpy = vi.spyOn(router, 'navigate');

        component.tryAgain();

        expect(navigateSpy)
            .toHaveBeenCalledWith(['/captcha']);
    });

    // FOOTER
    it('should display the copyright text', () => {
        const footer = fixture.nativeElement.querySelector(
            '.footer-note'
        ) as HTMLElement;

        expect(footer).toBeTruthy();

        expect(footer.textContent?.trim())
            .toBe('© 2026 CAPTCHA-izahid — All rights reserved.');
    });
});