const API = '/api';
const money = value => '₹' + Number(value).toFixed(2);
let toastTimer;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.style.display = 'none', 2600);
}

async function loadBooks(search = '') {
  const response = await fetch(`${API}/books?search=${encodeURIComponent(search)}`);
  const books = await response.json();
  const list = document.getElementById('book-list');
  if (!books.length) {
    list.innerHTML = '<p>No books found. Try another search.</p>';
    return;
  }
  list.innerHTML = books.map(book => `
    <article class="book-card">
      <div class="cover">${escapeHtml(book.title)}</div>
      <h3>${escapeHtml(book.title)}</h3>
      <p class="author">by ${escapeHtml(book.author)}</p>
      <p class="author">${escapeHtml(book.description)}</p>
      <div class="price-row"><span class="price">${money(book.price)}</span>
      <button class="small-button" onclick="addToCart(${book.id})">Add to cart</button></div>
    </article>`).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

async function addToCart(id) {
  const response = await fetch(`${API}/cart/${id}`, { method: 'POST' });
  const result = await response.json();
  showToast(result.message);
  await loadCart();
}

async function removeFromCart(id) {
  await fetch(`${API}/cart/${id}`, { method: 'DELETE' });
  showToast('Book removed from cart.');
  await loadCart();
}

async function loadCart() {
  const response = await fetch(`${API}/cart`);
  const cart = await response.json();
  const items = cart.items || [];
  document.getElementById('cart-count').textContent = items.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-total').textContent = `Total: ${money(cart.total)}`;
  const content = document.getElementById('cart-content');
  if (!items.length) {
    content.innerHTML = '<p>Your cart is empty. Add a book from the collection above.</p>';
    return;
  }
  content.innerHTML = items.map(item => `
    <div class="cart-row">
      <div><strong>${escapeHtml(item.book.title)}</strong><small>${money(item.book.price)} × ${item.quantity} = ${money(item.subtotal)}</small></div>
      <button class="remove-button" onclick="removeFromCart(${item.book.id})">Remove</button>
    </div>`).join('');
}

async function checkout() {
  const response = await fetch(`${API}/checkout`, { method: 'POST' });
  const result = await response.json();
  showToast(result.message);
  await loadCart();
}

document.getElementById('search').addEventListener('input', event => loadBooks(event.target.value));
document.getElementById('checkout').addEventListener('click', checkout);
loadBooks().catch(() => showToast('Could not load books. Start the Spring Boot application first.'));
loadCart().catch(() => {});
