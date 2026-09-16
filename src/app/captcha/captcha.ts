import { Component } from "@angular/core";
import { CaptchaStateService } from "../core/service/captcha-state.service";
import { CaptchaState } from "../models/captcha-state.interface";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: "app-captcha",
    templateUrl: "./captcha.html",
    styleUrl: "./captcha.scss",
    imports: [FormsModule]
})
export class CaptchaComponent {

    captchaState: CaptchaState;
    captchaImages: { src: string; alt: string }[];
    constructor(private captchaStateService: CaptchaStateService, private router: Router) {
        this.captchaState = this.captchaStateService.getState();
        this.captchaImages = this.captchaStateService.getImages();
        this.selectedImages = this.captchaState.answers.stage1;
        // console.log("Initial Captcha State ->", this.captchaState.selectedImages);
    }

    get backMessage(): string {
        return this.captchaState.currentStage === 1
            ? 'Back to Home'
            : `Back to Stage ${this.captchaState.currentStage - 1}`;
    }

    mathProblem: string = "2 + 2 = ?";

    goBack() {
        if (this.captchaState.currentStage === 2) {
            this.captchaState.currentStage = 1;
        } else if (this.captchaState.currentStage === 3) {
            this.captchaState.currentStage = 2;
        } else {
            this.router.navigate(['/']);
            this.captchaStateService.resetState();
        }
    }

    selectedImages: number[] = [];
    submitCaptcha() {
        const stage = this.captchaState.currentStage;
        const selected = this.selectedImages;

        console.log("Submitting Captcha for Stage ->", stage);
        // console.log("Selected Images ->", selected);

        this.captchaStateService.setAnswers(stage, selected);
        this.captchaStateService.nextStage();

        this.captchaState = this.captchaStateService.getState();
        this.captchaStateService.saveState(this.captchaState);

        console.log(
            "New STATE ->", this.captchaState);
    }

    public selected = false;

    toggleImage(index: number) {
        const indexInArray = this.selectedImages.indexOf(index);
        if (indexInArray !== -1) {
            this.selectedImages.splice(indexInArray, 1);
        } else {
            this.selectedImages.push(index);
        }
        console.log("SELECTED POSITION -> ", this.selectedImages);
    }
}