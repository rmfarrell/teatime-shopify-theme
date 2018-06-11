import { $$, $, each, preloadImage } from '../utilities'

// delay tab switch
const delay = 350;
const activeCLassName = 'active'

// -- Trigger a push state to highlight each tab
each($$('.hero'), ($hero) => {
  const $$floaters = $hero.querySelectorAll('.floating-image')
  each($$floaters, ($floater) => {
    $floater.addEventListener('click', (ev) => {
      ev.preventDefault();
      if ($floater.classList.contains(activeCLassName)) return;
      each($$floaters, ($f) => $f.classList.remove(activeCLassName))
      $floater.classList.add(activeCLassName);
      setTimeout(() => {
        history.pushState({}, null, $floater.getAttribute('href'));
      }, delay)
    })
  })
});


// -- Introducing hustle script (homepage)
(function () {
  const $container = $('#introducing-hustle')
  if (!$container) return;
  // TODO: load apng or png
  const $img = $container.querySelector('img')
  const src = $img.getAttribute('data-custom-src')
  preloadImage(src, () => {
    $container.classList.remove('preload')
    setTimeout(() => {
      $container.classList.remove('preload')
      $img.src = src
    }, 600)
  })
})()