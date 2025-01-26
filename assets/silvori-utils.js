// Throttle function
function throttle(func, delay = 500) {
  let shouldWait = false;
  let waitingArgs;
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      func(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    func(...args);
    shouldWait = true;
    setTimeout(timeoutFunc, delay);
  };
}

function remToPx(rem) {
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * rootFontSize;
}
