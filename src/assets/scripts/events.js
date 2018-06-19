import './polyfills';

// -- Custom Events
const resizeEvent = new CustomEvent('matchabar:resize');
const scrollEvent = new CustomEvent('matchabar:scroll');

const cart = {
  update: new CustomEvent('matchabar:cart:update'),
  open: new CustomEvent('matchabar:cart:open'),
  close: new CustomEvent('matchabar:cart:close'),
}

export {
  resizeEvent,
  cart,
  scrollEvent,
};
