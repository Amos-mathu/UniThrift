// checkout.js - Handles checkout flow, order summary, and confirmation
console.log('Cart from localStorage:', localStorage.getItem('cart'));
const orderSummary = document.getElementById('orderSummary');
const cartCountBadge = document.getElementById('cartCount');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
renderOrderSummary();
updateCartCount();

function renderOrderSummary() {
    if (cart.length === 0) {
        orderSummary.innerHTML = '<div class="alert alert-info">Your cart is empty.</div>';
        return;
    }
    let total = 0;
    orderSummary.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${item.title}</strong> <span class="badge bg-secondary ms-2">x${item.quantity}</span>
                </div>
                <div>Ksh ${itemTotal.toLocaleString()}</div>
            </div>
        `;
    }).join('') + `<hr><div class="d-flex justify-content-between align-items-center"><strong>Total</strong><strong>Ksh ${total.toLocaleString()}</strong></div>`;
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountBadge) cartCountBadge.textContent = totalItems;
}

// Shipping form validation and order confirmation
document.getElementById('shippingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
        Swal.fire({ icon: 'error', title: 'Cart is empty', text: 'Please add items to your cart before checking out.' });
        return;
    }

    // Prepare order data
    const newOrder = {
        orderId: Date.now(), // unique order id using timestamp
        date: new Date().toISOString().split('T')[0], // format YYYY-MM-DD
        items: cart.map(item => `${item.title} x${item.quantity}`).join(', '),
        totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'Processing' // default order status
    };

    // Get existing orders or empty array
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    Swal.fire({
        icon: 'success',
        title: 'Order Confirmed!',
        text: 'Thank you for your purchase. Your order has been placed successfully.',
        confirmButtonText: 'OK',
        timer: 2500
    }).then(() => {
        // Clear cart after successful checkout
        localStorage.removeItem('cart');
        window.location.href = 'orders.html';
    });
});
