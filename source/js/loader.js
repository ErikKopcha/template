class Loader {
  constructor() {
    this.init();
  }

  init() {
    this.preloloader();
  }

  // preloader
  preloloader() {
    let preload = document.createElement('div');

    preload.className = "preloader";
    preload.innerHTML = '<div class="b-ico-preloader"></div><div class="spinner"></div>';
    document.body.appendChild(preload);

    window.addEventListener('load', () => {
      // setTimeout(() => {
        preload.classList.add('fade');

        setTimeout(() => {
          preload.style.display = 'none';
        }, 400);
      // }, 500);
    });
  }
}

let loader = new Loader();