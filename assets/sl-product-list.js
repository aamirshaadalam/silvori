class SlProductList {
  static DIR_NEXT = 'next';
  static DIR_PREV = 'prev';
  static DIR_NONE = 'none';

  constructor(sectionId) {
    this.sectionId = sectionId;
    this.sliderHandle = `#slider-${sectionId}`;
    this.slideHandle = `#slider-item-${sectionId}`;
    this.prevBtnHandle = `#btn-prev-${sectionId}`;
    this.nextBtnHandle = `#btn-next-${sectionId}`;
    this.previousBtn = this.getPreviousButton();
    this.nextBtn = this.getNextButton();
    this.slider = this.getSlider();
    this.slides = this.getCurrentSlides();
    this.frame = [...this.slides];
    this.totalSlides = this.slides.length;
    this.visibleSlides = 5;
    this.transitionTime = 0.3;
    this.slidesToTransition = 1;
    this.leftIndex = 0;
    this.rightIndex = this.visibleSlides - 1;
    // always use 'setDirection' function instead of
    // directly modifying 'direction' and 'prevDirection'
    this.direction = 'none';
    this.prevDirection = 'none';
    this.gapInpx = remToPx(1);
    this.init();
  }

  init() {
    this.toggleSliderControlVisibility();
    this.setSlideWidth();
    this.frame.splice(this.visibleSlides);
    this.updateSlider();
  }

  setDirection(dir) {
    this.prevDirection = this.direction;
    this.direction = dir;
  }

  setSlideWidth() {
    const btnWidth = this.previousBtn.offsetWidth;
    const totalWidth = this.slider.offsetWidth - 2 * btnWidth - this.gapInpx * (this.visibleSlides - 1);
    const slideWidth = totalWidth / this.visibleSlides;
    this.slides.forEach((slide) => (slide.style.width = `${slideWidth}px`));
  }

  // set left and right index of the visible slides
  setIndices(dir) {
    if (dir === SlProductList.DIR_NEXT) {
      this.leftIndex = (this.leftIndex + this.slidesToTransition) % this.totalSlides;
      this.rightIndex = (this.rightIndex + this.slidesToTransition) % this.totalSlides;
    } else if (dir === SlProductList.DIR_PREV) {
      this.leftIndex = (this.leftIndex - this.slidesToTransition + this.totalSlides) % this.totalSlides;
      this.rightIndex = (this.rightIndex - this.slidesToTransition + this.totalSlides) % this.totalSlides;
    }
  }

  // remove invisible slides
  trimFrame() {
    if (this.frame.length > this.visibleSlides) {
      if (this.prevDirection === SlProductList.DIR_NEXT) {
        this.frame.splice(0, 2 * this.slidesToTransition);
      } else if (this.prevDirection === SlProductList.DIR_PREV) {
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

  getEndPos() {
    const transitionWidth = (this.slider.children[0].offsetWidth + this.gapInpx) * this.slidesToTransition;
    if (this.direction === SlProductList.DIR_NEXT) return transitionWidth * -1;
    if (this.direction === SlProductList.DIR_PREV) return transitionWidth;
    return 0;
  }

  updateSlider() {
    this.removeEventListenersFromSlides();
    this.slider.innerHTML = '';
    this.slider.style.transition = 'none';
    this.slider.style.transform = `translateX(0px)`;
    void this.slider.offsetWidth; // Force a reflow
    this.slider.style.transition = `transform ${this.transitionTime}s ease-in-out`;
    this.slider.append(...this.frame.map((node) => node.cloneNode(true)));
    this.attachEventListenersToSlides();
    void this.slider.offsetWidth; // Force a reflow
    this.slider.style.transform = `translateX(${this.getEndPos()}px)`;
  }

  getSlider() {
    const self = this;
    const slider = document.querySelector(self.sliderHandle);
    if (!slider.dataset.has_transitionend_listener) {
      slider.addEventListener('transitionend', self.hideInvisibleSlides.bind(slider, self));
      slider.dataset.has_transitionend_listener = true;
    }
    return slider;
  }

  getPreviousButton() {
    const self = this;
    const btn = document.querySelector(self.prevBtnHandle);
    if (!btn.dataset.has_click_listener) {
      btn.addEventListener('click', self.handleNavigation.bind(btn, self, SlProductList.DIR_PREV));
      btn.dataset.has_click_listener = true;
    }
    return btn;
  }

  getNextButton() {
    const self = this;
    const btn = document.querySelector(self.nextBtnHandle);
    if (!btn.dataset.has_click_listener) {
      btn.addEventListener('click', self.handleNavigation.bind(btn, self, SlProductList.DIR_NEXT));
      btn.dataset.has_click_listener = true;
    }
    return btn;
  }

  getCurrentSlides() {
    return document.querySelectorAll(this.slideHandle);
  }

  handleSlideClick() {
    var link = this.dataset.link;
    if (link) {
      window.location.href = link;
    }
  }

  hideInvisibleSlides(self) {
    const updatedSlides = [...self.getCurrentSlides()];

    if (self.direction === SlProductList.DIR_NEXT) {
      for (let i = 0; i < 2 * self.slidesToTransition; i++) {
        self.hideSlide(updatedSlides[i]);
      }
    } else if (self.direction === SlProductList.DIR_PREV) {
      for (let i = 0; i < 2 * self.slidesToTransition; i++) {
        self.hideSlide(updatedSlides[updatedSlides.length - 1 - i]);
      }
    }
  }

  hideSlide(slide) {
    slide.style.opacity = '0';
    slide.style.pointerEvents = 'none';
  }

  showSlide(slide) {
    slide.style.opacity = '1';
    slide.style.pointerEvents = 'auto';
  }

  attachEventListenersToSlides() {
    const self = this;
    self.getCurrentSlides().forEach(function (slide) {
      slide.addEventListener('click', self.handleSlideClick.bind(slide));
    });
  }

  removeEventListenersFromSlides() {
    const self = this;
    self.getCurrentSlides().forEach(function (slide) {
      slide.removeEventListener('click', self.handleSlideClick.bind(slide));
    });
  }

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
