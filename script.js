// Handle active navigation links
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll("nav a").forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Cart management
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartDisplay() {
  const cartCount = document.querySelector("#cart-count");
  const cartContainer = document.querySelector("#cart-container");
  const cartTotal = document.querySelector("#cart-total");

  // Update the number of items in the cart
  if (cartCount) cartCount.textContent = cart.length;

  // Update the cart contents
  if (cartContainer) {
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty. Start shopping now!</p>";
    } else {
      let total = 0;
      cart.forEach((item, index) => {
        total += parseFloat(item.price); // Calculate total price

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
          </div>
          <button class="btn-remove" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
      });

      cartTotal.textContent = total.toFixed(2); // Display total price
    }
  }
}

function addToCart(product) {
  // Check if the product already exists in the cart
  const existingProduct = cart.find(item => item.id === product.id);
  if (!existingProduct) {
    cart.push(product); // Add new product to the cart
    localStorage.setItem("cart", JSON.stringify(cart)); // Store cart in localStorage
    alert(`${product.name} has been added to your cart.`);
  } else {
    alert("This product is already in your cart.");
  }

  // Update the cart display after adding the item
  updateCartDisplay();
}

function removeFromCart(index) {
  // Remove item from the cart based on index
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
  updateCartDisplay(); // Update cart display
}

// Checkout page updates
function updateCheckoutPage() {
  const checkoutTable = document.querySelector("#checkout-table-body");
  const totalPriceElement = document.querySelector("#total-price");
  let total = 0;

  if (!checkoutTable || !totalPriceElement) return;

  if (cart.length === 0) {
    checkoutTable.innerHTML = "<tr><td colspan='4'>Your cart is empty.</td></tr>";
    totalPriceElement.textContent = "$0.00";
  } else {
    checkoutTable.innerHTML = cart.map(item => {
      const itemTotal = parseFloat(item.price);
      total += itemTotal;
      return `
        <tr>
          <td>${item.name}</td>
          <td>$${item.price}</td>
          <td>1</td> <!-- Assume quantity 1 for simplicity -->
          <td>$${item.price}</td>
        </tr>`;
    }).join("");

    totalPriceElement.textContent = `$${total.toFixed(2)}`;
  }
}

// Form validation
function validateForm(form) {
  const inputs = form.querySelectorAll("input, textarea, select");
  for (const input of inputs) {
    if (!input.checkValidity()) {
      alert(`Please fill out the ${input.placeholder || input.name} correctly.`);
      return false;
    }
  }
  return true;
}

// Handle form submission
document.addEventListener("submit", e => {
  const form = e.target;
  if (!validateForm(form)) e.preventDefault();
  else if (form.id === "checkout-form") {
    alert("Thank you for your purchase!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  }
});

// Initialize cart updates on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();
  updateCheckoutPage();
});
