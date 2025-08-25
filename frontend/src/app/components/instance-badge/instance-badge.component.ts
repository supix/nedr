import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface AppConfig {
  instanceId: string;
  appName?: string;
}

@Component({
  selector: 'app-instance-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" *ngIf="config">FE instance: {{ config.instanceId }}</span>
  `
})
export class InstanceBadgeComponent implements OnInit {
  config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<AppConfig>('/assets/app-config.json').subscribe({
      next: (cfg) => (this.config = cfg),
      error: () => (this.config = { instanceId: 'unknown' })
    });
  }
}
