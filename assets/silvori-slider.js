document.addEventListener('DOMContentLoaded', function () {
  const sliderSection = document.querySelector(`#slider-section-${sectionId}`);
  const previousBtn = document.querySelector(`#btn-prev-${sectionId}`);
  const nextBtn = document.querySelector(`#btn-next-${sectionId}`);

  function handleSlideClick() {
    var link = this.dataset.link;
    if (link) {
      window.location.href = link;
    }
  }

  function attachEventListeners() {
    document.querySelectorAll(`#slider-item-${sectionId}`).forEach(function (slide) {
      slide.addEventListener('click', handleSlideClick.bind(slide));
    });
  }

  function removeEventListeners() {
    document.querySelectorAll(`#slider-item-${sectionId}`).forEach(function (slide) {
      slide.removeEventListener('click', handleSlideClick.bind(slide));
    });
  }

  // attach event listeners on initial load
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
    const transitionWidth = slider.children[0].offsetWidth * slidesToTransition;
    const endPos = direction === 'next' ? transitionWidth * -1 : 0;
    const startPos = direction === 'next' ? 0 : transitionWidth * -1;
    frame.forEach((slide) => showSlide(slide)); // show all hidden slides before transition
    removeEventListeners();
    slider.innerHTML = '';
    slider.style.transition = 'none';
    slider.style.transform = `translateX(${startPos}px)`;
    void slider.offsetWidth; // Force a reflow to ensure the browser registers the initial state
    slider.style.transition = `transform ${transitionTime}s ease-in-out`;
    slider.append(...frame.map((node) => node.cloneNode(true)));
    attachEventListeners();
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

  // handle next arrow click
  function handleNextClick() {
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
    if (frame.length > maxCount) {
      frame.splice(0, frame.length - maxCount);
    }
    updateSlider();
  }

  // handle previous arrow click
  function handlePreviousClick() {
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
    }
    frame.unshift(...prevArr);
    const maxCount = slidesPerView + slidesToTransition;
    frame.splice(maxCount);
    updateSlider();
  }

  previousBtn.addEventListener('click', handlePreviousClick);
  nextBtn.addEventListener('click', handleNextClick);
  slider.addEventListener('transitionend', setSlideVisibility);

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
