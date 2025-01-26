class SlProductList {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.previousBtn = this.getPreviousButton();
    this.nextBtn = this.getNextButton();
    this.slider = this.getSlider();
    this.slides = this.getCurrentSlides();
    this.frame = [...this.slides];
    this.totalSlides = this.slides.length;
    this.visibleSlides = 5;
    this.transitionTime = 0.1;
    this.slidesToTransition = 1;
    this.leftIndex = 0;
    this.rightIndex = this.visibleSlides - 1;
    // always use setDirection function instead of
    // directly modifying 'direction' and 'prevDirection'
    this.direction = 'none';
    this.prevDirection = 'none';
    this.gapInRem = 1;
    this.init();
  }

  init() {
    // this.attachEventListenersToSlides();
    this.toggleSliderControlVisibility();
    this.setSlideWidth();
    this.loadFrame();
    this.hideInvisibleSlides(this);
  }

  setDirection(dir) {
    this.prevDirection = this.direction;
    this.direction = dir;
  }

  setSlideWidth() {
    const btnWidth = this.previousBtn.offsetWidth;
    const totalWidth = this.slider.offsetWidth - 2 * btnWidth - remToPx(1) * (this.visibleSlides - 1);
    const slideWidth = totalWidth / this.visibleSlides;
    this.slides.forEach((slide) => (slide.style.width = `${slideWidth}px`));
  }

  loadFrame() {
    this.frame.splice(this.visibleSlides);
    this.slider.innerHTML = '';
    this.slider.append(...this.frame.map((node) => node.cloneNode(true)));
  }

  // set left and right index of the visible slides
  setIndices(dir) {
    if (dir === 'next') {
      this.leftIndex = (this.leftIndex + this.slidesToTransition) % this.totalSlides;
      this.rightIndex = (this.rightIndex + this.slidesToTransition) % this.totalSlides;
    } else if (dir === 'prev') {
      this.leftIndex = (this.leftIndex - this.slidesToTransition + this.totalSlides) % this.totalSlides;
      this.rightIndex = (this.rightIndex - this.slidesToTransition + this.totalSlides) % this.totalSlides;
    }
  }

  // remove invisible slides
  trimFrame() {
    if (this.frame.length > this.visibleSlides) {
      if (this.prevDirection === 'next') {
        this.frame.splice(0, 2 * this.slidesToTransition);
      } else if (this.prevDirection === 'prev') {
        this.frame.splice(this.visibleSlides, 2 * this.slidesToTransition);
      }
    }
  }

  // handle slider navigation
  handleNavigation(self, dir) {
    self.setDirection(dir);
    self.trimFrame();
    let lIndex = self.leftIndex;
    let rIndex = self.rightIndex;
    self.setIndices(dir);

    for (let i = 0; i < self.slidesToTransition; i++) {
      lIndex = lIndex - 1;
      rIndex = rIndex + 1;
      if (lIndex < 0) lIndex = self.totalSlides - 1;
      if (rIndex > self.totalSlides - 1) rIndex = 0;
      self.frame.splice(0, 0, self.slides[lIndex]);
      self.frame.splice(self.frame.length, 0, self.slides[rIndex]);
    }

    self.updateSlider();
  }

  updateSlider() {
    const transitionWidth = (this.slider.children[0].offsetWidth + remToPx(this.gapInRem)) * this.slidesToTransition;
    const endPos = this.direction === 'next' ? transitionWidth * -1 : transitionWidth;
    this.slider.innerHTML = '';
    this.slider.style.transition = 'none';
    this.slider.style.transform = `translateX(0px)`;
    void this.slider.offsetWidth; // Force a reflow
    this.slider.style.transition = `transform ${this.transitionTime}s ease-in-out`;
    this.slider.append(...this.frame.map((node) => node.cloneNode(true)));
    void this.slider.offsetWidth; // Force a reflow
    this.slider.style.transform = `translateX(${endPos}px)`;
  }

  getSlider() {
    const self = this;
    const slider = document.querySelector(`#slider-${self.sectionId}`);
    if (!slider.dataset.has_transitionend_listener) {
      slider.addEventListener('transitionend', self.hideInvisibleSlides.bind(slider, self));
      slider.dataset.has_transitionend_listener = true;
    }
    return slider;
  }

  getPreviousButton() {
    const self = this;
    const btn = document.querySelector(`#btn-prev-${self.sectionId}`);
    if (!btn.dataset.has_click_listener) {
      btn.addEventListener('click', self.handleNavigation.bind(btn, self, 'prev'));
      btn.dataset.has_click_listener = true;
    }
    return btn;
  }

  getNextButton() {
    const self = this;
    const btn = document.querySelector(`#btn-next-${self.sectionId}`);
    if (!btn.dataset.has_click_listener) {
      btn.addEventListener('click', self.handleNavigation.bind(btn, self, 'next'));
      btn.dataset.has_click_listener = true;
    }
    return btn;
  }

  getCurrentSlides() {
    return document.querySelectorAll(`#slider-item-${this.sectionId}`);
  }

  handleSlideClick(self) {
    var link = this.dataset.link;
    if (link) {
      window.location.href = link;
    }
  }

  hideInvisibleSlides(self) {
    // const updatedSlides = [...self.getCurrentSlides()];
    // const slidesToHide = [];
    // for (let i = 0; i < self.slidesToTransition; i++) {
    //   slidesToHide.push(updatedSlides[i], updatedSlides[updatedSlides.length - i - 1]);
    // }
    // slidesToHide.forEach((slide) => self.hideSlide(slide));
  }

  hideSlide(slide) {
    slide.style.opacity = '0';
    slide.style.pointerEvents = 'none';
  }

  showSlide(slide) {
    slide.style.opacity = '1';
    slide.style.pointerEvents = 'auto';
  }

  // attachEventListenersToSlides() {
  //   const self = this;
  //   self.getCurrentSlides().forEach(function (slide) {
  //     slide.addEventListener('click', self.handleSlideClick.bind(slide, self));
  //   });
  // }

  // removeEventListenersFromSlides() {
  //   const self = this;
  //   self.getCurrentSlides().forEach(function (slide) {
  //     slide.removeEventListener('click', self.handleSlideClick.bind(slide, self));
  //   });
  // }

  toggleSliderControlVisibility() {
    if (this.visibleSlides < this.totalSlides) {
      this.previousBtn.style.display = 'block';
      this.nextBtn.style.display = 'block';
    } else {
      this.previousBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    }
  }
}
