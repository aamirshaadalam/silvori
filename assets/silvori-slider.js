document.addEventListener('DOMContentLoaded', function () {
  const sliderSection = document.querySelector(`#slider-section-${sectionId}`);
  const previousBtn = document.querySelector(`#btn-prev-${sectionId}`);
  const nextBtn = document.querySelector(`#btn-next-${sectionId}`);

  function handleSlideItemClick() {
    var link = this.getAttribute('link_url');
    if (link) {
      window.location.href = link;
    }
  }

  function attachEventListeners() {
    document.querySelectorAll(`#slider-item-${sectionId}`).forEach(function (item) {
      item.addEventListener('click', handleSlideItemClick.bind(item));
    });
  }

  function removeEventListeners() {
    document.querySelectorAll(`#slider-item-${sectionId}`).forEach(function (item) {
      item.removeEventListener('click', handleSlideItemClick.bind(item));
    });
  }

  attachEventListeners();

  /******************** SLIDER NAVIGATION BEGIN ************************************/

  const slider = document.querySelector(`#slider-${sectionId}`);
  const slides = document.querySelectorAll(`#slider-item-${sectionId}`);
  const frame = [...slides];
  const totalSlides = slides.length;
  const transitionTime = 0.1;
  // number of slides to transition
  // will be reset to slides per view if greater than slides per view
  let slidesToTransition = 1;
  let startIndex = 0;
  let direction = 'prev';

  function setSlideVisibility() {
    const slidesPerView = getSlidesPerView();
    const updatedSlides = document.querySelectorAll(`#slider-item-${sectionId}`);
    updatedSlides.forEach((slide, index) => {
      if ((direction === 'next' && index < slidesToTransition) || (direction === 'prev' && index >= slidesPerView)) {
        hideSlide(slide);
      } else {
        showSlide(slide);
      }
    });
  }

  // set visibility on initial load
  setSlideVisibility();

  // get number of visible slides based on screen width
  function getSlidesPerView() {
    const sliderWidth = slider.offsetWidth;

    if (sliderWidth < 480) {
      return 1;
    } else if (sliderWidth < 768) {
      return 2;
    } else if (sliderWidth < 1024) {
      return 3;
    } else if (sliderWidth < 1280) {
      return 4;
    } else {
      return 5;
    }
  }

  // add/remove slides based on current view of the screen
  function updateSlider() {
    const sliderWidth = slider.children[0].offsetWidth * slidesToTransition;
    const position = direction === 'next' ? sliderWidth * -1 : 0;
    const resetPos = direction === 'next' ? 0 : sliderWidth * -1;
    // show all hidden slides before transition
    frame.forEach((slide) => showSlide(slide));
    removeEventListeners();
    slider.innerHTML = '';
    slider.style.transition = 'none';
    slider.style.transform = `translateX(${resetPos}px)`;
    // Force a reflow to ensure the browser registers the initial state
    void slider.offsetWidth;
    slider.style.transition = `transform ${transitionTime}s ease-in-out`;
    slider.append(...frame.map((node) => node.cloneNode(true)));
    attachEventListeners();
    void slider.offsetWidth;
    slider.style.transform = `translateX(${position}px)`;
  }

  function hideSlide(slide) {
    slide.style.opacity = '0';
    slide.style.pointerEvents = 'none';
  }

  function showSlide(slide) {
    slide.style.opacity = '1';
    slide.style.pointerEvents = 'auto';
  }

  // handle next arrow click
  function shiftNext() {
    const slidesPerView = getSlidesPerView();
    if (slidesToTransition >= slidesPerView) {
      slidesToTransition = slidesPerView;
    }
    direction = 'next';
    startIndex = (startIndex + slidesToTransition) % totalSlides;
    for (let i = 0; i < slidesPerView; i++) {
      const index = (startIndex + i) % totalSlides;
      frame.push(slides[index]);
    }
    const maxCount = slidesPerView + slidesToTransition;
    while (frame.length > maxCount) {
      frame.shift();
    }
    updateSlider();
  }

  // handle previous arrow click
  function shiftPrevious() {
    direction = 'prev';
    const slidesPerView = getSlidesPerView();
    if (slidesToTransition >= slidesPerView) {
      slidesToTransition = slidesPerView;
    }
    startIndex = (startIndex - slidesToTransition + totalSlides) % totalSlides;
    const prevArr = [];
    for (let i = 0; i < slidesPerView; i++) {
      const index = (startIndex + i) % totalSlides;
      prevArr.push(slides[index]);
      frame.unshift(...prevArr);
    }
    const maxCount = slidesPerView + slidesToTransition;
    while (frame.length > maxCount) {
      frame.pop();
    }
    updateSlider();
  }

  previousBtn.addEventListener('click', shiftPrevious);
  nextBtn.addEventListener('click', shiftNext);
  window.addEventListener('resize', throttle(handleOrientationChange, 500));
  slider.addEventListener('transitionend', setSlideVisibility);

  // update slider when screen resized or device orientation changes
  function handleOrientationChange() {
    const slidesPerView = getSlidesPerView();
    while (frame.length > 0) {
      frame.pop();
    }
    for (let i = 0; i < slidesPerView; i++) {
      const index = (startIndex + i) % totalSlides;
      frame.push(slides[index]);
    }
    slider.innerHTML = '';
    slider.append(...frame.map((node) => node.cloneNode(true)));
    void slider.offsetWidth;
  }

  /******************** SLIDER NAVIGATION END ************************************/

  /******************** SHOW/HIDE SLIDER CONTROLS BEGIN ************************************/

  if (sliderSection.scrollWidth > sliderSection.clientWidth) {
    previousBtn.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
  } else {
    previousBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
  }
  /******************** SHOW/HIDE SLIDER CONTROLS END ************************************/
});
