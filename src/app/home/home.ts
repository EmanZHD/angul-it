import { Component } from "@angular/core";
import { signal } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    imports: [RouterLink],
    selector: "home-component",
    templateUrl: "./home.html",
    styleUrl: "./home.scss"
})

export class HomeComponent {
    protected readonly title = signal('Human!');
}