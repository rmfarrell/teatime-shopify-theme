import { $ } from '../utilities';
import gumshoe from '../gumshoe';

(function (window) {
  const $container = $('#locate-page')
  if (!$container) return;
  gumshoe.init({
    offset: 400
  });
})(window);
