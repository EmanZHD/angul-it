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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { Popup } from "../popup/popup";
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



    captchaState: CaptchaState;

    captchaImages: { src: string; alt: string }[];
    mathProblem: string = '';
    captchaType: string;
    captchaTypes = ['palm', 'hydrant', 'stair'];
    index = 0;
    verificationText: string = '';
    public selected = false;
    selectedImages: number[] = [];
    formattedTime: string = '00:00';
    private clockInterval: any;

    constructor(private captchaStateService: CaptchaStateService,
        private router: Router,
        private dialog: MatDialog, private cdr: ChangeDetectorRef) {
        this.captchaState = this.captchaStateService.getState();

        this.captchaImages = this.captchaStateService.getImages();

        //firstStage
        this.selectedImages = this.captchaState.stages.stage1.expected;
        this.captchaState.stages.stage1.expected = this.captchaStateService.correctPositions[this.captchaState.stages.stage1.imageType]
        this.captchaType = this.getCaptchType();
        this.verificationText = this.captchaStateService.generateCaptchaText();
        this.mathProblem = this.handleMathCaptcha();
        this.formattedTime = this.captchaState.crono.time;
    }


    ngOnInit(): void {
        this.captchaStateService.startCrono();

        this.clockInterval = setInterval(() => {
            this.formattedTime = this.captchaState.crono.time;
            this.cdr.detectChanges();
        }, 1000);
    }

    submitStage3() {
        const inputText = this.captchaState.stages.satge3.response.trim();

        if (inputText.length == 0) {
            this.openErrorPOpup("ENter to continue.");
            return;
        }
        if (this.verificationText !== inputText) {
            this.openErrorPOpup("NOt correct");
            return;
        } else {
            const state = this.captchaStateService.getState();
            state.completed = true;
            this.captchaStateService.stopCrono();
            this.captchaStateService.saveState(state);
            this.router.navigate(["/result"]);
        }
    }

    openErrorPOpup(error: string) {
        const dialogREf = this.dialog.open(Popup, {
            panelClass: 'captcha-dialog'
        });

        dialogREf.componentInstance.errMessage = error;
    }

    getCaptchType(): string {
        if (this.captchaState.stages.stage1.selectedImages.length == 0) {
            if (this.index === 0) {
                this.captchaTypes.sort(() => Math.random() - 0.5);
            }
            this.captchaState.stages.stage1.imageType = this.captchaTypes[this.index++]
            return this.captchaState.stages.stage1.imageType;
        }
        return this.captchaState.stages.stage1.imageType;
    }

    // isCaptchaCorrect(selected: number[]): boolean {
    //     const correct = this.correctPositions[this.captchaState.stages.stage1.imageType];

    //     return correct.length === selected.length &&
    //         correct.every(position => selected.includes(position));
    // }

    get backMessage(): string {
        return this.captchaState.currentStage === 1 || this.captchaState.completed
            ? 'Back to Home'
            : `Previous Stage - ${this.captchaState.currentStage - 1}`;
    }


    goBack() {
        // console.log("STAGE => ", this.captchaState.currentStage);

        // if (this.captchaState.currentStage === 2) {
        //     this.captchaState.currentStage = 1;
        //     if (!this.captchaState.answers.stage2) {
        //         this.captchaState.first = 0;
        //         this.captchaState.second = 0;
        //     }
        // } else if (this.captchaState.currentStage === 3) {
        //     this.captchaState.currentStage = 2;
        // } else {
        //     this.router.navigate(['/']);
        //     this.captchaStateService.resetState();            // this.captchaState.currentStage = 1;
        // }
    }

    NextStage() {
        // if (this.captchaState.currentStage == 1) {
        //     if (!this.isMathCaptchaCorrect()) {
        //         this.captchaState.currentStage = 2;
        //         return
        //     }
        // }
        // if (this.captchaState.currentStage == 2) {
        //     if (this.isCaptchaCorrect(this.selectedImages)) {
        //         this.captchaState.currentStage = 3;
        //         return
        //     }
        // }
        return false
    }

    submitStage1() {
        // this.captchaState.stages.stage1.resolved = false;

        // if (this.selectedImages.length === 0) {
        //     this.captchaState.currentStage = 1;
        //     this.openErrorPOpup("Please select at least one image before proceeding.");
        //     return;
        // }

        // if (this.selectedImages.length !== this.captchaState.stages.stage1.expected.length &&
        //     this.captchaState.stages.stage1.expected.every(position => this.selectedImages.includes(position))
        // ) {
        //     this.captchaState.currentStage = 1;
        //     this.openErrorPOpup(`Not correct try to select just ${this.captchaState.stages.stage1.imageType.toLocaleUpperCase()} .`);
        //     return;
        // }

        // // this.captchaStateService.setAnswers(stage, selected);
        // this.captchaState.stages.stage1.selectedImages = this.selectedImages;
        // this.captchaState.stages.stage1.resolved = true;
        // this.captchaStateService.getState();
        // this.captchaState.currentStage = 2;

        // if (!this.captchaState.stages.stage2.resolved) {
        //     this.mathProblem = this.handleMathCaptcha();
        // }

        // this.captchaStateService.saveState(this.captchaState);
    }



    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    handleMathCaptcha(): string {
        if (!this.captchaState.stages.stage2.expected) {
            this.captchaState.stages.stage2.data.first = this.randomInt(1, 10);
            this.captchaState.stages.stage2.data.second = this.randomInt(1, 10);
            this.mathProblem = `${this.captchaState.stages.stage2.data.first} + ${this.captchaState.stages.stage2.data.second} = ?`;
            this.captchaState.stages.stage2.expected = this.captchaState.stages.stage2.data.first + this.captchaState.stages.stage2.data.second;
            return this.mathProblem;
        }
        // console.log("CAPTCHA STAGE 2 --z> ", this.captchaState.answers.stage2?.length);

        return `${this.captchaState.stages.stage2.data.first} + ${this.captchaState.stages.stage2.data.second} = ?`;
    }

    submitStage2() {
        const stage = this.captchaState.currentStage;
        const mathAnswer = this.captchaState.stages.stage2.response;

        console.log("Submitting Captcha for Stage ->", stage);
        // console.log("Answer ->", mathAnswer);
        if (!mathAnswer) {
            this.openErrorPOpup("Please provide an answer before proceeding.");

            this.captchaState.currentStage = 2;
            this.captchaStateService.saveState(this.captchaState);
            return;
        }
        // const result = this.captchaState.first + this.captchaState.second;
        // console.log("RESULT -> ", result, mathAnswer);

        if (this.captchaState.stages.stage2.expected !== mathAnswer) {
            this.openErrorPOpup("Try Agqin, not correct.");
            this.captchaState.stages.stage2.response = +'';
            this.captchaState.currentStage = 2;
            this.captchaStateService.saveState(this.captchaState);
            return;
        }

        // this.captchaStateService.setAnswers(stage, mathAnswer);
        this.captchaState.stages.stage2.response = mathAnswer;
        this.captchaState.currentStage = 3;
        this.captchaStateService.saveState(this.captchaState);
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