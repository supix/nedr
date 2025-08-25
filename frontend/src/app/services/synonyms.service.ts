import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SynonymResponse {
  query: string;
  count: number;
  terms: string[];
  synonyms: string[];
  tookMs: number;
}

@Injectable({ providedIn: 'root' })
export class SynonymsService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<SynonymResponse> {
    const params = { query };
    return this.http.get<SynonymResponse>('/api/synonyms', { params });
  }

  download(): void {
    // Simple direct navigation to trigger browser download
    window.location.href = '/api/download';
  }
}
