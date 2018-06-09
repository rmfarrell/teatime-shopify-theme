import { $ } from '../utilities';
import gumshoe from '../gumshoe';

(function (window) {
  const $container = $('#locate-page')
  if (!$container) return;
  gumshoe.init({
    offset: 400
  });


  // -- Smooth scroll
  import('smoothscroll').then((mod) => {
    const SmoothScroll = mod.default
    return new SmoothScroll('a[href*="#"]', {
      offset: 120
    })
  })
    .catch((err) => window.console.log(err))
})(window);
