import { Component } from "@angular/core";

@Component({
    selector: "app-captcha",
    templateUrl: "./captcha.html",
    styleUrl: "./captcha.scss"
})
export class CaptchaComponent {
    images = [
        { src: "images/captcha/hydrant00.jpg", alt: "Image 1" },
        { src: "images/captcha/palm00.jpg", alt: "Image 2" },
        { src: "images/captcha/stair.png", alt: "Image 5" },
        { src: "images/captcha/stair00.png", alt: "Image 6" },
        { src: "images/captcha/palm02.jpg", alt: "Image 7" },
        { src: "images/captcha/hydrant02.jpg", alt: "Image 4" },
        { src: "images/captcha/palm03.jpg", alt: "Image 9" },
        { src: "images/captcha/hydrant01.jpg", alt: "Image 3" },
        { src: "images/captcha/palm01.jpg", alt: "Image 8" }
    ];

    selectedImages = new Set<number>();

    submitCaptcha() { }
    public selected = false;
}