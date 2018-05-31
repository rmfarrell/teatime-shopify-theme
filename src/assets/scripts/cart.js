import { cart as cartEvents } from './events'
import { $, $$, each, delegate } from './utilities';
import fetch from 'unfetch';

export function Cart(onUpdate = function () { }) {
  const $container = $('#shopping-cart');
  const $tray = $('#shopping-cart-tray');
  const openClass = 'open';
  let itemCount = 0;

  window.addEventListener('matchabar:cart:update', _onUpdate)
  window.addEventListener('matchabar:cart:open', _onOpen)
  window.addEventListener('matchabar:cart:close', _onClose)

  // -- Init
  update()
  _attachHandlers()

  function update() {
    return _fetch()
      .then((res) => {

        // hide empty cart
        if (!itemCount) dispatchEvent(cartEvents.close)

        // render html
        $container.innerHTML = _render(res);
        return onUpdate(res);
      })

      // redirect to cart page
      // TODO: style cart page.
      .catch((e) => {
        console.log(e)
        window.location.replace('/cart')
      })
  }

  function open() {
    $tray.classList.add(openClass)
  }

  function close() {
    $tray.classList.remove(openClass)
  }

  function _fetch() {
    return fetch('/cart.js', {
      credentials: 'include'
    })
      .then((res) => {
        if (res.status >= 200 && res.status < 400) return res.json()
        throw new Error(`could not complete request response ${res.status}`)
      })
  }

  function _onOpen() {
    open()
  }

  function _onUpdate() {
    return update().then(() => open())
  }

  function _onClose() {
    close()
  }

  function _render(res) {
    const totalPrice = (res.total_price / 100).toFixed(2)
    let $$items = []
    res.items.forEach((item) => {
      $$items.push(__renderItem(item))
    })
    return (`
      <h1>My Cart</h1>
      <form action="/cart" method="post" novalidate>
        ${$$items.join('')}
        <h2>Subtotal $${totalPrice}</h2>
        <input type="submit" name="checkout" class="cta" value="checkout">
      </form>
    `)


    function __renderItem(item) {
      const { id, title, image, quantity } = item
      return (`
        <div class="product">
          <div class="img-container">
            <img src="${image}" />
          </div>
          <div class="text-container">
            <h3>${title}</h3>
            <p>QTY: ${quantity}</p>
            <a class="remove-product" data-remove-id="${id}" >Remove</a>
          </div>
        </div>
      `)
    }
  }

  function _attachHandlers() {

    // remove the item w id specified
    delegate($container, 'click', '[data-remove-id]', (ev) => {
      ev.preventDefault()
      _remove(ev.target.getAttribute('data-remove-id'))
    })
  }

  function _remove(id = '') {
    // jQuery.post('/cart/update.js', {updates: {794864053: 0, 794864233: 0}})
    return fetch('/cart/change.js', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: `{"id": "${id}", "quantity": 0}`
    })
      .then((res) => res.json())
      .then(() => update())
  }

  return { update, open, close };
}