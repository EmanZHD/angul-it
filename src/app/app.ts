import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CaptchaStateService } from './core/service/captcha-state.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})

export class App {
  constructor(private router: Router, private captchaStateService: CaptchaStateService) { }

  // ngOnInit(): void {
  //   // this.captchaStateService.resetState();
  // }
}
