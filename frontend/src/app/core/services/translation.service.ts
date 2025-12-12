import { Injectable } from '@angular/core';
import translations from '../../../assets/i18n/translation.json';

type Lang = 'de' | 'en';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLang: Lang = 'de';
  private dict: any = translations;

  setLang(lang: Lang) {
    this.currentLang = lang;
  }

  t(key: string): string {
    return this.dict[key]?.[this.currentLang] ?? key;
  }

  getLang(): Lang {
    return this.currentLang;
  }
}

