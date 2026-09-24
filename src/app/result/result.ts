import { Component, OnInit } from "@angular/core";
import { CaptchaStateService } from "../core/service/captcha-state.service";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from "@angular/router";
import { CaptchaState } from "../models/captcha-state.interface";
import { CaptchaStorageSErvice } from "../core/service/captcha-storage.service";

@Component({
    selector: "app-result",
    templateUrl: "./result.html",
    styleUrl: "./result.scss",
    imports: [
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule
    ]
})

export class ResultComponent implements OnInit {
    performanceLabel = "";
    performanceMessage = "";
    performanceRating = 0;
    performanceColor = "";
    // captchaState: CaptchaState;
    formattedTine: string = '';
    get captchaState(): CaptchaState {
        return this.captchaStateService.getState();
    }
    constructor(private captchaStateService: CaptchaStateService,
        private router: Router) {
        // this.captchaState = this.captchaStateService.getState();
    }

    private timeToSeconds(time: string): number {
        const [minutes, seconds] = time.split(':').map(Number);
        return minutes * 60 + seconds;
    }


    ngOnInit() {
        this.formattedTine = this.captchaState.crono.time;
        // console.log("TIME --> ", this.formattedTine, " AND ", this.timeToSeconds(s.crono.time));

        this.applyPerformance(Math.floor(this.timeToSeconds(this.captchaState.crono.time)));

        this.captchaStateService.resetState();
    }

    goHome() {
        this.captchaStateService.resetState();
        this.router.navigate(['/']);
    }

    tryAgain() {
        this.captchaStateService.resetState();
        this.router.navigate(['/captcha']);
    }

    private applyPerformance(seconds: number): void {
        if (seconds <= 10) {
            this.performanceLabel = 'Lightning Fast';
            this.performanceMessage = 'You solved it in record time!';
            this.performanceRating = 5;
            this.performanceColor = '#4caf50';
        } else if (seconds <= 25) {
            this.performanceLabel = 'Normal';
            this.performanceMessage = 'Solid performance. You’re good to go.';
            this.performanceRating = 3;
            this.performanceColor = '#4a7fd6';
        } else {
            this.performanceLabel = 'Very Slow';
            this.performanceMessage = 'Took your time — but the result counts.';
            this.performanceRating = 1;
            this.performanceColor = '#f44336';
        }
    }
}