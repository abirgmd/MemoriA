import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page-container not-found">
      <h1>404 - Page Not Found</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <a routerLink="/">Retour à l'accueil</a>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
    }
    a {
      color: #667eea;
      text-decoration: none;
      margin-top: 20px;
      padding: 8px 16px;
      border: 1px solid #667eea;
      border-radius: 4px;
    }
    a:hover {
      background-color: #667eea;
      color: white;
    }
  `]
})
export class NotFoundComponent {}
