// Cart Management System
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    // Add item to cart
    addItem(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return false;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0],
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${product.title} added to cart!`);
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        if (index > -1) {
            const item = this.cart[index];
            this.cart.splice(index, 1);
            this.saveCart();
            this.updateCartCount();
            this.showNotification(`${item.title} removed from cart!`);
            return true;
        }
        return false;
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item && quantity > 0) {
            item.quantity = quantity;
            this.saveCart();
            this.updateCartCount();
            return true;
        }
        return false;
    }

    // Calculate total
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart contents
    getCart() {
        return this.cart;
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Update cart count in UI
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: type === 'success' ? "var(--primary-color)" : "var(--danger-color)",
            stopOnFocus: true
        }).showToast();
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Add to cart function for use in other scripts
function addToCart(productId, quantity = 1) {
    return cartManager.addItem(productId, quantity);
}

// cart.js - Handles cart view, removal, subtotal, and checkout button

const cartItemsContainer = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartCountBadge = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();
renderCart();

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="alert alert-info">Your cart is empty.</div>';
        cartSubtotal.textContent = 'Ksh 0';
        checkoutBtn.classList.add('disabled');
        return;
    }
    checkoutBtn.classList.remove('disabled');
    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="card mb-3">
                <div class="row g-0 align-items-center">
                    <div class="col-md-2">
                        <img src="${item.images[0]}" class="img-fluid rounded-start" alt="${item.title}">
                    </div>
                    <div class="col-md-7">
                        <div class="card-body">
                            <h5 class="card-title mb-1">${item.title}</h5>
                            <p class="mb-1">Ksh ${item.price.toLocaleString()} x ${item.quantity}</p>
                            <p class="mb-1"><span class="badge bg-secondary">${item.condition}</span></p>
                        </div>
                    </div>
                    <div class="col-md-3 text-end pe-4">
                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i> Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    cartSubtotal.textContent = `Ksh ${total.toLocaleString()}`;
}

function removeFromCart(productId) {
    Swal.fire({
        title: 'Remove Item',
        text: 'Are you sure you want to remove this item from your cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
            Toastify({
                text: 'Item removed from cart.',
                duration: 2500,
                gravity: "top",
                position: "right",
                backgroundColor: "#d33",
                stopOnFocus: true
            }).showToast();
        }
    });
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountBadge) cartCountBadge.textContent = totalItems;
}