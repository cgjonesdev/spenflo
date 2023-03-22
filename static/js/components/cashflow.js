messageModal = new MessageModal();

class Incomes extends CRUD {
  attributes = {
    id: {element: 'input', name: '_id', type: 'text', label: 'ID', display: 'none', refName: 'id'},
    name: {
      element: 'input',
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
      display: 'block',
      refName: 'name'},
    amount: {
      element: 'input',
      name: 'amount',
      type: 'text',
      required: true,
      label: 'Amount',
      display: 'block',
      refName: 'amount'},
    date: {
      element: 'input',
      name: 'date',
      type: 'date',
      required: false,
      label: 'Date (of next payment)',
      display: 'block',
      refName: 'date'},
    cycleInt: {
      element: 'input',
      name: 'cycle_int',
      type: 'number',
      min: 1,
      max: 100,
      required: true,
      label: '<br>I receive this income every',
      display: 'block',
      refName: 'cycleInt'},
    cycleStr: {
      element: 'select',
      name: 'cycle_str',
      options: {
        null: '',
        'day(s)': 'days(s)',
        'week(s)': 'week(s)',
        'month(s)': 'month(s)',
        'year(s)': 'year(s)'
      },
      required: true,
      label: '',
      display: 'block',
      refName: 'cycleStr'},
    isPrimary: {
      element: 'select',
      name: 'is_primary',
      options: {
        false: 'No',
        true: 'Yes'
      },
      value: false,
      required: false,
      label: 'This is my primary income',
      display: 'block',
      refName: 'isPrimary'},
    receiptAccount: {
      element: 'select',
      name: 'receipt_account',
      options: {},
      required: false,
      label: 'Account to add received amount to',
      display: 'none',
      refName: 'receiptAccount'},
    receiptName: {
      element: 'input',
      name: 'receipt_name',
      type: 'text',
      required: false,
      display: 'none',
      refName: 'receiptName'},
    receiptAmount: {
      element: 'input',
      name: 'receipt_amount',
      type: 'text',
      required: false,
      label: 'Amount of transaction',
      display: 'none',
      refName: 'receiptAmount'},
    receiptDate: {
      element: 'input',
      name: 'receipt_date',
      type: 'date',
      required: false,
      label: 'Date of transaction',
      display: 'none',
      refName: 'receiptDate'},
    receiptInstrument: {
      element: 'select',
      name: 'receipt_instrument',
      type: 'select',
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
      required: false,
      label: 'The way this income was received',
      display: 'none',
      refName: 'receiptInstrument'}
  }
  requiredDeleteFields = ['_id']
  receiveForm = document.createElement('form')

  constructor() {
    super();
    this.buildForm();
    const amount = Array.from(this.form.children).filter(child => child.refName == 'amount')[0];
    const cycleInt = Array.from(this.form.children).filter(child => child.refName == 'cycleInt')[0];
    this.testForNonNumberKey(amount);
    this.testForNonNumberKey(cycleInt);
  }

  buildForm() {
    super.buildForm();
    this.form.method = 'POST';
    this.form.action = '/app/cashflow/incomes';
    this.deleteForm.method = 'POST';
    this.deleteForm.action = '/app/cashflow/incomes';
  }

  buildCreateForm(data) {
    super.buildCreateForm(data);
  }

  buildReceiveForm(data) {
    if (!this.receiveForm.children.length) {
      const nameInput = this.createInputElement(this.attributes.receiptName, this.receiveForm);
      nameInput.value = `${data.entity.name} [RECEIVED]`;

      const amountLabel = this.createLabelElement(this.attributes.receiptAmount, this.receiveForm);
      amountLabel.style.display = 'block';
      const amountInput = this.createInputElement(this.attributes.receiptAmount, this.receiveForm);
      amountInput.value = this.data.amount;
      amountInput.required = true;
      amountInput.style.display = 'block';
      amountInput.style.width = '50%';

      const dateLabel = this.createLabelElement(this.attributes.receiptDate, this.receiveForm);
      dateLabel.style.display = 'block';
      const dateInput = this.createInputElement(this.attributes.receiptDate, this.receiveForm);
      dateInput.value = this.todayISO;
      dateInput.required = true;
      dateInput.style.display = 'block';
      dateInput.style.width = '50%';

      const instrumentLabel = this.createLabelElement(this.attributes.receiptInstrument, this.receiveForm);
      instrumentLabel.style.display = 'block';
      const instrumentSelect = this.createSelectElement(this.attributes.receiptInstrument, this.receiveForm);
      instrumentSelect.style.display = 'block';
      instrumentSelect.style.width = '50%';
      instrumentSelect.required = true;

      const accountLabel = this.createLabelElement(this.attributes.receiptAccount, this.receiveForm);
      accountLabel.style.display = 'block';
      const options = {}
      data.accounts.map(account => options[account._id] = account.name);
      this.attributes.receiptAccount.options = options;
      const accountSelect = this.createSelectElement(this.attributes.receiptAccount, this.receiveForm);
      accountSelect.required = true;
      accountSelect.style.display = 'block';
      accountSelect.style.width = '50%';
      accountSelect.focus();

      this.setAPIOperationHiddenField(this.receiveForm, 'receive');
      this.createSubmitInput(this.receiveForm, document.createElement('input'),
                             'Add Transaction', this.updateButtonColor);
      this.requiredDeleteFields.forEach(field => {
        const input = document.createElement('input');
        input.name = field;
        input.value = this.data[field];
        input.style.display = 'none';
        this.receiveForm.appendChild(input);
      });
    }
    else {
      const amountInput = Array.from(this.receiveForm.children).filter(child => child.refName == 'receiptAmount')[0];
      amountInput.value = this.data.amount;
    }
    this.receiveForm.method = 'POST';
    this.receiveForm.action = '/app/cashflow/incomes';
    this.receiveForm.style = this.formStyle;
  }
}

class IncomesModal extends CrudModal {

  show(data) {
    super.show(data);
    data.crud.accounts = data.accounts;
    if (data.callback.includes('Receive')) {
      this.heading.innerHTML = `Have you received money for the <span style=color:#777>${data.entity.name}</span> recurring ${data.displayName.toLowerCase()}?`;
      const p = document.createElement('p');
      p.innerHTML = `If you recently received money for <i>${data.entity.name}</i>, you can add it to your transactions in the account of your choice below. Adding the transaction will keep your Cashburn and Budget up-to-date.`;
      this.text.appendChild(p);
      this.text.appendChild(data.crud.receiveForm);
    }
    super.setFrame();
  }
}

class Expenses extends CRUD {
  attributes = {
    id: {element: 'input', name: '_id', type: 'text', label: 'ID', display: 'none', refName: 'id'},
    name: {
      element: 'input',
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
      display: 'block',
      refName: 'name'},
    amount: {
      element: 'input',
      name: 'amount',
      type: 'text',
      required: true,
      label: 'Amount',
      display: 'block',
      refName: 'amount'},
    date: {
      element: 'input',
      name: 'date',
      type: 'date',
      required: false,
      label: 'Due date',
      display: 'block',
      refName: 'date'},
    cycleInt: {
      element: 'input',
      name: 'cycle_int',
      type: 'number',
      min: 1,
      max: 100,
      required: true,
      label: '<br>This expense is due every',
      display: 'block',
      refName: 'cycleInt'},
    cycleStr: {
      element: 'select',
      name: 'cycle_str',
      options: {
        'day(s)': 'days(s)',
        'week(s)': 'week(s)',
        'month(s)': 'month(s)',
        'year(s)': 'year(s)'
      },
      required: true,
      label: '',
      display: 'block',
      refName: 'cycleStr'},
    notes: {
      element: 'input',
      name: 'notes',
      type: 'text',
      required: false,
      label: 'Notes',
      display: 'block',
      refName: 'notes'},
    webLink: {
      element: 'input',
      name: 'web_link',
      type: 'text',
      required: false,
      label: 'Web link',
      display: 'block',
      refName: 'webLink'},
    paidAccount: {
      element: 'select',
      name: 'paid_account',
      options: {},
      required: false,
      label: 'Account to add paid amount to',
      display: 'none',
      refName: 'paidAccount'},
    paidName: {
      element: 'input',
      name: 'paid_name',
      type: 'text',
      required: false,
      display: 'none',
      refName: 'paidName'},
    paidAmount: {
      element: 'input',
      name: 'paid_amount',
      type: 'text',
      required: false,
      label: 'Amount of transaction',
      display: 'none',
      refName: 'paidAmount'},
    paidDate: {
      element: 'input',
      name: 'paid_date',
      type: 'date',
      required: false,
      label: 'Date of transaction',
      display: 'none',
      refName: 'paidDate'},
    paidInstrument: {
      element: 'select',
      name: 'paid_instrument',
      type: 'select',
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
      required: false,
      label: 'The way this expense was paid',
      display: 'none',
      refName: 'paidInstrument'}
  }
  requiredDeleteFields = ['_id']
  payForm = document.createElement('form')

  constructor() {
    super();
    this.buildForm();
    const amount = Array.from(this.form.children).filter(child => child.refName == 'amount')[0];
    const cycleInt = Array.from(this.form.children).filter(child => child.refName == 'cycleInt')[0];
    this.testForNonNumberKey(amount);
    this.testForNonNumberKey(cycleInt);
  }

  buildForm() {
    super.buildForm();
    this.form.method = 'POST';
    this.form.action = '/app/cashflow/expenses';
    this.deleteForm.method = 'POST';
    this.deleteForm.action = '/app/cashflow/expenses';
  }

  buildPayForm(data) {
    if (!this.payForm.children.length) {
      const nameInput = this.createInputElement(this.attributes.paidName, this.payForm);
      nameInput.value = `${data.entity.name} [PAID]`;

      const amountLabel = this.createLabelElement(this.attributes.paidAmount, this.payForm);
      amountLabel.style.display = 'block';
      const amountInput = this.createInputElement(this.attributes.paidAmount, this.payForm);
      amountInput.value = Math.abs(parseFloat(this.data.amount)) * -1;
      amountInput.required = true;
      amountInput.style.display = 'block';
      amountInput.style.width = '50%';

      const dateLabel = this.createLabelElement(this.attributes.paidDate, this.payForm);
      dateLabel.style.display = 'block';
      const dateInput = this.createInputElement(this.attributes.paidDate, this.payForm);
      dateInput.value = this.todayISO;
      dateInput.required = true;
      dateInput.style.display = 'block';
      dateInput.style.width = '50%';

      const instrumentLabel = this.createLabelElement(this.attributes.paidInstrument, this.payForm);
      instrumentLabel.style.display = 'block';
      const instrumentSelect = this.createSelectElement(this.attributes.paidInstrument, this.payForm);
      instrumentSelect.style.display = 'block';
      instrumentSelect.style.width = '50%';
      instrumentSelect.required = true;

      const accountLabel = this.createLabelElement(this.attributes.paidAccount, this.payForm);
      accountLabel.style.display = 'block';
      const options = {}
      data.accounts.map(account => options[account._id] = account.name);
      this.attributes.paidAccount.options = options;
      const accountSelect = this.createSelectElement(this.attributes.paidAccount, this.payForm);
      accountSelect.required = true;
      accountSelect.style.display = 'block';
      accountSelect.style.width = '50%';
      accountSelect.focus();

      this.setAPIOperationHiddenField(this.payForm, 'pay');
      this.createSubmitInput(this.payForm, document.createElement('input'),
                             'Add Transaction', this.updateButtonColor);
      this.requiredDeleteFields.forEach(field => {
        const input = document.createElement('input');
        input.name = field;
        input.value = this.data[field];
        input.style.display = 'none';
        this.payForm.appendChild(input);
      });
    }
    else {
      const amountInput = Array.from(this.payForm.children).filter(child => child.refName == 'paidAmount')[0];
      amountInput.value = this.data.amount;
    }
    this.payForm.method = 'POST';
    this.payForm.action = '/app/cashflow/expenses';
    this.payForm.style = this.formStyle;
  }
}

class ExpensesModal extends CrudModal {

  show(data) {
    super.show(data);
    data.crud.accounts = data.accounts;
    if (data.callback.includes('Pay')) {
      this.heading.innerHTML = `Have you paid the <span style=color:#777>${data.entity.name}</span> recurring ${data.displayName.toLowerCase()}?`;
      const p = document.createElement('p');
      p.innerHTML = `If you recently paid the <i>${data.entity.name}</i> expense, you can add it to your transactions in the account of your choice below. Adding the transaction will keep your Cashburn and Budget up-to-date.`;
      this.text.appendChild(p);
      this.text.appendChild(data.crud.payForm);
    }
    super.setFrame();
  }
}

class Targets extends CRUD {
  attributes = {
    id: {element: 'input', name: '_id', type: 'text', label: 'ID', display: 'none', refName: 'id'},
    name: {
      element: 'input',
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
      display: 'block',
      refName: 'name'},
    amount: {
      element: 'input',
      name: 'amount',
      type: 'text',
      required: true,
      label: 'Amount',
      display: 'block',
      refName: 'amount'},
    date: {
      element: 'input',
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date you need the full amount by',
      display: 'block',
      refName: 'date'},
    paid: {
      element: 'input',
      name: 'paid',
      type: 'text',
      required: false,
      label: 'Amount already contributed',
      display: 'block',
      refName: 'paid'},
    priority: {
      element: 'select',
      name: 'priority',
      type: 'select',
      options: {
        1: 'Highest',
        2: 'Very High',
        3: 'High',
        4: 'Above Average',
        5: 'Average',
        6: 'Below Average',
        7: 'Low',
        8: 'Very Low',
        9: 'Lowest',
      },
      value: 5,
      required: true,
      label: 'Priority',
      display: 'block',
      refName: 'priority'},
    webLink: {
      element: 'input',
      name: 'web_link',
      type: 'url',
      required: false,
      label: 'Link to product/idea web page',
      display: 'block',
      refName: 'webLink'}
  }
  requiredDeleteFields = ['_id']
  rollForm = document.createElement('form')

  constructor() {
    super();
    this.buildForm();
    this.form.onsubmit = e => {
      e.preventDefault();
      const formDate = new Date(this.form.date.value);
      if (this.today > formDate) {
        alert(`The date you entered "${this.form.date.value}" is in the past. You must enter a future date`);
        this.form.date.focus();
      }
      this.form.submit();
    }
    const amount = Array.from(this.form.children).filter(child => child.refName == 'amount')[0];
    this.testForNonNumberKey(amount);
  }

  buildForm() {
    super.buildForm();
    this.form.method = 'POST';
    this.form.action = '/app/cashflow/targets';
    this.deleteForm.method = 'POST';
    this.deleteForm.action = '/app/cashflow/targets';
  }

  buildRollForm() {
    if (!this.rollForm.children.length) {
      this.setAPIOperationHiddenField(this.rollForm, 'roll');
      this.createSubmitInput(this.rollForm, document.createElement('input'), 'Roll Target', this.updateButtonColor);
      this.requiredDeleteFields.forEach(field => {
        const input = document.createElement('input');
        input.name = field;
        input.value = this.data[field];
        input.style.display = 'none';
        this.rollForm.appendChild(input);
      });
    }
    this.rollForm.method = 'POST';
    this.rollForm.action = '/app/cashflow/targets';
    this.rollForm.style = this.formStyle;
  }
}

class TargetsModal extends CrudModal {

  show(data) {
    super.show(data);
    if (data.callback.includes('Roll')) {
      this.heading.innerHTML = `Roll <span style=color:#777>${data.entity.name}</span> ${data.displayName.toLowerCase()}?`;
      const p = document.createElement('p');
      if (data.entity.expense_id == '') {
        p.innerHTML = `Rolling the <i>${data.entity.name}</i> Target means that it will be added to your regular expenses and will become part of your budget.`;
        Array.from(data.crud.rollForm).filter(child => child.type == 'submit')[0].value = 'Roll Target';
      }
      else {
         p.innerHTML = `It looks like the <i>${data.entity.name}</i> Target is already one of your regular expenses. Rolling it again will refresh the expense connected to it with any updated information. If you haven't made any changes, the expense amount may still increase because you are closer now to your target date.`;
        this.heading.innerHTML = `Refresh <span style=color:#777>${data.entity.name}</span> ${data.displayName.toLowerCase()}?`;
        Array.from(data.crud.rollForm).filter(child => child.type == 'submit')[0].value = 'Refresh Target';
      }
      this.text.appendChild(p);
      this.text.appendChild(data.crud.rollForm);
    }
    this.setFrame();
  }
}

const incomes = new Incomes();
const incomesModal = new IncomesModal();
const expenses = new Expenses();
const expensesModal = new ExpensesModal();
const targets = new Targets();
const targetsModal = new TargetsModal();
