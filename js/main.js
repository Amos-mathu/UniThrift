document.addEventListener('DOMContentLoaded', () => {
    if (typeof products === 'undefined') {
        console.error('Error: products array is not defined. Ensure data.js is loaded before main.js.');
        document.getElementById('featuredProducts').innerHTML = '<p class="text-center text-danger">Error: Product data not loaded.</p>';
        return;
    }
    console.log('Products loaded:', products);

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
            const wishlistBadge = document.querySelector('#wishlistBtn .badge');
            if (wishlistBadge) {
                wishlistBadge.textContent = wishlist.length;
            }
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: `${product.title} added to wishlist!`,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#dc3545",
                }).showToast();
            }
        } else {
            if (typeof Toastify !== 'undefined') {
                Toastify({
                    text: `${product.title} is already in your wishlist!`,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "#ffc107",
                }).showToast();
            }
        }
    }

    function initializeBadges() {
        const cartCountBadge = document.getElementById('cartCount');
        if (cartCountBadge) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountBadge.textContent = totalItems;
        }
        const wishlistBadge = document.querySelector('#wishlistBtn .badge');
        if (wishlistBadge) {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            wishlistBadge.textContent = wishlist.length;
        }
    }

    function renderProducts(productsToDisplay) {
        const featuredProductsContainer = document.getElementById('featuredProducts');
        if (!featuredProductsContainer) {
            console.error('Error: #featuredProducts container not found.');
            return;
        }
        featuredProductsContainer.innerHTML = '';
        if (productsToDisplay.length === 0) {
            featuredProductsContainer.innerHTML = '<p class="text-center text-muted">No items found.</p>';
            return;
        }
        productsToDisplay.forEach(product => {
            const productCard = `
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
                            <span class="badge category-badge mb-2 ${product.category.toLowerCase().replace(/\s+/g, '-')}">${product.category}</span>
                            <p class="card-text fw-bold">KSh ${product.price.toLocaleString()}</p>
                            <p class="card-text">${product.description}</p>
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
            `;
            featuredProductsContainer.insertAdjacentHTML('beforeend', productCard);
        });

        if (typeof Swiper !== 'undefined') {
            document.querySelectorAll('.product-swiper').forEach(swiperElement => {
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
        } else {
            console.warn('Swiper not loaded.');
        }
    }

    if (document.getElementById('featuredProducts')) {
        console.log('On index.html, rendering products');
        renderProducts(products);

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                console.log('Category selected:', categoryFilter.value);
                const selectedCategory = categoryFilter.value;
                if (selectedCategory === '') {
                    renderProducts(products);
                } else {
                    const filteredProducts = products.filter(product => product.category === selectedCategory);
                    renderProducts(filteredProducts);
                }
            });
        }

        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                const selectedCategory = categoryFilter.value;
                let filteredProducts = products;

                console.log('Search term:', searchTerm, 'Category:', selectedCategory);

                if (selectedCategory !== '') {
                    filteredProducts = products.filter(product => product.category === selectedCategory);
                }

                if (searchTerm) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.title.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm) ||
                        product.seller.toLowerCase().includes(searchTerm)
                    );
                }

                renderProducts(filteredProducts);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    searchBtn.click();
                }
            });
        } else {
            console.warn('searchInput or searchBtn not found');
        }

        const featuredProductsContainer = document.getElementById('featuredProducts');
        if (featuredProductsContainer) {
            featuredProductsContainer.addEventListener('click', (e) => {
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
    }

    initializeBadges();
});