document.addEventListener('DOMContentLoaded', function () {
  const sliderSection = document.querySelector('.slider-section');
  const sliderControls = document.querySelector('.slider-controls');

  function handleSlideItemClick() {
    var link = this.getAttribute('link_url');
    if (link) {
      window.location.href = link;
    }
  }

  document.querySelectorAll('.slider-item').forEach(function (item) {
    item.addEventListener('click', handleSlideItemClick.bind(item));
  });

  /******************** SLIDER NAVIGATION BEGIN ************************************/

  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slider-item');
  const frame = [...slides];
  const totalSlides = slides.length;
  let startIndex = 0;
  let direction = 'prev';

  function setSlideVisibility() {
    const slidesPerView = getSlidesPerView();
    const updatedSlides = document.querySelectorAll('.slider-item');
    updatedSlides.forEach((slide, index) => {
      if ((direction === 'next' && index < slidesPerView) || (direction === 'prev' && index >= slidesPerView)) {
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
  function updateSlider(slidesPerView) {
    const sliderWidth = slider.children[0].offsetWidth * slidesPerView;
    const position = direction === 'next' ? sliderWidth * -1 : 0;
    const resetPos = direction === 'next' ? 0 : sliderWidth * -1;
    // show all hidden slides before transition
    frame.forEach((slide) => showSlide(slide));
    slider.innerHTML = '';
    slider.style.transition = 'none';
    slider.style.transform = `translateX(${resetPos}px)`;
    // Force a reflow to ensure the browser registers the initial state
    void slider.offsetWidth;
    slider.style.transition = `transform 1s ease-in-out`;
    slider.append(...frame.map((node) => node.cloneNode(true)));
    void slider.offsetWidth;
    slider.style.transform = `translateX(${position}px)`;
  }

  function hideSlide(slide) {
    slide.style.opacity = '0'; // Hide partially visible slides
    slide.style.pointerEvents = 'none'; // Disable interactions
  }

  function showSlide(slide) {
    slide.style.opacity = '1'; // Hide partially visible slides
    slide.style.pointerEvents = 'auto'; // Disable interactions
  }

  // handle next arrow click
  function shiftNext() {
    direction = 'next';
    const slidesPerView = getSlidesPerView();
    startIndex = (startIndex + slidesPerView) % totalSlides;
    for (let i = 0; i < slidesPerView; i++) {
      const index = (startIndex + i) % totalSlides;
      frame.push(slides[index]);
    }
    const maxCount = 2 * slidesPerView;
    while (frame.length > maxCount) {
      frame.shift();
    }
    updateSlider(slidesPerView);
  }

  // handle previous arrow click
  function shiftPrevious() {
    direction = 'prev';
    const slidesPerView = getSlidesPerView();
    startIndex = (startIndex - slidesPerView + totalSlides) % totalSlides;
    const prevArr = [];
    for (let i = 0; i < slidesPerView; i++) {
      const index = (startIndex + i) % totalSlides;
      prevArr.push(slides[index]);
      frame.unshift(...prevArr);
    }
    const maxCount = 2 * slidesPerView;
    while (frame.length > maxCount) {
      frame.pop();
    }
    updateSlider(slidesPerView);
  }

  document.querySelector('.slider-controls .prev').addEventListener('click', shiftPrevious);
  document.querySelector('.slider-controls .next').addEventListener('click', shiftNext);
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
  sliderControls.style.display = 'none';
  if (sliderSection.scrollWidth > sliderSection.clientWidth) {
    sliderControls.style.display = 'flex';
  }
  /******************** SHOW/HIDE SLIDER CONTROLS END ************************************/
});
