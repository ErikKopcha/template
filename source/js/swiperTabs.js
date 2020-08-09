class Swiper {
  constructor(options) {
    this.options = {
      slider: null,
      list: null,
      prevBtn: null,
      nextBtn: null,

      speed: 600,
      initialSlide: 0,
      keyboardControll: false,
      runCallbacks: true,

      onSlideChangeStart: null,
      onSlideChangeEnd: null,
      onSwipe: null,

      ...options
    }

    this.prevSlide = null
    this.currentSlide = this.options.initialSlide
    this.slidesCount = this.options.list.children.length
    this.slideWidth = this.options.slider.offsetWidth
    this.posX = 0
    this.translateX = 0
    this.swipeProgress = 0
    this.touching = false
    this.swiping = false

    this._startX = 0
    this._currentX = 0
    this._shiftX = 0
    this._testX = null
    this._testY = null
    this._runCallbacks = this.options.runCallbacks

    this.discussionInput = document.getElementById('discussion-tab');
    this.statisticInput = document.getElementById('statistic-tab');
    this.vatingInput = document.getElementById('vating-tab');
    this.tabsWrapper = document.getElementById('tabs-wrapper');
    this.tabScroll = document.getElementById('event-info-tabs');
    this.voterList = document.getElementById('voter-list');

    this.init()
  }

  init() {
    this.url();
    this.eventListHeight();
    this.tabsEvent();
    //this._setInitialSlide()
    this._addEventListeners()
  }

  // провірка на href для *прийняти . відхилити запрошуння + click
  url() {
    let href = location.href;
    let btnWrapper = document.querySelector('.button-yes-no-wrapper');
    let btnCancel = document.createElement('button');
    let i = document.createElement('i');
    btnCancel.classList.add('event-discard', 'btn-light-gray');
    btnCancel.innerHTML = `Скасувати`;
    btnCancel.prepend(i);

    if (btnWrapper != null) {
      btnWrapper.addEventListener('click', (event) => {
        event.preventDefault();

        let theTarget = event.target;

        if (theTarget.classList.contains('event-discard')) {
          btnWrapper.innerHTML = `
            <a href="#" id="no-btn" class="no-btn"><i></i> Не прийду</a>
            <a href="#" id="yes-btn" class="yes-btn">Буду! <i></i></a>
          `;
        }

        if (theTarget.classList.contains('yes-btn')) {
          btnWrapper.innerHTML = `
            <p class="complete-event"><i></i> Ви прийняли запрошення</p>
          `;

          btnWrapper.appendChild(btnCancel);
        }

        if (theTarget.classList.contains('no-btn')) {
          btnWrapper.innerHTML = `
            <p class="discard-event"><i></i> Ви відхилили запрошення</p>
          `;

          btnWrapper.appendChild(btnCancel);
        }
      });

      if (typeof href != 'undefined') {
        let hrefInfo = href.split('#')[1];
  
        // відмова від події
        if (hrefInfo == '0') {
          btnWrapper.innerHTML = `
            <p class="discard-event"><i></i> Ви відхилили запрошення</p>
          `;

          btnWrapper.appendChild(btnCancel);
        }
  
        // підтвердження участі в події
        if (hrefInfo == '1') {
          btnWrapper.innerHTML = `
            <p class="complete-event"><i></i> Ви прийняли запрошення</p>
          `;

          btnWrapper.appendChild(btnCancel);
        }
  
        // якщо був переход на список голосувавших
        if (hrefInfo == '3') {
          this.vatingInput.checked = true;
          this.showTab(2);
        }
      }
    }
  }

  // tab events

  // формула розрахунку висоти і відступу для списку коментарів і списку проголосувавших,
  // щоб зафіксувати блок з інпутом (Ваше повідомлення) для будь-яких екранів
  eventListHeight() {
    // let list = document.querySelector('.discussion-list'),
    //   vatingList = document.querySelector('.vating-info'),
    //   writeMessageBlock = document.querySelector('.discussion-write').offsetHeight,
    //   tabs = this.tabScroll.offsetHeight,
    //   eventInfoWrapp = document.querySelector('.event-info-wrapp').offsetHeight,
    //   pageTitle = document.querySelector('.page-tite').offsetHeight;

    // list.style.maxHeight = `calc(100vh - (${eventInfoWrapp}px)`;
    // vatingList.style.maxHeight = `calc(100vh - (${eventInfoWrapp}px)`;
    // list.style.marginBottom = `${writeMessageBlock + 5}px`;

    let list = document.querySelector('.discussion-list'),
      vatingList = document.querySelector('.vating-list'),
      writeMessageBlock = document.querySelector('.discussion-write').offsetHeight,
      tabs = this.tabScroll.offsetHeight,
      eventInfoWrapp = document.querySelector('.event-info-wrapp').offsetHeight,
      pageTitle = document.querySelector('.page-tite').offsetHeight;

    list.style.maxHeight = `calc(100vh - (${tabs}px + ${eventInfoWrapp}px + ${pageTitle}px))`;
    vatingList.style.maxHeight = `calc(${list.offsetHeight}px + ${writeMessageBlock}px)`;
    // list.style.marginBottom = `${writeMessageBlock + 5}px`;
  }

  tabsEvent() {
    if (this.discussionInput !== null) {
      this.discussionInput.addEventListener('click', () => {
        this.showTab(0);
      });
    }

    if (this.statisticInput !== null) {
      this.statisticInput.addEventListener('click', () => {
        this.showTab(1);
      });
    }

    if (this.voterList !== null) {
      this.voterList.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.vatingInput.checked = true;
        this.showTab(2);
      });
    }

    if (this.vatingInput !== null) {
      this.vatingInput.addEventListener('click', () => {
        this.showTab(2);
      });
    }
  }

  showTab(index) {
    this.currentSlide = index;

    if (index === 0) {
      if (this.discussionInput.checked) {
        this.tabsWrapper.style.transform = `translateX(0)`;

        if (this.tabScroll !== null) {
          this.tabScroll.scrollLeft = 0;
        }
      }
    } else if (index === 1) {
      if (this.statisticInput.checked) {
        this.tabsWrapper.style.transform = `translateX(-100%)`;

        //    function ss() {
        //      let sum = document.querySelector('.count');
        //      sum.animate({
        //         Counter: sum.textContent
        //     }, {
        //         duration: 1500,
        //         easing: 'linear',
        //         step: function (now) {
        //           sum.textContent = Math.ceil(now);
        //         }
        //     });
        //   };

        //   ss();

      }
    } else if (index === 2) {
      if (this.vatingInput.checked) {
        this.tabsWrapper.style.transform = `translateX(-200%)`;

        if (this.tabScroll !== null) {
          this.tabScroll.scrollLeft = 1000;
        }
      }
    }
  }

  // swipe events

  destroy() {
    this._removeEventListeners()
  }

  slideTo(index, runCallbacks = this.options.runCallbacks, slow = true) {
    // if (!this.touching) return
    this.prevSlide = this.currentSlide
    this._runCallbacks = runCallbacks

    this.currentSlide = Math.max(0, index)
    this.currentSlide = Math.min(this.slidesCount - 1, this.currentSlide)

    this._onSlideChangeStart()

    this.translateX = -this.currentSlide * this.slideWidth

    if (this.posX === this.translateX) return

    this._setAnimatable(slow)
    this.options.list.style.transform = `translateX(${this.translateX}px)`

    this.posX = this.translateX
  }

  // slidePrev = () => {
  //   requestAnimationFrame(() => this.slideTo(this.currentSlide - 1))
  // };

  // slideNext = () => {
  //   requestAnimationFrame(() => this.slideTo(this.currentSlide + 1))
  // };

  _setInitialSlide() {
    if (this.currentSlide === 0) return

    this.translateX = -this.currentSlide * this.slideWidth
    this.posX = this.translateX

    this.options.list.style.transform = `translateX(${this.translateX}px)`
  }

  _onSlideChangeStart() {
    if (this.prevSlide !== this.currentSlide &&
      this._runCallbacks &&
      this.options.onSlideChangeStart) {
      this.options.onSlideChangeStart(this)
    }

    if (this.currentSlide == 0) {
      this.discussionInput.checked = true;

      if (this.discussionInput.checked) {
        this.showTab(0);
      }
    } else if (this.currentSlide == 1) {
      this.statisticInput.checked = true;

      if (this.statisticInput.checked) {
        this.showTab(1);
      }
    } else if (this.currentSlide == 2) {
      this.vatingInput.checked = true;

      if (this.vatingInput.checked) {
        this.showTab(2);
      }
    }
  }

  _onSlideChangeEnd() {
    if (this.prevSlide !== this.currentSlide &&
      this._runCallbacks &&
      this.options.onSlideChangeStart) {
      this.options.onSlideChangeEnd(this)
    }
  }

  _addEventListeners() {
    this.options.slider.addEventListener('touchstart', this._onPointerStart, {
      passive: true
    })
    this.options.slider.addEventListener('mousedown', this._onPointerStart)
    this.options.slider.addEventListener('touchmove', this._onPointerMove)
    this.options.slider.addEventListener('mousemove', this._onPointerMove)
    this.options.slider.addEventListener('touchend', this._onPointerEnd)
    this.options.slider.addEventListener('mouseup', this._onPointerEnd)
    this.options.slider.addEventListener('mouseleave', this._onPointerEnd)

    this.options.keyboardControll && document.addEventListener('keydown', this._onKeyDown)
    // this.options.prevBtn && this.options.prevBtn.addEventListener('click', this.slidePrev)
    // this.options.nextBtn && this.options.nextBtn.addEventListener('click', this.slideNext)

    window.addEventListener('resize', this._onWindowResize)
  }

  _removeEventListeners() {
    this.options.slider.removeEventListener('touchstart', this._onPointerStart, {
      passive: true
    })
    this.options.slider.removeEventListener('mousedown', this._onPointerStart)
    this.options.slider.removeEventListener('touchmove', this._onPointerMove)
    this.options.slider.removeEventListener('mousemove', this._onPointerMove)
    this.options.slider.removeEventListener('touchend', this._onPointerEnd)
    this.options.slider.removeEventListener('mouseup', this._onPointerEnd)
    this.options.slider.removeEventListener('mouseleave', this._onPointerEnd)

    this.options.keyboardControll && document.removeEventListener('keydown', this._onKeyDown)
    // this.options.prevBtn && this.options.prevBtn.removeEventListener('click', this.slidePrev)
    // this.options.nextBtn && this.options.nextBtn.removeEventListener('click', this.slideNext)

    window.removeEventListener('resize', this._onWindowResize)
  }

  _onWindowResize = () => {
    this.slideWidth = this.options.slider.offsetWidth

    this.translateX = -this.currentSlide * this.slideWidth
    this.options.list.style.transform = `translateX(${this.translateX}px)`

    this.posX = this.translateX
  };

  _onKeyDown = ({
    keyCode
  }) => {
    switch (keyCode) {
      case 37:
        this.slidePrev()
        break
      case 39:
        this.slideNext()
        break
    }
  };

  // e.pageX || e.touches[0].pageX
  // ^ when pageX === 0 then accessing e.touches[0] throws an error
  _getX = e => e.touches ? e.touches[0].pageX : e.pageX;
  _getY = e => e.touches ? e.touches[0].pageY : e.pageY;

  _onPointerStart = (e) => {
    this.touching = true

    this._startX = this._getX(e)
    this._currentX = this._startX

    this._testX = this._getX(e)
    this._testY = this._getY(e)

    if (!e.touches) {
      this.swiping = true
      requestAnimationFrame(this._update)
    }
  };

  _onPointerMove = (e) => {
    if (!this.touching) return

    this._currentX = this._getX(e)
    this._currentY = this._getY(e)

    if (e.touches && this._testX && this._testY) {
      const xDiff = this._testX - this._currentX
      const yDiff = this._testY - this._currentY

      // Is swiping horizontal
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        e.preventDefault()
        this.swiping = true
        requestAnimationFrame(this._update)
      }

      this._testX = null
      this._testY = null
    }
  };

  _onPointerEnd = () => {
    if (!this.touching) {
      return
    }

    if (this.swipeProgress === 0) {
      this.touching = false
      this.swiping = false
      this.swipeProgress = 0
      return
    }

    this.touching = false

    this.posX = this.translateX

    const progress = Math.abs(this._shiftX) / this.slideWidth
    const minShift = progress >= .2
    const direction = this._shiftX < 0 ? 1 : -1
    let index = this.currentSlide

    if (this.swiping && minShift) {
      index += direction
    }

    requestAnimationFrame(() => this.slideTo(index))

    this.swiping = false
    this.swipeProgress = 0
  };

  _update = () => {
    if (!this.touching) return

    requestAnimationFrame(this._update)

    this._shiftX = this._currentX - this._startX
    this.translateX = this.posX + this._shiftX

    this.options.list.style.transform = `translateX(${this.translateX}px)`

    if (this.options.onSwipe) {
      this.swipeProgress = Math.abs(this._shiftX) / this.slideWidth
      this.options.onSwipe && this.options.onSwipe(this)
    }
  };

  _setAnimatable(slow = false) {
    const transition = slow ?
      `transform ${ this.options.speed }ms cubic-bezier(0.6, 0.6, 0.2, 1)` :
      `transform ${ this.options.speed * .75 }ms cubic-bezier(0.3, 0.4, 0.6, 1)`

    this.options.list.style.transition = transition

    this.options.list.addEventListener('transitionend', () => {
      this.options.list.style.transition = ''
      this._onSlideChangeEnd()
    })
  }
}

const mySlider = new Swiper({
  slider: document.querySelector('.c-slider'),
  list: document.querySelector('.c-slider__list'),
  // prevBtn: document.querySelector('.c-slider__prev'),
  // nextBtn: document.querySelector('.c-slider__next'),

  speed: 400,
  initialSlide: 0,
  keyboardControll: true,
  runCallbacks: true,

  onSlideChangeStart(slider) {
    console.log('onSlideChangeStart')
  },
  onSlideChangeEnd(slider) {
    console.log('onSlideChangeEnd')
  },
  onSwipe({
    swipeProgress
  }) {
    console.log('swipeProgress: ' + swipeProgress)
  }
});
