class SlProductList {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.previousBtn = this.getPreviousButton();
    this.nextBtn = this.getNextButton();
    this.slider = this.getSlider();
    this.slides = this.getCurrentSlides();
    this.frame = [...this.slides];
    this.totalSlides = this.slides.length;
    this.transitionTime = 0.1;
    this.slidesToTransition = 1;
    this.startIndex = 0;
    this.direction = 'prev';
    this.init();
  }

  init() {
    this.attachEventListenersToSlides();
    this.toggleSlideVisibility(this);
    this.toggleSliderControlVisibility();
  }

  getSlider() {
    const self = this;
    const slider = document.querySelector(`#slider-${self.sectionId}`);
    if (!slider.dataset.has_transitionend_listener) {
      slider.addEventListener('transitionend', self.toggleSlideVisibility.bind(slider, self));
      slider.dataset.has_transitionend_listener = true;
    }
    return slider;
  }

  getPreviousButton() {
    const self = this;
    const btn = document.querySelector(`#btn-prev-${self.sectionId}`);
    if (!btn.dataset.has_click_listener) {
      btn.addEventListener('click', self.handlePreviousClick.bind(btn, self));
      btn.dataset.has_click_listener = true;
    }
    return btn;
  }

  getNextButton() {
    const self = this;
    const btn = document.querySelector(`#btn-next-${self.sectionId}`);
    if (!btn.dataset.has_click_listener) {
      btn.addEventListener('click', self.handleNextClick.bind(btn, self));
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

  getVisibleSlides() {
    const sliderWidth = this.slider.offsetWidth;
    if (sliderWidth < 640) return 1;
    if (sliderWidth < 768) return 2;
    if (sliderWidth < 1024) return 3;
    if (sliderWidth < 1280) return 4;
    return 5;
  }

  toggleSlideVisibility(self) {
    const visibleSlides = self.getVisibleSlides();
    const updatedSlides = self.getCurrentSlides();
    updatedSlides.forEach((slide, index) => {
      if (
        (self.direction === 'next' && index < self.slidesToTransition) ||
        (self.direction === 'prev' && index >= visibleSlides)
      ) {
        self.hideSlide(slide);
      } else {
        self.showSlide(slide);
      }
    });
  }

  updateSlider() {
    const transitionWidth = this.slider.children[0].offsetWidth * this.slidesToTransition;
    const endPos = this.direction === 'next' ? transitionWidth * -1 : 0;
    const startPos = this.direction === 'next' ? 0 : transitionWidth * -1;
    this.frame.forEach((slide) => this.showSlide(slide));
    this.removeEventListenersFromSlides();
    this.slider.innerHTML = '';
    this.slider.style.transition = 'none';
    this.slider.style.transform = `translateX(${startPos}px)`;
    void this.slider.offsetWidth; // Force a reflow
    this.slider.style.transition = `transform ${this.transitionTime}s ease-in-out`;
    this.slider.append(...this.frame.map((node) => node.cloneNode(true)));
    this.attachEventListenersToSlides();
    void this.slider.offsetWidth; // Force a reflow
    this.slider.style.transform = `translateX(${endPos}px)`;
  }

  hideSlide(slide) {
    slide.style.opacity = '0';
    slide.style.pointerEvents = 'none';
  }

  showSlide(slide) {
    slide.style.opacity = '1';
    slide.style.pointerEvents = 'auto';
  }

  handleNextClick(self) {
    const visibleSlides = self.getVisibleSlides();
    if (self.slidesToTransition >= visibleSlides) {
      self.slidesToTransition = visibleSlides;
    }
    self.direction = 'next';
    self.startIndex = (self.startIndex + self.slidesToTransition) % self.totalSlides;
    for (let i = 0; i < visibleSlides; i++) {
      const index = (self.startIndex + i) % self.totalSlides;
      self.frame.push(self.slides[index]);
    }
    const maxCount = visibleSlides + self.slidesToTransition;
    if (self.frame.length > maxCount) {
      self.frame.splice(0, self.frame.length - maxCount);
    }
    self.updateSlider();
  }

  handlePreviousClick(self) {
    self.direction = 'prev';
    const visibleSlides = self.getVisibleSlides();
    if (self.slidesToTransition >= visibleSlides) {
      self.slidesToTransition = visibleSlides;
    }
    self.startIndex = (self.startIndex - self.slidesToTransition + self.totalSlides) % self.totalSlides;
    const prevArr = [];
    for (let i = 0; i < visibleSlides; i++) {
      const index = (self.startIndex + i) % self.totalSlides;
      prevArr.push(self.slides[index]);
    }
    self.frame.unshift(...prevArr);
    const maxCount = visibleSlides + self.slidesToTransition;
    self.frame.splice(maxCount);
    self.updateSlider();
  }

  attachEventListenersToSlides() {
    const self = this;
    self.getCurrentSlides().forEach(function (slide) {
      slide.addEventListener('click', self.handleSlideClick.bind(slide, self));
    });
  }

  removeEventListenersFromSlides() {
    const self = this;
    self.getCurrentSlides().forEach(function (slide) {
      slide.removeEventListener('click', self.handleSlideClick.bind(slide, self));
    });
  }

  toggleSliderControlVisibility() {
    const visibleSlides = this.getVisibleSlides();
    if (visibleSlides < this.totalSlides) {
      this.previousBtn.style.display = 'block';
      this.nextBtn.style.display = 'block';
    } else {
      this.previousBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    }
  }
}
