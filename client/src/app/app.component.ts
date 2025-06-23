import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div style="padding: 20px;">
      <h1 style="text-align: center;">🎮 MOTUS V2</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MOTUS V2';
}
