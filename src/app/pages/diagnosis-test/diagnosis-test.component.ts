import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diagnosis-test',
  standalone: true,
  template: '<div class="page-container"><h1>Test Diagnostic</h1></div>',
  styles: ['.page-container { padding: 20px; }']
})
export class DiagnosisTestComponent {
  constructor(private route: ActivatedRoute) {}
}
