class Modal {

  constructor() {
    this.modal = document.querySelector('.modal');
    this.underlay = document.querySelector('.modal .underlay');
    this.underlay.addEventListener('click', this.hide);
    this.closeButton = document.querySelector('.modal .close');
    this.closeButton.addEventListener('click', this.hide);
    this.dialog = document.querySelector('.modal .dialog');
    this.heading = document.querySelector('.modal .dialog .heading');
    this.text = document.querySelector('.modal .dialog .text');
    this.message = document.querySelector('.modal .dialog .text .message');
  }

  show() {
    this.modal.style.display = 'block';
    this.setFrame();
  }

  hide() {
    this.modal = document.querySelector('.modal');
    this.modal.style.display = 'none';
  }

  setFrame() {
    this.dialog.style.position = 'fixed';
    this.dialog.style.top = '50%';
    this.dialog.style.left = '50%';
    this.dialog.style.transform = 'translate(-50%, -50%)';
  }
}

class MessageModal extends Modal {

  constructor() { super(); }

  show(heading, text) {
    super.show();
    this.heading.innerHTML = heading;
    this.text.innerHTML = text;
    this.setFrame();
  }
}

class CrudModal extends Modal {

  show(data) {
    this.text.innerHTML = '';
    data.crud.data = data.entity;
    data.crud.extraData = data.extraData;
    data.crud.modal = this;
    data.crud[data.callback](data);
    if (data.callback.includes('Create')) {
      this.heading.innerHTML = `Add a New ${data.displayName}`;
      this.text.appendChild(data.crud.form);
    }
    else if (data.callback.includes('Update')) {
      this.heading.innerHTML = `Update <span style=color:#777>${data.entity.name}</span> ${data.displayName.toLowerCase()}`;
      this.text.appendChild(data.crud.form);
    }
    else if (data.callback.includes('Delete')) {
      this.heading.innerHTML = `Delete <span style=color:#777>${data.entity.name}</span> ${data.displayName.toLowerCase()}?`;
      this.text.appendChild(data.crud.deleteForm);
    }
    super.show(data);
  }
}
