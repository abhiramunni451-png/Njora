// Data storage key
const STORAGE_KEY = 'ornamentGallery';

// Default data structure
const defaultData = {
    categories: [],
    products: []
};

// Load data from localStorage
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return defaultData;
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Display Categories (for index.html)
function loadCategories() {
    const data = loadData();
    const container = document.getElementById('categoriesContainer');
    
    if (data.categories.length === 0) {
        container.innerHTML = '<p class="no-items">No categories yet. Add some in the admin panel.</p>';
        return;
    }
    
    container.innerHTML = data.categories.map(category => `
        <div class="category-card" onclick="showProducts('${category}')">
            <div class="category-icon">📿</div>
            <h3>${category}</h3>
            <p>${data.products.filter(p => p.category === category).length} items</p>
        </div>
    `).join('');
}

// Show products for selected category
function showProducts(category) {
    const data = loadData();
    const categoryProducts = data.products.filter(p => p.category === category);
    
    document.getElementById('categoriesView').style.display = 'none';
    document.getElementById('productsView').style.display = 'block';
    document.getElementById('categoryTitle').textContent = category;
    
    const container = document.getElementById('productsContainer');
    
    if (categoryProducts.length === 0) {
        container.innerHTML = '<p class="no-items">No products in this category yet.</p>';
        return;
    }
    
    container.innerHTML = categoryProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-description">${product.description}</div>
            </div>
        </div>
    `).join('');
}

// Go back to categories view
function showCategories() {
    document.getElementById('categoriesView').style.display = 'block';
    document.getElementById('productsView').style.display = 'none';
}

// Load admin data
function loadAdminData() {
    const data = loadData();
    
    // Load categories into select dropdown
    const categorySelect = document.getElementById('productCategory');
    categorySelect.innerHTML = '<option value="">Choose a category</option>' + 
        data.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
    // Display categories list
    const categoriesList = document.getElementById('categoriesList');
    if (data.categories.length === 0) {
        categoriesList.innerHTML = '<p>No categories yet. Add your first category above.</p>';
    } else {
        categoriesList.innerHTML = data.categories.map(category => `
            <div class="category-item">
                <span>📁 ${category}</span>
                <button onclick="deleteCategory('${category}')" class="delete-btn">Delete</button>
            </div>
        `).join('');
    }
    
    // Preview all products
    previewProducts(data.products);
}

// Add new category
function addCategory() {
    const input = document.getElementById('categoryName');
    const categoryName = input.value.trim();
    
    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }
    
    const data = loadData();
    
    if (data.categories.includes(categoryName)) {
        alert('Category already exists');
        return;
    }
    
    data.categories.push(categoryName);
    saveData(data);
    
    input.value = '';
    loadAdminData();
}

// Delete category
function deleteCategory(category) {
    if (!confirm(`Delete category "${category}" and all its products?`)) {
        return;
    }
    
    const data = loadData();
    data.categories = data.categories.filter(c => c !== category);
    data.products = data.products.filter(p => p.category !== category);
    saveData(data);
    
    loadAdminData();
}

// Add new product
async function addProduct() {
    const category = document.getElementById('productCategory').value;
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value.trim();
    const imageUrl = document.getElementById('productImageUrl').value.trim();
    const imageFile = document.getElementById('productImageFile').files[0];
    
    if (!category || !name || !price || !description) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (!imageUrl && !imageFile) {
        alert('Please provide an image URL or upload a file');
        return;
    }
    
    let image = imageUrl;
    
    // If file is uploaded, create object URL
    if (imageFile) {
        image = URL.createObjectURL(imageFile);
    }
    
    const data = loadData();
    
    const newProduct = {
        id: Date.now(),
        category,
        name,
        price: parseFloat(price),
        description,
        image
    };
    
    data.products.push(newProduct);
    saveData(data);
    
    // Clear form
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productImageUrl').value = '';
    document.getElementById('productImageFile').value = '';
    
    // Refresh preview
    previewProducts(data.products);
    alert('Product added successfully!');
}

// Preview products in admin
function previewProducts(products) {
    const container = document.getElementById('adminProductsPreview');
    
    if (products.length === 0) {
        container.innerHTML = '<p>No products yet.</p>';
        return;
    }
    
    container.innerHTML = products.slice(-6).reverse().map(product => `
        <div class="preview-item">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            <div><strong>${product.name}</strong></div>
            <div>$${product.price}</div>
            <div><small>${product.category}</small></div>
        </div>
    `).join('');
}
