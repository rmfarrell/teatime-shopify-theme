import { $ } from '../utilities';
import gumshoe from '../gumshoe';

(function (window) {
  const $container = $('#locate-page')
  if (!$container) return;
  import('smoothscroll').then((mod) => {
    const SmoothScroll = mod.default
    scroll = new SmoothScroll('.subnav a[href*="#"]')
    return gumshoe.init();
  })
    .catch((err) => window.console.log(err))
})(window);
