import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDialogModule
} from '@angular/material/dialog';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.html',
    styleUrl: "./popup.scss",

    imports: [
        MatDialogModule,
        MatButtonModule
    ]
})
export class Popup {
    errMessage = '';
}