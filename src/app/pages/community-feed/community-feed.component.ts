import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-community-feed',
  standalone: true,
  template: '<div class="page-container"><h1>Fil de la Communauté</h1></div>',
  styles: ['.page-container { padding: 20px; }']
})
export class CommunityFeedComponent {
  constructor(private route: ActivatedRoute) {}
}
