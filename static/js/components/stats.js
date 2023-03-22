class Stats {
  userId = document.querySelector('.userId').innerHTML
  scoreData = document.querySelector('.scoreData')
  incomeRatio = document.querySelector('.incomeRatio')
  savingsRatio = document.querySelector('.savingsRatio')
  runway = document.querySelector('.runway')
  liquidity = document.querySelector('.liquidity')
  networth = document.querySelector('.networth')
  wealth = document.querySelector('.wealth')
  loading = document.querySelector('.loading')
  display = document.querySelector('.stats .display')
  currencyFormatter = new Currency('en-US').formatter();

  constructor() {
    this.display.style.display = 'none';
    new API(undefined, undefined, undefined, `stats/${this.userId}`, undefined,
            undefined, this, this.populate);
  }

  populate(obj, data) {
    obj.scoreData.innerHTML = `&nbsp;${(data.score || 0.0).toFixed(1)}`;
    obj.incomeRatio.innerHTML = `&nbsp;${(data.income_ratio * 100).toFixed(1)}`;
    obj.savingsRatio.innerHTML = `&nbsp;${(data.savings_ratio * 100).toFixed(1)}`;
    obj.runway.innerHTML = `&nbsp;${data.runway.as_string}`; 
    obj.liquidity.innerHTML = `&nbsp;${(data.liquidity * 100).toFixed(1)}`;
    obj.networth.innerHTML = `&nbsp;${obj.currencyFormatter.format(data.networth)}`;
    obj.wealth.innerHTML = `&nbsp;${data.wealth.toFixed(5)}`;
    obj.loading.style.display = 'none';
    obj.display.style.display = 'flex';
  }
}

const stats = new Stats();
