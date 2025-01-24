document.addEventListener('DOMContentLoaded', function () {
  const previousBtn = getPreviousButton();
  const nextBtn = getNextButton();
  const slider = getSlider();
  const slides = getCurrentSlides();
  const frame = [...slides];
  const totalSlides = slides.length;
  const transitionTime = 0.1;
  let slidesToTransition = 1;
  let startIndex = 0;
  let direction = 'prev';

  init();

  function init() {
    attachEventListenersToSlides();
    toggleSlideVisibility();
    toggleSliderControlVisibility();
  }

  function getSlider() {
    const slider = document.querySelector(`#slider-${sectionId}`);
    if (!slider.dataset.has_transitionend_listener) {
      slider.addEventListener('transitionend', toggleSlideVisibility);
      slider.dataset.has_transitionend_listener = true;
    }
    return slider;
  }

  function getPreviousButton() {
    const btn = document.querySelector(`#btn-prev-${sectionId}`);
    if (!btn.dataset.has_click_listener) {
      btn.addEventListener('click', handlePreviousClick);
      btn.dataset.has_click_listener = true;
    }
    return btn;
  }

  function getNextButton() {
    const btn = document.querySelector(`#btn-next-${sectionId}`);
    if (!btn.dataset.has_click_listener) {
      btn.addEventListener('click', handleNextClick);
      btn.dataset.has_click_listener = true;
    }
    return btn;
  }

  function getCurrentSlides() {
    return document.querySelectorAll(`#slider-item-${sectionId}`);
  }

  function handleSlideClick() {
    var link = this.dataset.link;
    if (link) {
      window.location.href = link;
    }
  }

  function getVisibleSlides() {
    const sliderWidth = slider.offsetWidth;
    if (sliderWidth < 640) return 1;
    if (sliderWidth < 768) return 2;
    if (sliderWidth < 1024) return 3;
    if (sliderWidth < 1280) return 4;
    return 5;
  }

  function toggleSlideVisibility() {
    const visibleSlides = getVisibleSlides();
    const updatedSlides = getCurrentSlides();
    updatedSlides.forEach((slide, index) => {
      if ((direction === 'next' && index < slidesToTransition) || (direction === 'prev' && index >= visibleSlides)) {
        hideSlide(slide);
      } else {
        showSlide(slide);
      }
    });
  }

  function updateSlider() {
    const transitionWidth = slider.children[0].offsetWidth * slidesToTransition;
    const endPos = direction === 'next' ? transitionWidth * -1 : 0;
    const startPos = direction === 'next' ? 0 : transitionWidth * -1;
    frame.forEach((slide) => showSlide(slide));
    removeEventListenersFromSlides();
    slider.innerHTML = '';
    slider.style.transition = 'none';
    slider.style.transform = `translateX(${startPos}px)`;
    void slider.offsetWidth; // Force a reflow
    slider.style.transition = `transform ${transitionTime}s ease-in-out`;
    slider.append(...frame.map((node) => node.cloneNode(true)));
    attachEventListenersToSlides();
    void slider.offsetWidth; // Force a reflow
    slider.style.transform = `translateX(${endPos}px)`;
  }

  function hideSlide(slide) {
    slide.style.opacity = '0';
    slide.style.pointerEvents = 'none';
  }

  function showSlide(slide) {
    slide.style.opacity = '1';
    slide.style.pointerEvents = 'auto';
  }

  function handleNextClick() {
    const visibleSlides = getVisibleSlides();
    if (slidesToTransition >= visibleSlides) {
      slidesToTransition = visibleSlides;
    }
    direction = 'next';
    startIndex = (startIndex + slidesToTransition) % totalSlides;
    for (let i = 0; i < visibleSlides; i++) {
      const index = (startIndex + i) % totalSlides;
      frame.push(slides[index]);
    }
    const maxCount = visibleSlides + slidesToTransition;
    if (frame.length > maxCount) {
      frame.splice(0, frame.length - maxCount);
    }
    updateSlider();
  }

  function handlePreviousClick() {
    direction = 'prev';
    const visibleSlides = getVisibleSlides();
    if (slidesToTransition >= visibleSlides) {
      slidesToTransition = visibleSlides;
    }
    startIndex = (startIndex - slidesToTransition + totalSlides) % totalSlides;
    const prevArr = [];
    for (let i = 0; i < visibleSlides; i++) {
      const index = (startIndex + i) % totalSlides;
      prevArr.push(slides[index]);
    }
    frame.unshift(...prevArr);
    const maxCount = visibleSlides + slidesToTransition;
    frame.splice(maxCount);
    updateSlider();
  }

  function attachEventListenersToSlides() {
    getCurrentSlides().forEach(function (slide) {
      slide.addEventListener('click', handleSlideClick.bind(slide));
    });
  }

  function removeEventListenersFromSlides() {
    getCurrentSlides().forEach(function (slide) {
      slide.removeEventListener('click', handleSlideClick.bind(slide));
    });
  }

  function toggleSliderControlVisibility() {
    const visibleSlides = getVisibleSlides();
    if (visibleSlides < totalSlides) {
      previousBtn.style.display = 'block';
      nextBtn.style.display = 'block';
    } else {
      previousBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }
});
