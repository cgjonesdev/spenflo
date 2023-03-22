class Login extends CRUD {
  attributes = {
    firstName: {element: 'input', name: 'first_name', type: 'text', required: false,
      label: 'First Name', display: 'none', refName: 'firstName'},
    lastName: {element: 'input', name: 'last_name', type: 'text', required: false,
      label: 'Last Name', display: 'none', refName: 'lastName'},
    phone: {element: 'input', name: 'phone', type: 'text', required: false,
      label: 'Phone', display: 'none', refName: 'phone'},
    userName: {element: 'input', name: 'username', type: 'text', required: true,
      label: 'username', display: 'block', refName: 'userName'},
    passWord: {element: 'input', name: 'password', type: 'password', required: false,
      label: 'password', display: 'none', refName: 'passWord'}
  }
  clickCount = 0

  constructor() {
    super();
    this.buildForm();
    this.form.method = 'POST';
    this.form.action = '/login';
  }

  buildCreateForm(data) {
    super.buildCreateForm(data);
    this.submitButton.value = 'Enter';
    this.form.onsubmit = e => {
      e.preventDefault();

      this.firstNameLabel = Array.from(this.form.children).filter(child => child.innerHTML == 'First Name')[0];
      this.firstName = Array.from(this.form.children).filter(child => child.refName == 'firstName')[0];
      this.lastNameLabel = Array.from(this.form.children).filter(child => child.innerHTML == 'Last Name')[0];
      this.lastName = Array.from(this.form.children).filter(child => child.refName == 'lastName')[0];
      this.phoneLabel = Array.from(this.form.children).filter(child => child.innerHTML == 'Phone')[0];
      this.phone = Array.from(this.form.children).filter(child => child.refName == 'phone')[0];

      const userNameLabel = Array.from(this.form.children).filter(child => child.innerHTML == 'username')[0];
      const userName = Array.from(this.form.children).filter(child => child.refName == 'userName')[0];
      const passWordLabel = Array.from(this.form.children).filter(child => child.innerHTML == 'password')[0];
      const passWord = Array.from(this.form.children).filter(child => child.refName == 'passWord')[0];
      const operation = Array.from(this.form.children).filter(child => child.name == 'operation')[0];

      if (/\w*@\w*.\w{2,7}/.test(userName.value)) {
        this.clickCount += 1;
        userNameLabel.style.display = 'none';
        userName.style.display = 'none';
        passWordLabel.style.display = 'block';
        passWord.style.display = 'block';
        this.submitButton.value = `${data.displayName}`;

        if (this.clickCount == 1) {
          new API(undefined, undefined, undefined, `users/${userName.value}`, undefined,
                  undefined, this, this.userData);
          this.submitButton.style.width = 'auto';
        }

        if (this.clickCount == 2) {
          this.clickCount = 0;
          this.form.submit();
        }
      }
      else alert('Username value must be a valid email address');
    }
  }

  userData(obj, data) {
    if (typeof data == 'string' && data == 'User not found') {
      obj.firstNameLabel.style.display = 'block';
      obj.firstName.style.display = 'block';
      obj.lastNameLabel.style.display = 'block';
      obj.lastName.style.display = 'block';
      obj.phoneLabel.style.display = 'block';
      obj.phone.style.display = 'block';
      obj.firstName.focus();
      obj.modal.setFrame();
      obj.submitButton.value = 'Create Account';
    }
  }
}

class LoginModal extends CrudModal {

  show(data) {
    super.show(data);
    this.text.innerHTML = '';
    data.crud.data = data.entity;
    data.crud.extraData = data.extraData;
    data.crud.modal = this;
    data.crud[data.callback](data);
    this.heading.innerHTML = `${data.displayName} to Spenflo`;
    if (data.extraData) {
      const p = document.createElement('p');
      p.classList.add('error');
      p.innerHTML = data.extraData;
      this.text.appendChild(p);
    }
    this.text.appendChild(data.crud.form);
    this.setFrame();
  }
}

const login = new Login();
const loginModal = new LoginModal();

document.querySelector('.models').click();
