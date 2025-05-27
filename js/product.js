function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'), 10);
}

function renderProductDetail(product) {
    const productDetail = document.getElementById('productDetail');
    if (!product) {
        productDetail.innerHTML = '<div class="col-12"><div class="alert alert-danger">Product not found.</div></div>';
        return;
    }
    productDetail.innerHTML = `
        <div class="col-md-6">
            <div class="swiper product-swiper detail">
                <div class="swiper-wrapper">
                    ${product.images.map(img => `
                        <div class="swiper-slide">
                            <img src="${img}" class="product-card-img detail" alt="${product.title}">
                        </div>
                    `).join('')}
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </div>
        <div class="col-md-6">
            <h2 class="fw-bold mb-2">${product.title}</h2>
            <p class="price mb-2">KSh ${product.price.toLocaleString()}</p>
            <span class="badge category-badge ${product.category.toLowerCase().replace(/\s+/g, '-') } mb-2">${product.category}</span>
            <p class="mb-2"><i class="fas fa-map-marker-alt me-2"></i>${product.location}</p>
            <p class="mb-2"><i class="fas fa-calendar-alt me-2"></i>Posted: ${product.postedDate}</p>
            <p class="mb-3">${product.description}</p>
            <p class="mb-2"><strong>Seller:</strong> ${product.seller}</p>
            <p class="mb-3"><strong>Condition:</strong> ${product.condition}</p>
            <div class="product-card-buttons d-flex flex-row justify-content-start gap-2 mb-3">
                <button class="btn btn-primary btn-sm flex-fill" id="addToCartBtn">
                    <i class="fas fa-cart-plus me-1"></i> Cart
                </button>
                <button class="btn btn-outline-success btn-sm flex-fill" id="contactSellerBtn">
                    <i class="fas fa-envelope me-1"></i> Contact
                </button>
                <a href="tel:+254${Math.floor(Math.random() * 900000000 + 100000000)}" class="btn btn-success btn-sm flex-fill">
                    <i class="fas fa-phone me-1"></i> Call
                </a>
                <a href="https://wa.me/254${Math.floor(Math.random() * 900000000 + 100000000)}" target="_blank" class="btn btn-success btn-sm flex-fill">
                    <i class="fab fa-whatsapp me-1"></i> WhatsApp
                </a>
                <button class="btn btn-outline-danger btn-sm flex-fill" data-bs-toggle="modal" data-bs-target="#reportModal">
                    <i class="fas fa-flag me-1"></i> Report
                </button>
            </div>
        </div>
    `;

    if (typeof Swiper !== 'undefined') {
        new Swiper('.product-swiper.detail', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    } else {
        console.warn('Swiper not loaded.');
    }

    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => addToCart(product.id));
    }

    const contactSellerBtn = document.getElementById('contactSellerBtn');
    if (contactSellerBtn) {
        contactSellerBtn.addEventListener('click', () => {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Contact Seller',
                    html: `<p><strong>${product.seller}</strong></p><p>Email: <em>seller${product.id}@unithrift.com</em></p>`,
                    icon: 'info',
                    confirmButtonText: 'Close'
                });
            } else {
                console.warn('SweetAlert2 not loaded');
            }
        });
    }
}

function renderSimilarProducts(currentProduct) {
    const similarProductsContainer = document.getElementById('similarProducts');
    if (!similarProductsContainer) return;

    const similarProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    similarProductsContainer.innerHTML = similarProducts.length === 0
        ? '<p class="text-center text-muted">No similar products found.</p>'
        : similarProducts.map(product => `
            <div class="col-md-6 col-lg-3">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="swiper product-swiper">
                        <div class="swiper-wrapper">
                            ${product.images.map(img => `
                                <div class="swiper-slide">
                                    <img src="${img}" class="product-card-img" alt="${product.title}">
                                </div>
                            `).join('')}
                        </div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <span class="badge category-badge mb-2 ${product.category.toLowerCase().replace(/\s+/g, '-') }">${product.category}</span>
                        <p class="card-text fw-bold">KSh ${product.price.toLocaleString()}</p>
                        <p class="card-text small text-muted">Condition: ${product.condition}</p>
                        <p class="card-text small text-muted">Seller: ${product.seller}</p>
                        <p class="card-text small text-muted">Location: ${product.location}</p>
                        <div class="product-card-buttons d-flex flex-row justify-content-between gap-2">
                            <button class="btn btn-primary add-to-cart flex-fill" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Cart
                            </button>
                            <button class="btn btn-outline-danger add-to-wishlist flex-fill" data-id="${product.id}">
                                <i class="fas fa-heart"></i> Wishlist
                            </button>
                            <a href="product.html?id=${product.id}" class="btn btn-outline-info flex-fill">View</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    if (typeof Swiper !== 'undefined') {
        document.querySelectorAll('.product-swiper:not(.detail)').forEach(swiperElement => {
            new Swiper(swiperElement, {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            });
        });
    }
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartCountBadge = document.getElementById('cartCount');
    if (cartCountBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalItems;
    }
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${product.title} has been added to your cart!`,
            timer: 1800,
            showConfirmButton: false
        });
    }
}

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    if (!wishlist.some(item => item.id === productId)) {
        wishlist.push({ ...product });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: `${product.title} added to wishlist!`,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#dc3545"
            }).showToast();
        }
    } else {
        if (typeof Toastify !== 'undefined') {
            Toastify({
                text: `${product.title} is already in your wishlist!`,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#ffc107"
            }).showToast();
        }
    }
}

function handleReportSubmission(productId) {
    const reportForm = document.getElementById('reportForm');
    const reportReason = document.getElementById('reportReason');
    const reportDetails = document.getElementById('reportDetails');
    const submitReportBtn = document.getElementById('submitReport');
    const product = products.find(p => p.id === productId);

    if (submitReportBtn) {
        submitReportBtn.addEventListener('click', () => {
            if (!reportForm.checkValidity()) {
                reportForm.reportValidity();
                return;
            }
            const reason = reportReason.value;
            const details = reportDetails.value || 'No additional details provided.';
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: `Report submitted for ${product.title}: ${reason}`,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#dc3545"
                }).showToast();
            }
            // Simulate API call or logging
            console.log('Report:', { productId, reason, details });
            const modal = bootstrap.Modal.getInstance(document.getElementById('reportModal'));
            modal.hide();
            reportForm.reset();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromUrl();
    const product = products.find(p => p.id === productId);
    renderProductDetail(product);
    renderSimilarProducts(product);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountBadge = document.getElementById('cartCount');
    if (cartCountBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalItems;
    }

    const similarProductsContainer = document.getElementById('similarProducts');
    if (similarProductsContainer) {
        similarProductsContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.add-to-cart') || e.target.closest('.add-to-wishlist');
            if (!target) return;
            const productId = parseInt(target.dataset.id);
            if (target.classList.contains('add-to-cart')) {
                addToCart(productId);
            } else if (target.classList.contains('add-to-wishlist')) {
                addToWishlist(productId);
            }
        });
    }

    if (product) {
        handleReportSubmission(productId);
    }
});