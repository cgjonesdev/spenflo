class CRUD {
  styleSheet = Array.from(document.styleSheets).filter(sheet => sheet.href.includes('crud.css'))[0]
  formStyle = this.styleSheet.rules[1].style;
  inputStyle = this.styleSheet.rules[2].style;
  selectStyle = this.styleSheet.rules[3].style;
  submitStyle = this.styleSheet.rules[4].style;
  addButtonColor = this.styleSheet.rules[5].style.background;
  updateButtonColor = this.styleSheet.rules[6].style.background;
  deleteButtonColor = this.styleSheet.rules[7].style.background;
  form = document.createElement('form')
  deleteForm = document.createElement('form')
  today = new Date()
  todayISO = this.today.toISOString().split('T')[0]

  buildForm() {
    this.form.style = this.formStyle;
    for (let attr of Object.keys(this.attributes)) {
      this.createLabelElement(this.attributes[attr], this.form);
      if (this.attributes[attr].element == 'input') {
        this.createInputElement(this.attributes[attr], this.form);
      }
      else if (this.attributes[attr].element == 'select') {
        this.createSelectElement(this.attributes[attr], this.form);
      }
    }
    this.createSubmitInput(this.form, document.createElement('input'), 'Update', this.updateButtonColor);
    this.submitButton = Array.from(this.form.children).filter(child => child.type == 'submit')[0];
    this.dataFieldsWithLabels = Array.from(this.form.children).filter(child => child.type != 'submit' && child.name != 'operation');
    this.dataFields = this.dataFieldsWithLabels.filter(child => child.nodeName != 'LABEL');
  }

  buildCreateForm(data) {
    this.setAPIOperationHiddenField(this.form, 'add');
    this.submitButton.value = `Add ${data.displayName}`;
    this.submitButton.style.background = this.addButtonColor;
    this.clearDataFields();
    this.form.style.display = 'flex';
    this.deleteForm.style.display = 'none';
  }

  buildUpdateForm(data) {
    console.log(data);
    for (let element of this.dataFields) {
      if (element.nodeName == 'INPUT') {
        
        try { element.value = JSON.parse(this.data[element.name]) || ''; }
        catch (err) { element.value = this.data[element.name] || ''; }
      }
      else if (element.nodeName == 'SELECT') {
        element.value = this.data[element.name];
      }
    }
    this.setAPIOperationHiddenField(this.form, 'update');
    this.submitButton.value = 'Update';
    this.submitButton.style.background = this.updateButtonColor;
    this.form.style.display = 'flex';
    this.deleteForm.style.display = 'none';
  }

  buildDeleteForm() {
    if (!this.deleteForm.children.length) {
      this.setAPIOperationHiddenField(this.deleteForm, 'delete');
      this.createSubmitInput(
        this.deleteForm, document.createElement('input'), 'Delete', this.deleteButtonColor);
    }
    this.deleteForm.onsubmit = e => {
      e.preventDefault();
      this.requiredDeleteFields.forEach(field => {
        const input = document.createElement('input');
        input.name = field;
        input.value = this.data[field];
        input.style.display = 'none';
        this.deleteForm.appendChild(input);
      });
      this.deleteForm.submit();
    }
    this.form.style.display = 'none';
    this.deleteForm.style.display = 'flex';
  }

  createLabelElement(attribute, form) {
    const label = document.createElement('label');
    label.innerHTML = attribute.label;
    label.style.display = attribute.display;
    form.appendChild(label);
    return label;
  }

  createInputElement(attribute, form) {
    const input = document.createElement('input');
    input.setAttribute('name', attribute.name);
    input.setAttribute('type', attribute.type);
    if (input.type == 'number') {
      input.min = attribute.min;
      input.max = attribute.max;
    }
    input.value = attribute.value;
    input.required = attribute.required;
    input.display = attribute.display;
    input.refName = attribute.refName;
    input.style = this.inputStyle;
    input.style.display = input.display;
    form.appendChild(input);
    return input;
  }

  createSelectElement(attribute, form) {
    const select = document.createElement('select');
    select.setAttribute('name', attribute.name);
    select.setAttribute('type', attribute.type);
    select.required = attribute.required;
    select.refName = attribute.refName;
    for (let key of Object.keys(attribute.options)) {
      let option = document.createElement('option');
      option.setAttribute('value', key);
      option.innerHTML = attribute.options[key];
      select.appendChild(option);
    }
    select.value = attribute.value;
    select.style = this.selectStyle;
    select.style.display = attribute.display;
    form.appendChild(select);
    return select;
  }

  createSubmitInput(form, submit, value, background) {
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', value);
    submit.style = this.submitStyle;
    submit.style.background = background;
    form.appendChild(submit);
    return submit;
  }

  setAPIOperationHiddenField(form, operation) {
    const operationElement = document.createElement('input');
    operationElement.setAttribute('name', 'operation');
    operationElement.hidden = true;
    operationElement.required = false;
    operationElement.value = operation;
    form.appendChild(operationElement);
  }

  clearDataFields() {
    for (let element of this.dataFields) {
      if (element.nodeName == 'INPUT') { element.value = ''; }
      else if (element.nodeName == 'SELECT') { element.selectedIndex = -1; }
    }
  }

  testForNonNumberKey(element) {
    if (element) {
      element.onkeyup = e => {
        if ((/[a-zA-Z]/).test(e.key) && e.key.length == 1 && e.key != '.') {
          alert(`You entered the non-numeric character "${e.key}". All characters for this input field must be numbers`);
        }
      }
    }
  }
}
