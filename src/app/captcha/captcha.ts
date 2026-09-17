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

    private readonly correctPositions: Record<string, number[]> = {
        palm: [1, 4, 6, 8],
        hydrant: [0, 5, 7],
        stair: [2, 3]
    };

    captchaState: CaptchaState;
    captchaImages: { src: string; alt: string }[];
    mathProblem: string = '';
    captchaType: string;
    captchaTypes = ['palm', 'hydrant', 'stair'];
    index = 0;
    verificationText: string = '';
    public selected = false;
    selectedImages: number[] = [];


    constructor(private captchaStateService: CaptchaStateService, private router: Router) {
        this.captchaState = this.captchaStateService.getState();
        this.captchaImages = this.captchaStateService.getImages();
        this.selectedImages = this.captchaState.answers.stage1;
        this.captchaType = this.getCaptchType();
        this.verificationText = this.captchaStateService.generateCaptchaText();
        this.mathProblem = this.handleMathCaptcha();
    }

    submitStage3() {
        const inputText = this.captchaState.answers.stage3.trim();

        if (inputText.length == 0) {
            alert(`ENter to continue.`);
            return;
        }
        if (this.verificationText !== inputText) {
            alert(`Not correct.`);
            return;
        } else {
            this.captchaState.completed = true;
            this.captchaStateService.resetState();

        }
    }


    getCaptchType(): string {
        if (this.captchaState.answers.stage1.length == 0) {
            if (this.index === 0) {
                this.captchaTypes.sort(() => Math.random() - 0.5);
            }
            this.captchaState.captchaType = this.captchaTypes[this.index++]
            return this.captchaState.captchaType;
        }
        return this.captchaState.captchaType;
    }

    isCaptchaCorrect(selected: number[]): boolean {
        const correct = this.correctPositions[this.captchaState.captchaType];

        return correct.length === selected.length &&
            correct.every(position => selected.includes(position));
    }

    get backMessage(): string {
        return this.captchaState.currentStage === 1 || this.captchaState.completed
            ? 'Back to Home'
            : `Back to Stage ${this.captchaState.currentStage - 1}`;
    }


    goBack() {
        console.log("STAGE => ", this.captchaState.currentStage);

        if (this.captchaState.currentStage === 2) {
            this.captchaState.currentStage = 1;
            if (!this.captchaState.answers.stage2) {
                this.captchaState.first = 0;
                this.captchaState.second = 0;
            }
        } else if (this.captchaState.currentStage === 3) {
            this.captchaState.currentStage = 2;
        } else {
            this.router.navigate(['/']);
            this.captchaStateService.resetState();
            // this.captchaState.currentStage = 1;
        }
    }

    submitStage1() {
        const stage = this.captchaState.currentStage;
        const selected = this.selectedImages;

        console.log("Submitting Captcha for Stage ->", stage);
        // console.log("Selected Images ->", selected);

        if (selected.length === 0) {
            this.captchaState.currentStage = 1;
            alert("Please select at least one image before proceeding.");
            return;
        }

        if (!this.isCaptchaCorrect(selected)) {
            this.captchaState.currentStage = 1;
            alert(`NOT CORRECT TRY TO SELECT JUST ${this.captchaState.captchaType} .`);
            return;
        }

        this.captchaStateService.setAnswers(stage, selected);
        this.captchaState.currentStage = 2;
        this.captchaState = this.captchaStateService.getState();
        if (!this.captchaState.answers.stage2) {
            console.log("HEEEEEEEEEEEEE-----------");

            this.mathProblem = this.handleMathCaptcha();
        }
        this.captchaStateService.saveState(this.captchaState);

        console.log(
            "New STATE ->", this.captchaState);
    }



    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    handleMathCaptcha(): string {
        if (!this.captchaState.answers.stage2) {
            this.captchaState.first = this.randomInt(1, 10);
            this.captchaState.second = this.randomInt(1, 10);
            this.mathProblem = `${this.captchaState.first} + ${this.captchaState.second} = ?`;
            return this.mathProblem;
        }
        console.log("CAPTCHA STAGE 2 --z> ", this.captchaState.answers.stage2?.length);

        return `${this.captchaState.first} + ${this.captchaState.second} = ?`;
    }

    submitStage2() {
        const stage = this.captchaState.currentStage;
        const mathAnswer = this.captchaState.answers.stage2;

        console.log("Submitting Captcha for Stage ->", stage);
        // console.log("Answer ->", mathAnswer);
        if (!mathAnswer) {
            alert("Please provide an answer before proceeding.");
            this.captchaState.currentStage = 2;
            this.captchaStateService.saveState(this.captchaState);
            return;
        }
        const result = this.captchaState.first + this.captchaState.second;
        console.log("RESULT -> ", result, mathAnswer);

        if (Number(mathAnswer) !== result) {
            alert("Try Agqin, not correct.");
            this.captchaState.answers.stage2 = '';
            this.captchaState.currentStage = 2;
            this.captchaStateService.saveState(this.captchaState);
            return;
        }

        this.captchaStateService.setAnswers(stage, mathAnswer);
        this.captchaState.currentStage = 3;
        this.captchaStateService.saveState(this.captchaState);

        console.log(
            "New STATE ->", this.captchaState);
    }


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