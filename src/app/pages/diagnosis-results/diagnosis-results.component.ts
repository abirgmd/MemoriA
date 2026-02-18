import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diagnosis-results',
  standalone: true,
  template: '<div class="page-container"><h1>Résultats Diagnostic</h1></div>',
  styles: ['.page-container { padding: 20px; }']
})
export class DiagnosisResultsComponent {
  constructor(private route: ActivatedRoute) {}
}
