import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchFocusService {
  focus$ = new Subject<void>();

  triggerFocus() {
    this.focus$.next();
  }
}
