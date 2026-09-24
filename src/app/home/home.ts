import { Component, OnInit } from "@angular/core";
import { signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CaptchaStateService } from "../core/service/captcha-state.service";

@Component({
    imports: [RouterLink],
    selector: "home-component",
    templateUrl: "./home.html",
    styleUrl: "./home.scss"
})

export class HomeComponent implements OnInit {
    protected readonly title = signal('Human!');
    constructor(private stateService: CaptchaStateService) { }
    ngOnInit(): void {
        this.stateService.resetState();
    }
}