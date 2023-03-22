class Currency {
  currencyMap = {
    'en-US': 'USD',
    'fr-FR': 'EUR',
    'zh-TW': 'TWD'
  }

  constructor(locale) { this.locale = locale; }

  formatter() {
    return new Intl.NumberFormat(this.locale, {style: 'currency', currency: this.currencyMap[this.locale]});
  }
}
