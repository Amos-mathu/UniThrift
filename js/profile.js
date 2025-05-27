// Mock user's listed items (in real app, this would come from backend)
const userListings = [
    {
        id: 1,
        title: "Study Desk",
        price: 4500,
        description: "Spacious desk with storage, perfect for studying.",
        image: "images/desk-1.jpg",
        status: "Active"
    },
    {
        id: 2,
        title: "MacBook Pro 2023",
        price: 89900,
        description: "Used MacBook Pro in excellent condition. 256GB SSD, 16GB RAM.",
        image: "images/macbook-1.jpg",
        status: "Sold"
    }
];

// Load user's listed items
function loadListedItems() {
    const container = document.getElementById('listedItems');
    container.innerHTML = userListings.map(item => `
        <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm">
                <div class="position-relative">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;">
                    <span class="position-absolute top-0 end-0 m-2 badge ${item.status === 'Active' ? 'bg-success' : 'bg-secondary'}">
                        ${item.status}
                    </span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="price mb-2">Ksh ${item.price.toLocaleString()}</p>
                    <p class="card-text text-truncate">${item.description}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="editItem(${item.id})">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteItem(${item.id})">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Edit item
function editItem(itemId) {
    const item = userListings.find(i => i.id === itemId);
    if (!item) return;

    // Populate modal with item data
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editItemTitle').value = item.title;
    document.getElementById('editItemPrice').value = item.price;
    document.getElementById('editItemDescription').value = item.description;

    // Show modal
    new bootstrap.Modal(document.getElementById('editItemModal')).show();
}

// Save item changes
function saveItemChanges() {
    const itemId = parseInt(document.getElementById('editItemId').value);
    const item = userListings.find(i => i.id === itemId);
    if (!item) return;

    // Update item data (in real app, this would be an API call)
    item.title = document.getElementById('editItemTitle').value;
    item.price = parseFloat(document.getElementById('editItemPrice').value);
    item.description = document.getElementById('editItemDescription').value;

    // Hide modal and show success message
    bootstrap.Modal.getInstance(document.getElementById('editItemModal')).hide();
    Toastify({
        text: "Item updated successfully!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "var(--primary-color)"
    }).showToast();

    // Reload items list
    loadListedItems();
}

// Delete item
function deleteItem(itemId) {
    Swal.fire({
        title: 'Delete Item',
        text: 'Are you sure you want to delete this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove item from array (in real app, this would be an API call)
            const index = userListings.findIndex(i => i.id === itemId);
            if (index > -1) userListings.splice(index, 1);

            // Show success message and reload items
            Toastify({
                text: "Item deleted successfully!",
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "#d33"
            }).showToast();

            loadListedItems();
        }
    });
}

// Save profile changes
function saveProfile() {
    // In real app, this would be an API call
    bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
    Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully!',
        timer: 1500,
        showConfirmButton: false
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadListedItems);