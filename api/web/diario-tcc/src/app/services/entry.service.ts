import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Entry } from '../models/entry.model';

@Injectable({ providedIn: 'root' })
export class EntryService {
  constructor(private http: HttpClient) {}

  /** Placeholder to save entry. Replace with API call when backend is ready. */
  save(entry: Entry): Observable<Entry> {
    // return this.http.post<Entry>('/api/entries', entry);
    return of(entry);
  }
}
