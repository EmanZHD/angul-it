import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CaptchaStateService } from "../core/service/captcha-state.service";
import { CaptchaState } from "../models/captcha-state.interface";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { CaptchaStorageSErvice } from "../core/service/captcha-storage.service";
import { CaptchaGeneratorService } from "../core/service/captcha-generator.service";
import { CaptchaTimerService } from "../core/service/captcha-timer.service";
@Component({
    selector: "app-captcha",
    templateUrl: "./captcha.html",
    styleUrl: "./captcha.scss",
    imports: [FormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule]
})

export class CaptchaComponent implements OnInit {
    get captchaState(): CaptchaState {
        return this.captchaStateService.getState();
    }

    captchaImages: { src: string; alt: string }[];
    mathProblem: string = '';
    captchaType: string;
    index = 0;
    verificationText: string = '';
    formattedTime: string = '00:00';
    private clockInterval: any;
    progressPercent: number = 40;

    constructor(private captchaStateService: CaptchaStateService,
        private captchaStotage: CaptchaStorageSErvice,
        private captchaGeneraor: CaptchaGeneratorService,
        private captchaTimer: CaptchaTimerService,
        private router: Router,
        private cdr: ChangeDetectorRef) {

        this.captchaImages = this.captchaStotage.getImages();
        this.captchaType = this.captchaStateService.getCaptchType();
        this.formattedTime = this.captchaState.crono.time;
        this.mathProblem =
            this.captchaGeneraor.generateMathNumbers(this.captchaState);
    }

    ngOnInit(): void {
        this.verificationText = this.captchaGeneraor.generateCaptchaText(this.captchaState);
        this.captchaTimer.startCrono(this.captchaState);

        this.clockInterval = setInterval(() => {
            this.formattedTime = this.captchaState.crono.time;
            this.cdr.detectChanges();
        }, 1000);
    }

    submitStage1() {
        const result: string | null = this.captchaStateService.handleCaptchaIMages();
        console.log("RESULT OF 1 CHALLENGE > ", result);

        if (result !== null) {
            this.captchaGeneraor.openErrorPOpup(result);
            return;
        }
    }


    submitStage2() {
        const result: string | null = this.captchaStateService.handleMathCaptcha();
        if (result !== null) {
            this.captchaGeneraor.openErrorPOpup(result);
            return;
        }
    }


    submitStage3() {
        const result: string | null = this.captchaStateService.handleTextCaptcha();
        if (result !== null) {
            this.captchaGeneraor.openErrorPOpup(result);
            return;
        }
    }

    get backMessage(): string {
        return this.captchaState.currentStage === 1 || this.captchaState.completed
            ? 'To Home'
            : `Stage - ${this.captchaState.currentStage - 1}`;
    }


    goBack() {
        if (this.captchaState.currentStage === 3) {
            this.captchaState.currentStage = 2;
            return;
        }

        if (this.captchaState.currentStage === 2) {
            this.captchaState.currentStage = 1;
            return;
        }

        this.router.navigate(['/']);
        this.captchaStateService.resetState();
    }

    get canGoNext(): boolean {
        const s = this.captchaState;
        if (s.completed) return false;
        if (s.currentStage === 1) return s.stages.stage1.resolved;
        if (s.currentStage === 2) return s.stages.stage2.resolved;
        return false;
    }

    NextStage(): void {
        const s = this.captchaState;

        if (s.currentStage === 1 && s.stages.stage1.resolved) {
            s.currentStage = 2;
            this.captchaStotage.saveState(s);
            return;
        }
        if (s.currentStage === 2 && s.stages.stage2.resolved) {
            s.currentStage = 3;
            this.captchaStotage.saveState(s);
            return;
        }

        if (s.currentStage === 3 && s.stages.satge3.resolved) {
            s.completed = true;
            this.captchaStotage.saveState(s);
        }
    }

    toggleImage(index: number): void {
        this.captchaStateService.toggleImage(index);
    }

    isImageSelected(index: number): boolean {
        return this.captchaStateService.isImageSelected(index);
    }
}