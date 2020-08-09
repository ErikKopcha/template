class Modal {
  constructor() {
    this.body = document.querySelector('body');
  }

  init() {
    // element.addEventListener('click', () => {
    //   this.createModal('Заголовок алерта', 'Нагадуємо, що 23.02.2020 13:00 відбудуться збори жильців, для обговорення проблєми “Хто не знімає галоші в парадній”');
    // });
  }

  // модальне вікно
  createModal(infoTitle, infoText) {
    let wrapper = document.createElement('div'),
      container = document.createElement('div'),
      btnWrapper = document.createElement('div'),
      btnSuccess = document.createElement('button'),
      btnCancel = document.createElement('button'),
      title = document.createElement('p'),
      text = document.createElement('p');

    title.classList.add('modal-title');
    text.classList.add('modal-text');
    btnWrapper.classList.add('modal-btn-wrap');
    btnSuccess.classList.add('btn-green');
    btnCancel.classList.add('btn-red');
    container.classList.add('modal-body');
    wrapper.classList.add('modal');

    title.innerHTML = infoTitle;
    text.innerHTML = infoText;
    btnSuccess.innerHTML = `Зрозуміло`;
    btnCancel.innerHTML = `Скасувати`;

    btnWrapper.addEventListener('click', (evt) => {
      evt.preventDefault();

      let theTarget = event.target;

      if (theTarget.classList.contains('btn-green')) {
        // ?
      }

      if (theTarget.classList.contains('btn-red')) {
        wrapper.style.display = 'none';
      }
    });

    btnWrapper.appendChild(btnCancel);
    btnWrapper.appendChild(btnSuccess);

    container.appendChild(title);
    container.appendChild(text);
    container.appendChild(btnWrapper);

    wrapper.style.display = 'flex';
    wrapper.appendChild(container);

    this.body.appendChild(wrapper);
  }
}

let modal = new Modal();
