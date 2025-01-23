// Select elements 
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav ul');

// Toggle the 'show' class on the menu when the button is clicked
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Store cart items in an array
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage or initialize an empty array

// Select DOM elements
const cartCount = document.getElementById('cart-count');
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceContainer = document.getElementById('total-price');

// Event listener for adding items to the cart
document.querySelectorAll('.addCart').forEach(button => {
    button.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item');
        const itemName = menuItem.querySelector('h3').innerText;
        const itemPrice = parseFloat(menuItem.querySelector('.price').innerText.replace('P', ''));
        const itemImage = menuItem.querySelector('img').src;

        addToCart(itemName, itemPrice, itemImage);
    });
});

// Function to add items to the cart
function addToCart(name, price, image) {
    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const newItem = { name, price, image, quantity: 1 };
        cart.push(newItem);
    }

    updateCartDisplay();
    saveCartToLocalStorage();
}

// Function to update the cart display
function updateCartDisplay() {
    // Update the cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Clear current cart items and rebuild the list
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
            <div class="cart-item-details">
                <p>${item.name}</p>
                <p>Price: P${item.price}</p>
                <p>Quantity: <span class="item-quantity">${item.quantity}</span></p>
                <button class="remove-item" data-name="${item.name}">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);

        total += item.price * item.quantity;
    });

    // Update total price
    totalPriceContainer.textContent = total.toFixed(2);

    // Add event listeners for removing items
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemName = e.target.getAttribute('data-name');
            removeFromCart(itemName);
        });
    });
}

// Function to remove items from the cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartDisplay();
    saveCartToLocalStorage();
}

// Function to save the cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load the cart from localStorage on page load
function loadCartFromLocalStorage() {
    updateCartDisplay();
}

// Event listener to toggle cart visibility
cartCount.addEventListener('click', () => {
    cartDropdown.classList.toggle('show');
});

// Initialize the cart display on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();

    const checkoutBtn = document.querySelector('#checkout-btn');

    checkoutBtn.addEventListener('click', () => {
        // Add loading class and show spinner
        checkoutBtn.classList.add('loading');
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        checkoutBtn.appendChild(spinner);

        // Simulate processing time (2 seconds)
        setTimeout(() => {
            // After processing, update button text and state
            checkoutBtn.classList.remove('loading');
            checkoutBtn.classList.add('success');
            checkoutBtn.innerText = 'Ordered Successfully!';

            // Remove the spinner after text change
            spinner.remove();

            // Reset button after 5 seconds
            setTimeout(() => {
                checkoutBtn.classList.remove('success');
                checkoutBtn.innerText = 'Checkout';
            }, 5000);
        }, 2000);
    });
});



