import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SynonymsService, SynonymResponse } from './services/synonyms.service';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { InstanceBadgeComponent } from './components/instance-badge/instance-badge.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ToastModule, SearchComponent, ResultsComponent, InstanceBadgeComponent],
  template: `
    <p-toast></p-toast>
    <header class="navbar">
      <div class="nav-title">NEDR POC</div>
      <div class="flex align-items-center gap-2">
        <button class="p-button p-button-sm p-button-outlined" (click)="onDownload()">Download file</button>
        <app-instance-badge></app-instance-badge>
      </div>
    </header>

    <section class="hero">
      <img src="assets/wallpaper.jpg" alt="" class="hero-bg" loading="lazy" />
      <div class="hero-content">
        <div class="text-center mb-3">
          <h2>Cerca sinonimi</h2>
          <p class="mt-1">Digita una parola e premi Cerca</p>
        </div>
        <app-search (search)="onSearch($event)"></app-search>
      </div>
    </section>

    <main class="p-3">
      <app-results [loading]="loading" [query]="lastQuery" [terms]="terms" [synonyms]="synonyms"></app-results>
    </main>
  `
})
export class AppComponent {
  loading = false;
  lastQuery = '';
  terms: string[] = [];
  synonyms: string[] = [];

  constructor(private api: SynonymsService, private messages: MessageService) {}

  onSearch(q: string) {
    this.loading = true;
    this.lastQuery = q;
    this.api.search(q).subscribe({
      next: (res: SynonymResponse) => {
        this.terms = res.terms;
        this.synonyms = res.synonyms;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messages.add({ severity: 'error', summary: 'Errore', detail: err?.error?.error || 'Richiesta fallita' });
      }
    });
  }

  onDownload() {
    this.api.download();
  }
}
