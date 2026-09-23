import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeComponent],
            providers: [
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;

        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the title', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        const heading = compiled.querySelector('h1');

        expect(heading?.textContent).toContain('Hello, Human!');
    });

    it('should have a link to the captcha page', () => {
        const button = fixture.nativeElement.querySelector('.captch-btn');

        expect(button).toBeTruthy();
        expect(button.getAttribute('routerLink')).toBe('/captcha');
    });

    it('should have the bot GIF', () => {
        const gif = fixture.nativeElement.querySelector('img[alt="Bot Image"]') as HTMLImageElement;

        expect(gif).toBeTruthy();
    });

    it('should have the link to my GITHUB', () => {
        const linktoGithub = fixture.nativeElement.querySelector('a[aria-label="Github"]') as HTMLAnchorElement;

        expect(linktoGithub).toBeTruthy();

        const myGithub = linktoGithub.getAttribute('href');

        expect(myGithub).toBe('https://github.com/EmanZHD');
    })

    it('should have the right footer', () => {
        const mifooter = fixture.nativeElement.querySelector('.footer-right') as HTMLElement;

        expect(mifooter).toBeTruthy();

        const micopyrightText = mifooter.textContent;

        expect(micopyrightText).toBe(' © 2026 CAPTCHA-izahid — All rights reserved. ');
    })
});