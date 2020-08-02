class Custom {
  constructor() {
    this.offsetHeader = document.querySelector('.headerHeight').offsetHeight;

    if (document.querySelector('.footerHeight') == null) {
      this.offsetFooter = 0;
    } else {
      this.offsetFooter = document.querySelector('.footerHeight').offsetHeight;
    }

    this.offsetSection = document.querySelector('.sectionHeight');
    this.body = document.querySelector('body');
    this.devMode = document.querySelectorAll('.dev-edition');

    this.init();
  }

  init() {
    this.offset();
    this.scrollToTop();
    this.createDeveloperModal();
    this.loader();

    if (this.devMode !== null) {
      this.devMode.forEach(el => {
        el.addEventListener('click', (evt) => {
          evt.preventDefault();
          document.querySelector('.dev-modal').style.transform = `translateY(0)`;
        });
      });
    }
  }

  // рахуємо висоту сексії віднявши висоту хідера і футера
  offset() {
    // this.offsetSection.style.height = `calc(100vh - (${this.offsetHeader}px + ${this.offsetFooter}px))`;
    this.offsetSection.style.height = `100vh`;
    this.offsetSection.style.paddingTop = `${this.offsetHeader + 15}px`;
    this.offsetSection.style.paddingBottom = `${this.offsetFooter + 20}px`;
  }

  // скролл (кнопка)
  scrollToTop() {
    let scroll = document.createElement('div'),
        i = document.createElement('i'),
        section = this.offsetSection;

    scroll.classList.add('scroll-top-btn');

    section.addEventListener('scroll', () => {
      if (section.scrollTop > 200) {
        scroll.style.transform = 'scale(1)';
      } else if (section.scrollTop < 150) {
        scroll.style.transform = 'scale(0)';
      }
    });

    scroll.addEventListener('click', () => {
      section.scrollTo({
          top: 0,
          behavior: "smooth"
      });
    });

    scroll.appendChild(i);
    this.body.appendChild(scroll);
  }

  // модальне вікно - в розробці
  createDeveloperModal() {
    let wrapper = document.createElement('div'),
        container = document.createElement('div'),
        p = document.createElement('p'),
        btn = document.createElement('button');

    p.innerHTML = `Даний розділ в розробці`;

    wrapper.classList.add('dev-modal');
    btn.classList.add('btn-blue');
    btn.innerHTML = `Зрозуміло`;

    btn.addEventListener('click', () => {
      wrapper.style.transform = `translateY(-100%)`;
    });

    container.appendChild(p);
    container.appendChild(btn);
    wrapper.appendChild(container);

    this.body.appendChild(wrapper);
  }

  // preloader
  loader() {
    let preload = document.createElement('div');

    preload.className = "preloader";
    preload.innerHTML = '<div class="b-ico-preloader"></div><div class="spinner"></div>';
    document.body.appendChild(preload);

    window.addEventListener('load', function() {
      setTimeout(() => {
          preload.classList.add('fade');

          setTimeout(() => {
            preload.style.display = 'none';
          }, 400);
      }, 500);
    });
  }
}

let custom = new Custom();
