import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  query = '';

  @Output() search = new EventEmitter<string>();

  onSubmit() {
    const q = this.query.trim();
    if (q.length === 0) return;
    this.search.emit(q);
  }
}
