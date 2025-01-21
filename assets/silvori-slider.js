document.addEventListener('DOMContentLoaded', function () {
  function handleSlideItemClick() {
    var link = this.getAttribute('link_url');
    if (link) {
      window.location.href = link;
    }
  }

  document.querySelectorAll('.slider-item').forEach(function (item) {
    item.addEventListener('click', handleSlideItemClick.bind(item));
  });

  /******************** SLIDER ARROWS BEGIN ************************************/

  const container = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slider-item');
  const totalSlides = slides.length;
  let currentIndex = 0;

  function getSlidesPerView() {
    const containerWidth = container.offsetWidth;

    if (containerWidth < 480) {
      return 1;
    } else if (containerWidth < 768) {
      return 2;
    } else if (containerWidth < 1024) {
      return 3;
    } else if (containerWidth < 1280) {
      return 4;
    } else {
      return 5;
    }
  }

  function moveSlide(direction) {
    const slidesPerView = getSlidesPerView();
    container.innerHTML = '';

    if (direction === 'next') {
      currentIndex = (currentIndex + slidesPerView) % totalSlides;
    } else if (direction === 'prev') {
      currentIndex = (currentIndex - slidesPerView + totalSlides) % totalSlides;
    }

    const orderedIndices = [];
    for (let i = 0; i < slidesPerView; i++) {
      const index = (currentIndex + i) % totalSlides;
      orderedIndices.push(index);
    }

    orderedIndices.forEach((index) => {
      container.appendChild(slides[index]);
    });
  }

  document.querySelector('.slider-controls .prev').addEventListener('click', () => moveSlide('prev'));
  document.querySelector('.slider-controls .next').addEventListener('click', () => moveSlide('next'));

  /******************** SLIDER ARROWS END ************************************/
});
