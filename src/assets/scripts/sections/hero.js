import { $$, $, each } from '../utilities'

// delay tab switch
const delay = 350;
const activeCLassName = 'active'

// trigger a push state to highlight each tab
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
})
