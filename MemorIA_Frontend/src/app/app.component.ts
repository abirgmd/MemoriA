import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarDiagnosticComponent } from './components/sidebar_diagnostic/sidebar_diagnostic.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarDiagnosticComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MemorIA_Frontend';
  showSidebar = false;

  private noSidebarRoutes = ['/', '/home', '/login'];

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEnd = event as NavigationEnd;
      const url = navEnd.urlAfterRedirects || navEnd.url;
      this.showSidebar = this.authService.isLoggedIn() && !this.noSidebarRoutes.includes(url);
    });
  }
}
