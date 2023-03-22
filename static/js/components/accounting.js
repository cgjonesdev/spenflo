class Accounts extends CRUD {
  attributes = {
    id: {element: 'input', name: '_id', type: 'text', label: 'ID',
      display: 'none', refName: 'id'},
    name: {element: 'input', name: 'name', type: 'text', required: true,
      label: 'Name', display: 'block', refName: 'name'},
    accountNumber: {
      element: 'input',
      name: 'account_number',
      type: 'text',
      required: false,
      label: 'Account Number',
      display: 'block',
      refName: 'accountNumber'},
    kind: {
      element: 'select',
      name: 'kind',
      options: {
        checking: 'Checking',
        savings: 'Savings',
        investment: 'Investment',
        'credit card': 'Credit Card',
        'line of credit': 'Line of Credit',
	'cash card': 'Cash Card',
        cash: 'Cash',
        'transit': 'Transit Card'},
      required: true,
      label: 'Type',
      display: 'block',
      refName: 'kind'},
    limit: {element: 'input', name: 'limit', type: 'text', required: false,
      label: 'Limit', display: 'none', refName: 'limit'},
    notes: {element: 'input', name: 'notes', type: 'text', required: false,
      label: 'Notes', display: 'block', refName: 'notes'},
    isActive: {
      element: 'select',
      name: 'is_active',
      options: {
        true: 'Yes',
        false: 'No'},
      required: true,
      label: 'Is this account active?',
      display: 'block',
      refName: 'isActive'}
  }
  requiredDeleteFields = ['_id']

  constructor() {
    super();
    this.buildForm();
    this.kindSelector = Array.from(this.form.children).filter(item => item.name == 'kind')[0];
    this.kindSelector.addEventListener('change', e => this.handleKindSelector(e));
    this.kindSelector.selectedIndex = -1;
    this.limitLabel = Array.from(this.form.children).filter(item => item.innerHTML == 'Limit')[0];
    this.limitInput = Array.from(this.form.children).filter(item => item.name == 'limit')[0];
  }

  buildForm() {
    super.buildForm();
    this.form.method = 'POST';
    this.form.action = '/app/accounting/accounts';
    this.deleteForm.method = 'POST';
    this.deleteForm.action = '/app/accounting/accounts';
  }

  handleKindSelector(event) {
    let selectedValue = this.kindSelector.options[this.kindSelector.selectedIndex].value;
    if (['credit card', 'line of credit'].includes(selectedValue)) {
      this.limitLabel.style.display = 'block';
      this.limitInput.style.display = 'block';
    }
    else {
      this.limitLabel.style.display = 'none';
      this.limitInput.style.display = 'none';
    }
  }

  expandTransactions(url) {
    location.href = url;
  }
}

class AccountsModal extends CrudModal { }

class Transactions extends CRUD {
  attributes = {
    id: {element: 'input', name: '_id', type: 'text', label: 'ID', display: 'none', refName: 'id'},
    account_id: {element: 'input', name: 'account_id', type: 'text', label: 'Account Id', display: 'none', refName: 'account_id'},
    name: {element: 'input', name: 'name', type: 'text', required: true, label: 'Name', display: 'block', refName: 'name'},
    fromAccount: {
      element: 'select',
      name: 'from_account',
      options: {},
      required: false,
      label: 'From Account',
      display: 'none',
      refName: 'fromAccount'},
    toAccount: {
      element: 'select',
      name: 'to_account',
      options: {},
      required: false,
      label: 'To Account',
      display: 'none',
      refName: 'toAccount'},
    fromAmount: {element: 'input', name: 'from_amount', type: 'text',
                 required: false, label: 'From Amount', display: 'none',
                 refName: 'fromAmount'},
    amount: {element: 'input', name: 'amount', type: 'text', required: true,
             label: 'Amount', display: 'block', refName: 'amount'},
    date: {element: 'input', name: 'date', type: 'date', required: true,
           label: 'Date', display: 'block', refName: 'date'},
    instrument: {
      element: 'select',
      name: 'instrument',
      options: {
        card: 'Card',
        cash: 'Cash',
        'direct deposit': 'Direct Deposit',
        eft: 'EFT',
        ach: 'ACH',
        zelle: 'Zelle',
        venmo: 'Venmo',
        online: 'Online'
      },
      required: true,
      label: 'Instrument',
      display: 'block',
      refName: 'instrument'},
    kind: {
      element: 'select',
      name: 'kind',
      options: {
        income: 'Income',
        expense: 'Expense',
        savings: 'Savings',
        spending: 'Spending',
        investment: 'Investment',
        transfer: 'Transfer',
        gift: 'Gift',
        emergency: 'Emergency'
      },
      required: true,
      label: 'Type',
      display: 'block',
      refName: 'kind'},
    category: {
      element: 'select',
      name: 'category',
      options: {
        housing: 'Housing',
        food: 'Food',
	clothing: 'Clothing',
        communication: 'Communication',
        groceries: 'Groceries',
        fuel: 'Fuel',
        snacks: 'Snacks',
        drinks: 'Drinks',
        entertainment: 'Entertainment',
        health: 'Health',
        fitness: 'Fitness',
        hygiene: 'Hygiene',
        household: 'Household',
        recreation: 'Recreation',
        travel: 'Travel',
        transportation: 'Transportation',
        gifts: 'Gifts',
        income: 'Income',
        expense: 'Expense',
        investment: 'Investment',
        finance: 'Finance',
        insurance: 'Insurance',
        legal: 'Legal',
        business: 'Business',
        misc: 'Misc'
      },
      required: true,
      label: 'Category',
      display: 'block',
      refName: 'category'},
    memo: {element: 'input', name: 'memo', type: 'text', required: false, label: 'Memo', display: 'block'},
  }
  requiredDeleteFields = ['_id', 'account_id']

  constructor() {
    super();
    this.buildForm();
    const amount = Array.from(this.form.children).filter(child => child.refName == 'amount')[0];
    const fromAmount = Array.from(this.form.children).filter(child => child.refName == 'fromAmount')[0];
    this.testForNonNumberKey(amount);
    this.testForNonNumberKey(fromAmount);
    this.instrumentSelector = Array.from(this.form.children).filter(item => item.name == 'instrument')[0]
    this.kindSelector = Array.from(this.form.children).filter(item => item.name == 'kind')[0]
    this.kindSelector.selectedIndex = -1;
    this.kindSelector.addEventListener('change', e => this.handleKindSelector(e));
    this.categorySelector = Array.from(this.form.children).filter(item => item.name == 'category')[0]
    this.instrumentSelector.selectedIndex = -1;
    this.categorySelector.selectedIndex = -1;
  }

  buildForm() {
    super.buildForm();
    this.form.method = 'POST';
    this.deleteForm.method = 'POST';
    try {
      const accountId = document.querySelector('.accountId').innerHTML;
      this.form.action = `/app/accounting/transactions/${accountId}`;
      this.deleteForm.action = `/app/accounting/transactions/${accountId}`;
      const formAccountIdInput = Array.from(this.form.children).filter(item => item.name == 'account_id')[0];
      formAccountIdInput.value = accountId;;
      const deleteFormAccountIdInput = Array.from(this.form.children).filter(item => item.name == 'account_id')[0];
      deleteFormAccountIdInput.value = accountId;
    }
    catch (err) {}
    this.form.onsubmit = e => {
      e.preventDefault();
      [...this.form].forEach(item => {
        console.log(`${item.name}: ${item.value}`)
      });
      this.form.submit();
    }
  }

  buildCreateForm(data) {
    super.buildCreateForm(data);
    const formDateInput = Array.from(this.form.children).filter(item => item.name == 'date')[0];
    formDateInput.valueAsDate = this.today;
    this.form.onsubmit = e => {
      e.preventDefault();
      if (['spending', 'expense', 'emergency'].includes(this.form.kind.value)) {
        this.form.amount.value = parseFloat(Math.abs(this.form.amount.value) * -1);
      }
      this.form.submit();
    }
  }

  handleKindSelector(event) {
    const fromAccountLabel  = Array.from(this.form.children).filter(item => item.innerHTML == 'From Account')[0];
    const fromAccountSelector  = Array.from(this.form.children).filter(item => item.name == 'from_account')[0];
    const fromAmountLabel  = Array.from(this.form.children).filter(item => item.innerHTML == 'From Amount')[0];
    const fromAmountField  = Array.from(this.form.children).filter(item => item.name == 'from_amount')[0];
    let toAmountLabel = null;
    toAmountLabel = Array.from(this.form.children).filter(item => item.innerHTML == 'Amount')[0];
    if (!toAmountLabel) { toAmountLabel = Array.from(this.form.children).filter(item => item.innerHTML == 'To Amount')[0]; }
    const toAmountField  = Array.from(this.form.children).filter(item => item.name == 'amount')[0];
    const toAccountLabel  = Array.from(this.form.children).filter(item => item.innerHTML == 'To Account')[0];
    const toAccountSelector  = Array.from(this.form.children).filter(item => item.name == 'to_account')[0];
    const categorySelector  = Array.from(this.form.children).filter(item => item.name == 'category')[0];

    const accountNames = [];
    this.extraData.map(item => accountNames.push(item));
    accountNames.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    accountNames.forEach(item => {
      let option = document.createElement('option');
      option.value = item._id;
      option.innerHTML = item.name;
      fromAccountSelector.appendChild(option);
    });
    accountNames.forEach(item => {
      let option = document.createElement('option');
      option.value = item._id;
      option.innerHTML = item.name;
      toAccountSelector.appendChild(option);
    });

    let selectedValue = this.kindSelector.options[this.kindSelector.selectedIndex].value;
    if (selectedValue == 'transfer') {
      fromAccountLabel.style.display = 'block';
      fromAccountSelector.style.display = 'block';
      fromAccountSelector.selectedIndex = -1;
      fromAccountSelector.required = true;
      fromAccountSelector.focus();
      const url = location.href.split('/');
      const accountId = url[url.length-1];
      fromAccountSelector.style.outline = '2px solid #08f';
      fromAccountSelector.value = this.extraData.filter(item => item._id == accountId)[0]._id;
      fromAccountSelector.onchange = e => {
        fromAccountSelector.style.outline = 'none';
        toAccountSelector.focus();
        toAccountSelector.style.outline = '2px solid #08f';
      }
      fromAmountLabel.style.display = 'block';
      fromAmountField.style.display = 'block';
      fromAmountField.value = toAmountField.value;
      toAmountLabel.innerHTML = 'To Amount';
      toAccountLabel.style.display = 'block';
      toAccountSelector.style.display = 'block';
      toAccountSelector.selectedIndex = -1;
      toAccountSelector.required = true;
      categorySelector.value = 'finance';
      Array.from(this.form.children).map(child => {
        if (child.nodeName != 'LABEL' && child.type != 'submit') {
          child.style.padding = '.2rem 2rem';
          child.style.fontSize = '.9rem';
        }
      });
      this.modal.setFrame();
    }
    else {
      fromAccountLabel.style.display = 'none';
      fromAccountSelector.style.display = 'none';
      fromAccountSelector.required = false;
      fromAmountLabel.style.display = 'none';
      fromAmountField.style.display = 'none';
      toAmountLabel.innerHTML = 'Amount';
      toAccountLabel.style.display = 'none';
      toAccountSelector.style.display = 'none';
      toAccountSelector.required = false;
      Array.from(this.form.children).map(child => {
        if (child.nodeName != 'LABEL' && child.type != 'submit') {
          child.style.padding = '.4rem 2rem';
          child.style.fontSize = '1.2rem';
        }
      });
      this.modal.setFrame();
    }
  }
}

class TransactionsModal extends CrudModal { }

const accounts = new Accounts();
const transactions = new Transactions();
const accountsModal = new AccountsModal();
const transactionsModal = new TransactionsModal();
