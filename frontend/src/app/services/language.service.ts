import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private langSubject = new BehaviorSubject<'en' | 'ru'>(
    (localStorage.getItem('lang') as 'en' | 'ru') || 'en'
  );

  lang$ = this.langSubject.asObservable();

  get currentLang() {
    return this.langSubject.value;
  }

  setLang(lang: 'en' | 'ru') {
    this.langSubject.next(lang);
    localStorage.setItem('lang', lang);
  }
}