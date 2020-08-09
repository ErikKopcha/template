class Menu {
  constructor() {
    this.getElements();
    this.init();
  }

  init() {
    this.menu();
  }

  getElements() {
    this.burger = document.querySelectorAll('.menu-btn'),
    this.menuElement = document.querySelector('.menu');
  }

  menu() {
    this.burger.forEach(el => {
      el.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.menuElement.classList.toggle('transform');

        if (this.menuElement.classList.contains('transform')) {
            this.menuElement.classList.add('background-blur');
        } else {
          this.menuElement.classList.remove('background-blur');
        }
      });
    });
  }
}

let showMenu = new Menu();