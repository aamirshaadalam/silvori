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

  function updateSlider(slidesPerView, direction) {
    const sliderWidth = slider.children[0].offsetWidth * slidesPerView;
    const position = direction === 'next' ? sliderWidth * -1 : 0;
    const resetPos = direction === 'next' ? 0 : sliderWidth * -1;
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

  function shiftNext() {
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
    updateSlider(slidesPerView, 'next');
  }

  function shiftPrevious() {
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
    updateSlider(slidesPerView, 'prev');
  }

  document.querySelector('.slider-controls .prev').addEventListener('click', shiftPrevious);
  document.querySelector('.slider-controls .next').addEventListener('click', shiftNext);

  /******************** SLIDER NAVIGATION END ************************************/

  /******************** SHOW/HIDE SLIDER CONTROLS BEGIN ************************************/
  sliderControls.style.display = 'none';
  if (sliderSection.scrollWidth > sliderSection.clientWidth) {
    sliderControls.style.display = 'flex';
  }
  /******************** SHOW/HIDE SLIDER CONTROLS END ************************************/
});
