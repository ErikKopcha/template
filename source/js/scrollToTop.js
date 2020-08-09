class Scroll {
  constructor() {
    this.offsetSection = document.querySelector('.sectionHeight');
    this.body = document.querySelector('body');

    this.init();
  }

  init() {
    this.scrollToTop();
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
}

let scrollTop = new Scroll();