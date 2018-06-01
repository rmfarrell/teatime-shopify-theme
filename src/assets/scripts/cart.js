import { cart as cartEvents } from './events'
import { $, $$, each, delegate } from './utilities';
import fetch from 'unfetch';

/**
 * Shopping cart
 * @param {Function} afterUpdate callback for when cart update occurs
 */
export function Cart(afterUpdate = function () { }) {
  const $container = $('#shopping-cart');
  const $tray = $('#shopping-cart-tray');
  const openClass = 'open';
  const shoppingCartEmpty = '<p class="empty">Your shopping cart is currently empty.</p>'
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
        return afterUpdate(res);
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
    const checkout = res.items.length ? `<input type="submit" name="checkout" class="cta" value="checkout">` : ''
    return (`
      <h1>My Cart</h1>
      <form action="/cart" method="post" novalidate>
        ${$$items.length ? $$items.join('') : shoppingCartEmpty}
        <div class="total">
          <h2>Subtotal $${totalPrice}</h2>
          ${checkout}
        </div>
      </form>
    `)


    function __renderItem(item) {
      const { id, title, image, quantity } = item
      return (`
        <div class="product flex-columns">
          <div class="img-container column">
            <img src="${image}" />
          </div>
          <div class="text-container column">
            <h3>${title}</h3>
            <p class="qty">QTY: ${quantity}</p>
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