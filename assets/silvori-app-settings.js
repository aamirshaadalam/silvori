const reviewWidgetSettings = window.review_widget_settings;

if(reviewWidgetSettings){
  // Find the review widget
  const reviewWidget = document.querySelector('div[data-block-handle="review_widget"]');
  
  // Get the review widget's parent
  const reviewWidgetContainer = reviewWidget?.closest('section');
  
  if (reviewWidgetContainer && reviewWidgetSettings.colorScheme.background) {
      const styles = {
        fontFamily: reviewWidgetSettings.bodyFontFamily,
        fontWeight: reviewWidgetSettings.bodyFontWeight,
        backgroundColor: reviewWidgetSettings.colorScheme.background,
      };

    Object.assign(reviewWidgetContainer.style, styles);
  }
}

const carouselSettings = window.reviews_carousel_settings;

// review carousel
if(carouselSettings){
  // section
  const carousel = document.querySelector('div[data-block-handle="featured_carousel"]');
  const parent = carousel?.closest('section');
  
  if (parent && carouselSettings.colorScheme.background) {
    parent.style.fontFamily = carouselSettings.bodyFontFamily;
    parent.style.fontWeight = carouselSettings.bodyFontWeight;
    parent.style.backgroundColor = carouselSettings.colorScheme.background;
    parent.style.paddingTop = '36px';
  }

  // title
  const title = document.querySelector('.jdgm-carousel-title');
  if(title){
    title.style.color = carouselSettings.colorScheme.text;
  }

  // reviews count
  const reviewsCount = document.querySelector('.jdgm-carousel-number-of-reviews');
  if(reviewsCount){
    reviewsCount.style.color = carouselSettings.colorScheme.text;
  }

  // container
  const container = document.querySelector('.jdgm-carousel__item-container');
  if(container) {
    container.style.backgroundColor = carouselSettings.containerColorScheme.background;
    container.style.color = carouselSettings.containerColorScheme.text;
    container.style.borderColor = carouselSettings.containerColorScheme.background;
  }
/*
  //jdgm-carousel__left-arrow
  // left arrow
  const leftArrow = document.querySelector('.jdgm-carousel__left-arrow');
  if(leftArrow){
    leftArrow.style.borderColor = carouselSettings.containerColorScheme.background;
  }
  
  //jdgm-carousel__right-arrow
  // right arrow
  const rightArrow = document.querySelector('.jdgm-carousel__right-arrow');
  if(rightArrow){
    rightArrow.style.borderColor = carouselSettings.containerColorScheme.background;
  }*/
}

