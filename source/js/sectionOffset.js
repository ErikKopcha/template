class offsetSection {
  constructor(scrollToTop) {
    if (document.querySelector('.headerHeight') == null) {
      this.offsetHeader = 0
    } else {
      this.offsetHeader = document.querySelector('.headerHeight').offsetHeight;
    }    
    
    if (document.querySelector('.footerHeight') == null) {
      this.offsetFooter = 0
    } else {
      this.offsetFooter = document.querySelector('.footerHeight').offsetHeight;
    }

    this.offsetSection = document.querySelector('.sectionHeight');
    this.body = document.querySelector('body');

    this.init();
  }

  init() {
    this.offset();
  }

  // рахуємо висоту сексії віднявши висоту хідера і футера
  offset() {
    // this.offsetSection.style.height = `calc(100vh - (${this.offsetHeader}px + ${this.offsetFooter}px))`;
    this.offsetSection.style.height = `100vh`;
    this.offsetSection.style.paddingTop = `${this.offsetHeader + 15}px`;
    this.offsetSection.style.paddingBottom = `${this.offsetFooter + 20}px`;
  }
}

let section = new offsetSection();