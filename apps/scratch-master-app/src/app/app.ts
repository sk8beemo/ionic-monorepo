import { Component } from '@angular/core';

/* eslint-disable @angular-eslint/prefer-standalone */
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
/* eslint-enable @angular-eslint/prefer-standalone */
export class App {
  protected title = 'scratch-master-app';
}
