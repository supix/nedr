import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [NgIf, NgFor, CardModule, ChipModule, ProgressSpinnerModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  @Input() loading = false;
  @Input() query = '';
  @Input() terms: string[] = [];
  @Input() synonyms: string[] = [];
}
