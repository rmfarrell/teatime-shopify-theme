
/**
 * Automatically style rich text editor content
 */

import { $, $$, each, wrap } from './utilities';
import Macy from 'Macy'

// apply full-width class to p with media tags parents from media tags
const mediaSelectors = ['iframe', 'img', 'video'];
const mediaClass = 'media-container';


// Handle images
// Annoyingly, the rich text editor wraps every thing in a <p> tag be default.
// Much of the below is a workaround for this.
each($$('.rte'), ($rte) => {

  // apply mediaClass to containers that have media
  each($$('p'), (p) => {
    if (p.firstElementChild && p.firstElementChild.matches(mediaSelectors)) {
      p.classList.add('media-container')
    }
  })

  // collect all images
  const gallery = Array.prototype.slice.call($rte.querySelectorAll('img'));

  // The first image gets the hero class 
  const $hero = gallery.shift();
  const $heroWrapper = document.createElement('div')
  $heroWrapper.className = 'rte__hero';
  wrap($hero, $heroWrapper);

  // Create a gallery at the bottom of the page
  if (gallery.length) {
    const $gallery = document.createElement('div')
    $gallery.className = 'rte__gallery';
    $rte.appendChild($gallery);

    // subsequent images are placed in a gallery at the bottom of the page
    gallery.forEach(($img) => {
      $gallery.appendChild($img)
      console.log($img)
    });

    console.log(Object.keys(Macy))

    const macy = Macy({
      container: '.rte__gallery',
      trueOrder: false,
      waitForImages: false,
      margin: 12,
      columns: 2,
      breakAt: {
        520: 2,
        400: 1
      }
    });
  }
});

// Target iframes to make them responsive
const iframeSelectors = [
  '.rte iframe[src*="youtube.com/embed"]',
  '.rte iframe[src*="player.vimeo"]'
]
each($$(...iframeSelectors), ($el) => {
  const wrapper = document.createElement('div')
  wrapper.className = 'rte__video-wrapper'
  wrap($el, wrapper)
})