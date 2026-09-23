import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Popup } from './popup';

describe('Popup', () => {
    let component: Popup;
    let fixture: ComponentFixture<Popup>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Popup]
        }).compileComponents();

        fixture = TestBed.createComponent(Popup);
        component = fixture.componentInstance;

        component.errMessage = 'Please select at least one image.';

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the CAPTCHA Failed title', () => {
        const title = fixture.nativeElement.querySelector(
            '.dialog-title'
        );

        expect(title).toBeTruthy();
        expect(title.textContent.trim()).toBe('CAPTCHA Failed');
    });

    it('should display the error message', () => {
        const content = fixture.nativeElement.querySelector(
            '.dialog-content'
        );

        expect(content).toBeTruthy();
        expect(content.textContent.trim()).toBe(
            'Please select at least one image.'
        );
    });

    it('should have a Try Again button', () => {
        const button = fixture.nativeElement.querySelector(
            '.dialog-button'
        );

        expect(button).toBeTruthy();
        expect(button.textContent.trim()).toBe('Try Again');
    });
});