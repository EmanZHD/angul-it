import { Injectable } from "@angular/core";
import { CaptchaState } from "../../models/captcha-state.interface";
import { MatDialog } from "@angular/material/dialog";
import { Popup } from "../../popup/popup";

@Injectable({
    providedIn: 'root'
})

export class CaptchaGeneratorService {
    constructor(private dialog: MatDialog,
    ) { }
    generateMathNumbers(state: CaptchaState) {
        if (!state.stages.stage2.response) {
            state.stages.stage2.data.first = this.randomInt(1, 10);
            state.stages.stage2.data.second = this.randomInt(1, 10);
            state.stages.stage2.expected = state.stages.stage2.data.first + state.stages.stage2.data.second;
            return `${state.stages.stage2.data.first} + ${state.stages.stage2.data.second} = ?`;
        }
        return `${state.stages.stage2.data.first} + ${state.stages.stage2.data.second} = ?`;
    }

    generateCaptchaText(state: CaptchaState): string {
        if (!state.stages.satge3.expected || state.stages.satge3.response.length === 0) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            state.stages.satge3.expected = Array.from({ length: 8 }, () =>
                chars[Math.floor(Math.random() * chars.length)]
            ).join('');
        }
        return state.stages.satge3.expected;
    }

    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    openErrorPOpup(error: string) {
        const dialogREf = this.dialog.open(Popup, {
            panelClass: 'captcha-dialog'
        });

        dialogREf.componentInstance.errMessage = error;
    }
}