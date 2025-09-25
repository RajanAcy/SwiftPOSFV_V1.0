/**
 * @file Main application logic for the Swift POS system.
 * This file handles UI interactions, data management, and business logic.
 * @author Jules
 */

// ===========================
// APP INITIALIZATION
// ===========================

/**
 * An object containing references to all the main view elements in the DOM.
 * @type {Object<string, HTMLElement>}
 */
const views = {
    dashboard: document.getElementById('dashboardView'),
    products: document.getElementById('productsView'),
    sales: document.getElementById('salesView'),
    suppliers: document.getElementById('suppliersView'),
    expenses: document.getElementById('expensesView'),
    customers: document.getElementById('customersView'),
    reports: document.getElementById('reportsView'),
    settings: document.getElementById('settingsView')
};

/**
 * An object containing references to all the main tab button elements.
 * @type {Object<string, HTMLElement>}
 */
const tabButtons = {
    dashboard: document.getElementById('dashboardTab'),
    products: document.getElementById('productsTab'),
    sales: document.getElementById('salesTab'),
    suppliers: document.getElementById('suppliersTab'),
    expenses: document.getElementById('expensesTab'),
    customers: document.getElementById('customersTab'),
    reports: document.getElementById('reportsTab'),
    settings: document.getElementById('settingsTab')
};

// Mobile navigation elements
const mobileNavSelect = document.getElementById('mobileNavSelect');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

/**
 * Chart.js chart instances.
 * @type {Chart}
 */
let salesChart, monthlyProfitChart, bestSellingProductsChart, salesByCategoryChart, monthlyFinancialsChart, monthlyExpensesByCategoryChart;

// ===========================
// DATA MANAGEMENT
// ===========================

/**
 * Initializes the local storage with default empty arrays for data if they don't exist.
 */
function initializeData() {
    if (!localStorage.getItem('products')) localStorage.setItem('products', JSON.stringify([]));
    if (!localStorage.getItem('sales')) localStorage.setItem('sales', JSON.stringify([]));
    if (!localStorage.getItem('suppliers')) localStorage.setItem('suppliers', JSON.stringify([]));
    if (!localStorage.getItem('expenses')) localStorage.setItem('expenses', JSON.stringify([]));
    if (!localStorage.getItem('customers')) localStorage.setItem('customers', JSON.stringify([]));
    if (!localStorage.getItem('companyInfo')) localStorage.setItem('companyInfo', JSON.stringify({ name: 'Swift POS', logo: '', address: '', phone: '' }));
    if (!localStorage.getItem('systemSettings')) localStorage.setItem('systemSettings', JSON.stringify({ currency: 'MMK', taxRate: 0, enableNotifications: true, enableSound: true, storagePreference: { type: 'local', path: '' } }));
    if (!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify(['Tops', 'Dresses', 'Pants', 'Shoes', 'Accessories']));
}

/**
 * Retrieves products from local storage.
 * @returns {Array<Object>} An array of product objects.
 */
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

/**
 * Retrieves sales from local storage.
 * @returns {Array<Object>} An array of sale objects.
 */
function getSales() {
    return JSON.parse(localStorage.getItem('sales')) || [];
}

/**
 * Retrieves suppliers from local storage.
 * @returns {Array<Object>} An array of supplier objects.
 */
function getSuppliers() {
    return JSON.parse(localStorage.getItem('suppliers')) || [];
}

/**
 * Retrieves expenses from local storage.
 * @returns {Array<Object>} An array of expense objects.
 */
function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

/**
 * Retrieves customers from local storage.
 * @returns {Array<Object>} An array of customer objects.
 */
function getCustomers() {
    return JSON.parse(localStorage.getItem('customers')) || [];
}

/**
 * Retrieves company information from local storage.
 * @returns {Object} The company information object.
 */
function getCompanyInfo() {
    return JSON.parse(localStorage.getItem('companyInfo')) || {};
}

/**
 * Retrieves system settings from local storage.
 * @returns {Object} The system settings object.
 */
function getSystemSettings() {
    return JSON.parse(localStorage.getItem('systemSettings')) || {};
}

/**
 * Retrieves product categories from local storage.
 * @returns {Array<string>} An array of category names.
 */
function getCategories() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}

/**
 * Saves an array of products to local storage.
 * @param {Array<Object>} products The array of products to save.
 */
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

/**
 * Saves an array of sales to local storage.
 * @param {Array<Object>} sales The array of sales to save.
 */
function saveSales(sales) {
    localStorage.setItem('sales', JSON.stringify(sales));
}

/**
 * Saves an array of suppliers to local storage.
 * @param {Array<Object>} suppliers The array of suppliers to save.
 */
function saveSuppliers(suppliers) {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
}

/**
 * Saves an array of expenses to local storage.
 * @param {Array<Object>} expenses The array of expenses to save.
 */
function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

/**
 * Saves an array of customers to local storage.
 * @param {Array<Object>} customers The array of customers to save.
 */
function saveCustomers(customers) {
    localStorage.setItem('customers', JSON.stringify(customers));
}

/**
 * Saves the company information object to local storage.
 * @param {Object} info The company information object to save.
 */
function saveCompanyInfo(info) {
    localStorage.setItem('companyInfo', JSON.stringify(info));
}

/**
 * Saves the system settings object to local storage.
 * @param {Object} settings The system settings object to save.
 */
function saveSystemSettings(settings) {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
}

/**
 * Saves the product categories array to local storage.
 * @param {Array<string>} categories The array of category names to save.
 */
function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Formats a number as a currency string based on system settings.
 * @param {number} amount The number to format.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(amount) {
    const settings = getSystemSettings();
    const currency = settings.currency || 'MMK';
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    return formatter.format(amount);
}

/**
 * Displays a toast notification message.
 * @param {string} message The message to display.
 * @param {('info'|'success'|'error'|'warning')} [type='info'] The type of toast notification.
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    } transform transition-all duration-300 ease-in-out translate-x-full`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * Generates a simple unique ID.
 * @returns {string} A unique ID string.
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Validates an email address format.
 * @param {string} email The email to validate.
 * @returns {boolean} True if the email format is valid, false otherwise.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a phone number format.
 * @param {string} phone The phone number to validate.
 * @returns {boolean} True if the phone number format is valid, false otherwise.
 */
function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
}

// ===========================
// VIEW MANAGEMENT
// ===========================

/**
 * Shows a specific view and hides all others. Also triggers data loading for the view.
 * @param {string} viewName The name of the view to show (e.g., 'dashboard', 'products').
 */
function showView(viewName) {
    Object.values(views).forEach(view => view.classList.add('hidden'));
    views[viewName].classList.remove('hidden');

    Object.values(tabButtons).forEach(button => button.classList.remove('active-tab'));
    tabButtons[viewName].classList.add('active-tab');

    mobileNavSelect.value = viewName;
    sidebar.classList.remove('open');
    overlay.classList.remove('open');

    switch (viewName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProducts();
            loadSuppliersForProducts();
            attachCategoryAddHandler();
            break;
        case 'sales':
            loadProductsForSales();
            loadCustomersForSales();
            break;
        case 'suppliers':
            loadSuppliers();
            initializeSupplierPaymentsUI();
            break;
        case 'expenses':
            loadExpenses();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'reports':
            loadReports();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ===========================
// DASHBOARD FUNCTIONALITY
// ===========================

/**
 * Loads all data and updates the dashboard view.
 */
function loadDashboardData() {
    const sales = getSales();
    const products = getProducts();
    const expenses = getExpenses();
    const companyInfo = getCompanyInfo();

    document.getElementById('dashboardCompanyName').textContent = companyInfo.name || 'Swift POS';
    document.getElementById('dashboardCompanyLogo').src = companyInfo.logo || '';

    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const totalProducts = products.length;
    const totalCreditPayments = expenses.filter(expense => expense.category === 'Credit Payment').reduce((sum, expense) => sum + expense.amount, 0);

    document.getElementById('totalSales').textContent = formatCurrency(totalSales);
    document.getElementById('totalProfit').textContent = formatCurrency(totalProfit);
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalCreditPayments').textContent = formatCurrency(totalCreditPayments);

    updateCharts(sales, products, expenses);
    updateAnalytics(sales, products);
    updateSupplierPayments(expenses);
}

/**
 * Updates all charts on the dashboard.
 * @param {Array<Object>} sales - Array of sale objects.
 * @param {Array<Object>} products - Array of product objects.
 * @param {Array<Object>} expenses - Array of expense objects.
 */
function updateCharts(sales, products, expenses) {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getMonthlyTotals = (data, dateField, valueField) => {
        return months.map((_, index) => {
            const monthData = data.filter(item => {
                const itemDate = new Date(item[dateField]);
                return itemDate.getFullYear() === currentYear && itemDate.getMonth() === index;
            });
            return monthData.reduce((sum, item) => sum + (item[valueField] || 0), 0);
        });
    };

    const getMonthlyCategoryTotals = (data, dateField, valueField, categoryField) => {
        const categoryTotals = {};
        data.forEach(item => {
            const itemDate = new Date(item[dateField]);
            if (itemDate.getFullYear() === currentYear) {
                const category = item[categoryField] || 'Uncategorized';
                if (!categoryTotals[category]) {
                    categoryTotals[category] = Array(12).fill(0);
                }
                categoryTotals[category][itemDate.getMonth()] += item[valueField];
            }
        });
        return categoryTotals;
    };

    const monthlyRevenue = getMonthlyTotals(sales, 'date', 'total');
    const monthlyProfit = getMonthlyTotals(sales, 'date', 'profit');
    const monthlyExpenses = getMonthlyTotals(expenses, 'date', 'amount');

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    const salesByDay = last7Days.map(date => {
        const daySales = sales.filter(sale => sale.date === date);
        return daySales.reduce((sum, sale) => sum + sale.total, 0);
    });

    const salesCtx = document.getElementById('salesChart').getContext('2d');
    if (salesChart) salesChart.destroy();
    salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Sales',
                data: salesByDay,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value) } } }
        }
    });

    const profitCtx = document.getElementById('monthlyProfitChart').getContext('2d');
    if (monthlyProfitChart) monthlyProfitChart.destroy();
    monthlyProfitChart = new Chart(profitCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Profit',
                data: monthlyProfit,
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value) } } }
        }
    });

    const productSales = {};
    sales.forEach(sale => sale.items.forEach(item => {
        productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
    }));
    const topProducts = Object.entries(productSales)
        .map(([productId, quantity]) => ({ name: (products.find(p => p.id === productId) || { name: 'Unknown' }).name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    const bestSellingCtx = document.getElementById('bestSellingProductsChart').getContext('2d');
    if (bestSellingProductsChart) bestSellingProductsChart.destroy();
    bestSellingProductsChart = new Chart(bestSellingCtx, {
        type: 'doughnut',
        data: {
            labels: topProducts.map(p => p.name),
            datasets: [{
                data: topProducts.map(p => p.quantity),
                backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    const categorySales = {};
    sales.forEach(sale => sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            categorySales[product.category] = (categorySales[product.category] || 0) + item.total;
        }
    }));
    const categoryCtx = document.getElementById('salesByCategoryChart').getContext('2d');
    if (salesByCategoryChart) salesByCategoryChart.destroy();
    salesByCategoryChart = new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categorySales),
            datasets: [{
                data: Object.values(categorySales),
                backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    const financialsCtx = document.getElementById('monthlyFinancialsChart').getContext('2d');
    if (monthlyFinancialsChart) monthlyFinancialsChart.destroy();
    monthlyFinancialsChart = new Chart(financialsCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Revenue',
                    data: monthlyRevenue,
                    backgroundColor: '#3b82f6',
                    yAxisID: 'y',
                },
                {
                    label: 'Profit',
                    data: monthlyProfit,
                    backgroundColor: '#22c55e',
                    yAxisID: 'y',
                },
                {
                    label: 'Expenses',
                    data: monthlyExpenses,
                    backgroundColor: '#ef4444',
                    yAxisID: 'y',
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: { callback: value => formatCurrency(value) }
                }
            },
            plugins: { legend: { position: 'top' } }
        }
    });

    const monthlyExpensesByCategory = getMonthlyCategoryTotals(expenses, 'date', 'amount', 'category');
    const expenseCategoryCtx = document.getElementById('monthlyExpensesByCategoryChart').getContext('2d');
    if (monthlyExpensesByCategoryChart) monthlyExpensesByCategoryChart.destroy();
    monthlyExpensesByCategoryChart = new Chart(expenseCategoryCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: Object.entries(monthlyExpensesByCategory).map(([category, data], index) => {
                const colors = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981'];
                return {
                    label: category,
                    data: data,
                    borderColor: colors[index % colors.length],
                    backgroundColor: colors[index % colors.length] + '33',
                    fill: false,
                    tension: 0.1
                };
            })
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, ticks: { callback: value => formatCurrency(value) } } }
        }
    });
}

/**
 * Updates the additional analytics sections on the dashboard (top/low/least selling items).
 * @param {Array<Object>} sales - Array of sale objects.
 * @param {Array<Object>} products - Array of product objects.
 */
function updateAnalytics(sales, products) {
    const productSales = {};
    sales.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.productId]) {
                productSales[item.productId] = { quantity: 0, revenue: 0 };
            }
            productSales[item.productId].quantity += item.quantity;
            productSales[item.productId].revenue += item.total;
        });
    });

    const topSellingItems = Object.entries(productSales)
        .map(([productId, data]) => ({ name: (products.find(p => p.id === productId) || { name: 'Unknown' }).name, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

    const topSellingContainer = document.getElementById('topSellingItems');
    if (topSellingItems.length > 0) {
        topSellingContainer.innerHTML = topSellingItems.map((item, index) => `
            <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span class="text-sm font-medium">${index + 1}. ${item.name}</span>
                <span class="text-xs text-gray-600">${item.quantity} sold</span>
            </div>`).join('');
    } else {
        topSellingContainer.innerHTML = '<p class="text-gray-500 text-center">No sales data available</p>';
    }

    const lowStockItems = products.filter(product => product.stock < 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 10);

    const lowStockContainer = document.getElementById('lowStockItems');
    if (lowStockItems.length > 0) {
        lowStockContainer.innerHTML = lowStockItems.map(item => `
            <div class="flex justify-between items-center p-2 bg-red-50 rounded">
                <span class="text-sm font-medium">${item.name}</span>
                <span class="text-xs text-red-600">${item.stock} left</span>
            </div>`).join('');
    } else {
        lowStockContainer.innerHTML = '<p class="text-gray-500 text-center">No low stock items</p>';
    }

    const leastSellingItems = Object.entries(productSales)
        .map(([productId, data]) => ({ name: (products.find(p => p.id === productId) || { name: 'Unknown' }).name, ...data }))
        .filter(item => item.quantity > 0)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 10);

    const leastSellingContainer = document.getElementById('leastSellingItems');
    if (leastSellingItems.length > 0) {
        leastSellingContainer.innerHTML = leastSellingItems.map((item, index) => `
            <div class="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span class="text-sm font-medium">${index + 1}. ${item.name}</span>
                <span class="text-xs text-yellow-600">${item.quantity} sold</span>
            </div>`).join('');
    } else {
        leastSellingContainer.innerHTML = '<p class="text-gray-500 text-center">No sales data available</p>';
    }
}

/**
 * Updates the recent supplier payments list on the dashboard.
 * @param {Array<Object>} expenses - Array of expense objects.
 */
function updateSupplierPayments(expenses) {
    const supplierPayments = expenses
        .filter(expense => expense.category === 'Supplier Payment')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const paymentsContainer = document.getElementById('supplierPaymentsDashboard');
    if (supplierPayments.length > 0) {
        paymentsContainer.innerHTML = supplierPayments.map(payment => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${payment.description || 'Supplier Payment'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(payment.date).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(payment.amount)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${payment.notes || ''}</td>
            </tr>`).join('');
    } else {
        paymentsContainer.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No recent payments</td></tr>';
    }
}

// ===========================
// PRODUCTS FUNCTIONALITY
// ===========================

/**
 * Loads and displays the list of products.
 */
function loadProducts() {
    const products = getProducts();
    const productList = document.getElementById('productList');
    populateProductCategorySelect();

    if (products.length === 0) {
        productList.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No products added yet</td></tr>';
        return;
    }

    productList.innerHTML = products.map(product => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    ${product.image ? `<img src="${product.image}" alt="${product.name}" class="h-10 w-10 rounded-full object-cover mr-3">` : ''}
                    <div>
                        <div class="text-sm font-medium text-gray-900">${product.name}</div>
                        ${product.barcode ? `<div class="text-sm text-gray-500">Barcode: ${product.barcode}</div>` : ''}
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.category}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${product.stock < 10 ? 'text-red-600 font-semibold' : ''}">${product.stock}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(product.buyingPrice)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(product.sellingPrice)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-product" data-id="${product.id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 delete-product" data-id="${product.id}">Delete</button>
            </td>
        </tr>`).join('');

    document.querySelectorAll('.edit-product').forEach(button => button.addEventListener('click', function() { editProduct(this.getAttribute('data-id')); }));
    document.querySelectorAll('.delete-product').forEach(button => button.addEventListener('click', function() { deleteProduct(this.getAttribute('data-id')); }));
}

/**
 * Populates the supplier dropdown in the product form.
 */
function loadSuppliersForProducts() {
    const suppliers = getSuppliers();
    const supplierSelect = document.getElementById('productSupplier');
    supplierSelect.innerHTML = '<option value="">Select a supplier</option>' + suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}

/**
 * Populates the product form with data from an existing product for editing.
 * @param {string} productId The ID of the product to edit.
 */
function editProduct(productId) {
    const product = getProducts().find(p => p.id === productId);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        populateProductCategorySelect();
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productBuyingPrice').value = product.buyingPrice;
        document.getElementById('productSellingPrice').value = product.sellingPrice;
        document.getElementById('productSize').value = product.size || '';
        document.getElementById('productColor').value = product.color || '';
        document.getElementById('productSupplier').value = product.supplierId || '';
        document.getElementById('productBarcode').value = product.barcode || '';
        document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Deletes a product after confirmation.
 * @param {string} productId The ID of the product to delete.
 */
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        saveProducts(getProducts().filter(p => p.id !== productId));
        loadProducts();
        showToast('Product deleted successfully', 'success');
    }
}

/**
 * Resets the product form to its default state.
 */
function resetProductForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    populateProductCategorySelect();
}

/**
 * Attaches an event handler to the 'Add Category' button.
 */
function attachCategoryAddHandler() {
    const addBtn = document.getElementById('addCategoryButton');
    const input = document.getElementById('newCategoryInput');
    if (!addBtn || !input) return;
    addBtn.onclick = function() {
        const newCat = (input.value || '').trim();
        if (!newCat) return showToast('Enter a category name', 'error');
        const categories = getCategories();
        if (categories.includes(newCat)) return showToast('Category already exists', 'warning');

        categories.push(newCat);
        saveCategories(categories);
        populateProductCategorySelect();
        document.getElementById('productCategory').value = newCat;
        populateSalesFilters();
        input.value = '';
        showToast('Category added', 'success');
    };
}

// ===========================
// SALES FUNCTIONALITY
// ===========================

let cart = [];

/**
 * Loads products and category filters for the sales view.
 */
function loadProductsForSales() {
    populateSalesFilters();
    applySalesFilters();
}

/**
 * Populates the category filter chips in the sales view.
 */
function populateSalesFilters() {
    const categories = getCategories();
    const chips = document.getElementById('salesCategoryChips');
    if (chips) {
        chips.innerHTML = categories.map(c => `<button type="button" class="px-3 py-1 rounded-full border text-sm sales-chip" data-cat="${c}">${c}</button>`).join('');
        chips.querySelectorAll('.sales-chip').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('bg-indigo-600');
                this.classList.toggle('text-white');
                applySalesFilters();
            });
        });
    }
    const search = document.getElementById('salesSearch');
    if (search) {
        search.removeEventListener('input', applySalesFilters);
        search.addEventListener('input', applySalesFilters);
    }
}

/**
 * Populates the category select dropdown in the product form.
 */
function populateProductCategorySelect() {
    const categories = getCategories();
    const select = document.getElementById('productCategory');
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">Select Category</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    if (current) select.value = current;
}

/**
 * Filters and displays products in the sales grid based on search and category filters.
 */
function applySalesFilters() {
    const allProducts = getProducts();
    const term = (document.getElementById('salesSearch').value || '').toLowerCase();
    const selectedCats = Array.from(document.querySelectorAll('#salesCategoryChips .sales-chip.bg-indigo-600')).map(b => b.getAttribute('data-cat'));
    const filtered = allProducts.filter(p =>
        (selectedCats.length === 0 || selectedCats.includes(p.category)) &&
        (p.name.toLowerCase().includes(term) || (p.barcode || '').toLowerCase().includes(term))
    );
    renderSalesProductGrid(filtered);
}

/**
 * Renders the product grid in the sales view.
 * @param {Array<Object>} products The products to render.
 */
function renderSalesProductGrid(products) {
    const grid = document.getElementById('salesProductGrid');
    if (!grid) return;
    if (!products || products.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 col-span-full text-center">No products found</p>';
        return;
    }
    grid.innerHTML = products.map(p => `
        <button class="border rounded-lg p-3 text-left hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 add-to-cart-card" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
            ${p.image ? `<img src="${p.image}" alt="${p.name}" class="w-full h-28 object-cover rounded mb-2">` : ''}
            <div class="flex justify-between items-center">
                <span class="font-semibold truncate">${p.name}</span>
                <span class="text-sm text-gray-500">${formatCurrency(p.sellingPrice)}</span>
            </div>
            <div class="text-xs text-gray-600 mt-1">${p.category || 'Uncategorized'}</div>
            <div class="text-xs mt-1 ${p.stock <= 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}">Stock left: ${p.stock}</div>
        </button>`).join('');
    grid.querySelectorAll('.add-to-cart-card').forEach(btn => {
        btn.addEventListener('click', function() { addProductCardToCart(this.getAttribute('data-id')); });
    });
}

/**
 * Adds a product to the cart when its card is clicked in the sales view.
 * @param {string} productId The ID of the product to add.
 */
function addProductCardToCart(productId) {
    const product = getProducts().find(p => p.id === productId);
    if (!product) return showToast('Product not found', 'error');
    if (product.stock < 1) return showToast(`Insufficient stock for ${product.name}`, 'error');

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity++;
        existingItem.total = calculateItemTotal(existingItem.price, existingItem.quantity, existingItem.discount);
    } else {
        const discount = parseFloat(document.getElementById('discountInput').value) || 0;
        cart.push({
            id: generateId(),
            productId,
            name: product.name,
            price: product.sellingPrice,
            quantity: 1,
            discount,
            total: calculateItemTotal(product.sellingPrice, 1, discount)
        });
    }
    updateCartDisplay();
    updateReceipt();
    showToast(`${product.name} added to cart`, 'success');
}

/**
 * Loads customers into the customer dropdown in the sales view.
 */
function loadCustomersForSales() {
    const customers = getCustomers();
    const customerSelect = document.getElementById('customerSelect');
    customerSelect.innerHTML = '<option value="walk-in">Walk-in Customer</option><option value="online">Online Customer</option>';
    customers.forEach(customer => {
        customerSelect.innerHTML += `<option value="${customer.id}">${customer.name}</option>`;
    });
}

/**
 * Calculates the total for a cart item, including discounts.
 * @param {number} price The item's base price.
 * @param {number} quantity The quantity of the item.
 * @param {number} discount The discount percentage.
 * @returns {number} The calculated total price.
 */
function calculateItemTotal(price, quantity, discount) {
    const discountedPrice = price * (1 - discount / 100);
    return discountedPrice * quantity;
}

/**
 * Updates the cart display table and totals.
 */
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No items in cart</td></tr>';
        cartTotalEl.textContent = formatCurrency(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(item.price)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.quantity}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.discount}%</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(item.total)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-cart-item" data-id="${item.id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 remove-from-cart" data-id="${item.id}">Remove</button>
            </td>
        </tr>`).join('');

    let total = cart.reduce((sum, item) => sum + item.total, 0);
    const orderDiscount = Math.min(100, Math.max(0, parseFloat(document.getElementById('orderDiscount')?.value) || 0));
    total = total * (1 - orderDiscount / 100);

    cartTotalEl.textContent = formatCurrency(total);
    document.getElementById('amountPaid').value = Math.round(total);

    document.querySelectorAll('.remove-from-cart').forEach(button => button.addEventListener('click', function() { removeFromCart(this.getAttribute('data-id')); }));
    document.querySelectorAll('.edit-cart-item').forEach(button => button.addEventListener('click', function() { editCartItem(this.getAttribute('data-id')); }));
}

/**
 * Removes an item from the cart.
 * @param {string} itemId The ID of the cart item to remove.
 */
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateReceipt();
    showToast('Item removed from cart', 'success');
}

/**
 * Edits the quantity and discount of a cart item.
 * @param {string} itemId The ID of the cart item to edit.
 */
function editCartItem(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    const newQty = parseInt(prompt('Enter new quantity:', String(item.quantity)));
    if (!isFinite(newQty) || newQty <= 0) return showToast('Invalid quantity', 'error');

    const newDiscount = parseFloat(prompt('Enter new discount (%):', String(item.discount)));
    if (!isFinite(newDiscount) || newDiscount < 0 || newDiscount > 100) return showToast('Invalid discount', 'error');

    const product = getProducts().find(p => p.id === item.productId);
    if (product && product.stock < newQty) return showToast(`Insufficient stock. Only ${product.stock} available`, 'error');

    item.quantity = newQty;
    item.discount = newDiscount;
    item.total = calculateItemTotal(item.price, newQty, newDiscount);
    updateCartDisplay();
    updateReceipt();
    showToast('Item updated', 'success');
}

/**
 * Clears all items from the cart.
 */
function clearCart() {
    if (cart.length === 0) return showToast('Cart is already empty', 'info');
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        updateCartDisplay();
        updateReceipt();
        showToast('Cart cleared', 'success');
    }
}

/**
 * Updates the receipt display based on the current cart state.
 */
function updateReceipt() {
    const receiptItems = document.getElementById('receiptItems');
    const receiptTotal = document.getElementById('receiptTotal');
    const receiptPaid = document.getElementById('receiptPaid');
    const receiptChange = document.getElementById('receiptChange');
    const receiptDate = document.getElementById('receiptDate');

    if (cart.length === 0) {
        receiptItems.innerHTML = '<p class="text-center text-gray-500">No items</p>';
        receiptTotal.textContent = formatCurrency(0);
        receiptPaid.textContent = formatCurrency(0);
        receiptChange.textContent = formatCurrency(0);
    } else {
        receiptItems.innerHTML = cart.map(item => `
            <div class="flex justify-between text-sm">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCurrency(item.total)}</span>
            </div>`).join('');

        let total = cart.reduce((sum, item) => sum + item.total, 0);
        const orderDiscount = Math.min(100, Math.max(0, parseFloat(document.getElementById('orderDiscount')?.value) || 0));
        total = total * (1 - orderDiscount / 100);

        const amountPaid = parseFloat(document.getElementById('amountPaid').value) || 0;
        receiptTotal.textContent = formatCurrency(total);
        receiptPaid.textContent = formatCurrency(amountPaid);
        receiptChange.textContent = formatCurrency(Math.max(0, amountPaid - total));
    }
    receiptDate.textContent = new Date().toLocaleString();
}

/**
 * Finalizes the sale, updates stock, and saves the sale record.
 */
function completeSale() {
    if (cart.length === 0) return showToast('Cart is empty', 'error');

    let total = cart.reduce((sum, item) => sum + item.total, 0);
    const orderDiscount = Math.min(100, Math.max(0, parseFloat(document.getElementById('orderDiscount')?.value) || 0));
    const finalTotal = total * (1 - orderDiscount / 100);

    const amountPaid = parseFloat(document.getElementById('amountPaid').value);
    if (isNaN(amountPaid) || amountPaid < finalTotal) return showToast(`Amount paid must be at least ${formatCurrency(finalTotal)}`, 'error');

    const products = getProducts();
    cart.forEach(item => {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
            products[productIndex].stock -= item.quantity;
        }
    });
    saveProducts(products);

    const sale = {
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        customerType: document.getElementById('customerSelect').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        items: [...cart],
        total: finalTotal,
        profit: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (item.total - (product ? product.buyingPrice * item.quantity : 0));
        }, 0),
        amountPaid,
        orderDiscount,
        change: amountPaid - finalTotal,
        notes: document.getElementById('saleNotes').value.trim()
    };

    saveSales([...getSales(), sale]);
    showToast('Sale completed successfully', 'success');

    cart = [];
    updateCartDisplay();
    updateReceipt();
    document.getElementById('saleNotes').value = '';

    if (!views.dashboard.classList.contains('hidden')) {
        loadDashboardData();
    }
}

/**
 * Opens a print dialog for the current receipt.
 */
function printReceipt() {
    if (cart.length === 0) return showToast('No items to print', 'error');
    const receiptContent = document.getElementById('receiptContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html><head><title>Receipt</title>
        <style>
            body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 10px; }
            .receipt { max-width: 300px; margin: 0 auto; }
            .text-center { text-align: center; }
            .border-t, .border-b { border-top: 1px dashed #000; }
            .border-b { border-bottom: 1px dashed #000; }
            .py-2 { padding: 5px 0; }
            .mb-4 { margin-bottom: 10px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .font-semibold { font-weight: bold; }
            .text-sm { font-size: 12px; }
        </style>
        </head><body>${receiptContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
}

// ===========================
// SUPPLIERS FUNCTIONALITY
// ===========================

/**
 * Loads and displays the list of suppliers.
 */
function loadSuppliers() {
    const suppliers = getSuppliers();
    const supplierList = document.getElementById('supplierList');

    if (suppliers.length === 0) {
        supplierList.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No suppliers added yet</td></tr>';
        return;
    }

    supplierList.innerHTML = suppliers.map(supplier => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${supplier.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${supplier.phone || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${supplier.email || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${supplier.address || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-supplier" data-id="${supplier.id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 delete-supplier" data-id="${supplier.id}">Delete</button>
            </td>
        </tr>`).join('');

    document.querySelectorAll('.edit-supplier').forEach(button => button.addEventListener('click', function() { editSupplier(this.getAttribute('data-id')); }));
    document.querySelectorAll('.delete-supplier').forEach(button => button.addEventListener('click', function() { deleteSupplier(this.getAttribute('data-id')); }));
}

/**
 * Initializes the UI elements for supplier payments.
 */
function initializeSupplierPaymentsUI() {
    populateSupplierPaymentSelect();
    const dateInput = document.getElementById('supplierPaymentDate');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    const select = document.getElementById('supplierPaymentSelect');
    if (select) {
        select.removeEventListener('change', onSupplierPaymentSelectChange);
        select.addEventListener('change', onSupplierPaymentSelectChange);
        if (select.value) {
            updateSupplierPaymentSummary(select.value);
            renderSupplierPaymentHistory(select.value);
        }
    }

    const addBtn = document.getElementById('addSupplierPaymentBtn');
    if (addBtn) {
        addBtn.removeEventListener('click', onAddSupplierPayment);
        addBtn.addEventListener('click', onAddSupplierPayment);
    }
}

/**
 * Populates the supplier dropdown for payment tracking.
 */
function populateSupplierPaymentSelect() {
    const suppliers = getSuppliers();
    const select = document.getElementById('supplierPaymentSelect');
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">Select a supplier</option>' + suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    if (current) select.value = current;
}

/**
 * Handles the change event for the supplier payment dropdown.
 * @param {Event} e The change event object.
 */
function onSupplierPaymentSelectChange(e) {
    const supplierId = e.target.value;
    updateSupplierPaymentSummary(supplierId);
    renderSupplierPaymentHistory(supplierId);
}

/**
 * Updates the summary of payments for a selected supplier.
 * @param {string} supplierId The ID of the selected supplier.
 */
function updateSupplierPaymentSummary(supplierId) {
    const totalPiecesEl = document.getElementById('supplierTotalPieces');
    const totalBuyingEl = document.getElementById('supplierTotalBuying');
    const totalPaidEl = document.getElementById('supplierTotalPaid');
    const remainingEl = document.getElementById('supplierTotalRemaining');

    if (!supplierId) {
        if (totalPiecesEl) totalPiecesEl.textContent = '0';
        if (totalBuyingEl) totalBuyingEl.textContent = formatCurrency(0);
        if (totalPaidEl) totalPaidEl.textContent = formatCurrency(0);
        if (remainingEl) remainingEl.textContent = formatCurrency(0);
        return;
    }

    const products = getProducts().filter(p => p.supplierId === supplierId);
    const payments = getExpenses().filter(e => e.category === 'Supplier Payment' && e.supplierId === supplierId);

    const totalPieces = products.reduce((sum, p) => sum + (parseInt(p.stock, 10) || 0), 0);
    const totalBuying = products.reduce((sum, p) => sum + ((parseFloat(p.buyingPrice) || 0) * (parseInt(p.stock, 10) || 0)), 0);
    const totalPaid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    if (totalPiecesEl) totalPiecesEl.textContent = String(totalPieces);
    if (totalBuyingEl) totalBuyingEl.textContent = formatCurrency(totalBuying);
    if (totalPaidEl) totalPaidEl.textContent = formatCurrency(totalPaid);
    if (remainingEl) remainingEl.textContent = formatCurrency(Math.max(0, totalBuying - totalPaid));
}

/**
 * Renders the payment history for a selected supplier.
 * @param {string} supplierId The ID of the selected supplier.
 */
function renderSupplierPaymentHistory(supplierId) {
    const tbody = document.getElementById('supplierPaymentHistoryBody');
    if (!tbody) return;
    if (!supplierId) {
        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">Select a supplier</td></tr>';
        return;
    }
    const payments = getExpenses()
        .filter(e => e.category === 'Supplier Payment' && e.supplierId === supplierId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No payments recorded</td></tr>';
        return;
    }
    tbody.innerHTML = payments.map(p => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${new Date(p.date).toLocaleDateString()}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(p.amount)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${p.description || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-red-600 hover:text-red-900 delete-supplier-payment" data-id="${p.id}" data-supplier="${supplierId}">Delete</button>
            </td>
        </tr>`).join('');

    tbody.querySelectorAll('.delete-supplier-payment').forEach(btn => btn.addEventListener('click', function() {
        deleteSupplierPayment(this.getAttribute('data-id'), this.getAttribute('data-supplier'));
    }));
}

/**
 * Handles the click event for adding a supplier payment.
 * @param {Event} e The click event object.
 */
function onAddSupplierPayment(e) {
    e.preventDefault();
    const supplierId = document.getElementById('supplierPaymentSelect').value;
    const amount = parseFloat(document.getElementById('supplierPaymentAmount').value);
    const date = document.getElementById('supplierPaymentDate').value;
    const notes = document.getElementById('supplierPaymentNotes').value.trim();

    if (!supplierId) return showToast('Please select a supplier', 'error');
    if (isNaN(amount) || amount <= 0 || !date) return showToast('Enter a valid amount and date', 'error');

    const newPayment = {
        id: generateId(),
        category: 'Supplier Payment',
        amount,
        date,
        description: notes || null,
        supplierId
    };
    saveExpenses([...getExpenses(), newPayment]);
    showToast('Supplier payment recorded', 'success');

    document.getElementById('supplierPaymentAmount').value = '';
    document.getElementById('supplierPaymentNotes').value = '';
    updateSupplierPaymentSummary(supplierId);
    renderSupplierPaymentHistory(supplierId);
}

/**
 * Deletes a supplier payment record.
 * @param {string} expenseId The ID of the expense record to delete.
 * @param {string} supplierId The ID of the supplier to update the view for.
 */
function deleteSupplierPayment(expenseId, supplierId) {
    if (!confirm('Delete this payment? This cannot be undone.')) return;
    saveExpenses(getExpenses().filter(e => e.id !== expenseId));
    showToast('Payment deleted', 'success');
    updateSupplierPaymentSummary(supplierId);
    renderSupplierPaymentHistory(supplierId);
}

/**
 * Populates the supplier form for editing.
 * @param {string} supplierId The ID of the supplier to edit.
 */
function editSupplier(supplierId) {
    const supplier = getSuppliers().find(s => s.id === supplierId);
    if (supplier) {
        document.getElementById('supplierId').value = supplier.id;
        document.getElementById('supplierName').value = supplier.name;
        document.getElementById('supplierPhone').value = supplier.phone || '';
        document.getElementById('supplierEmail').value = supplier.email || '';
        document.getElementById('supplierAddress').value = supplier.address || '';
        document.getElementById('supplierForm').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Deletes a supplier after confirmation.
 * @param {string} supplierId The ID of the supplier to delete.
 */
function deleteSupplier(supplierId) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        saveSuppliers(getSuppliers().filter(s => s.id !== supplierId));
        loadSuppliers();
        showToast('Supplier deleted successfully', 'success');
    }
}

/**
 * Resets the supplier form.
 */
function resetSupplierForm() {
    document.getElementById('supplierForm').reset();
    document.getElementById('supplierId').value = '';
}

// ===========================
// EXPENSES FUNCTIONALITY
// ===========================

/**
 * Loads and displays the list of expenses.
 */
function loadExpenses() {
    const expenses = getExpenses();
    const expenseList = document.getElementById('expenseList');

    if (expenses.length === 0) {
        expenseList.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No expenses added yet</td></tr>';
        return;
    }

    expenseList.innerHTML = expenses.map(expense => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${expense.category}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(expense.amount)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(expense.date).toLocaleDateString()}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${expense.description || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-expense" data-id="${expense.id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 delete-expense" data-id="${expense.id}">Delete</button>
            </td>
        </tr>`).join('');

    document.querySelectorAll('.edit-expense').forEach(button => button.addEventListener('click', function() { editExpense(this.getAttribute('data-id')); }));
    document.querySelectorAll('.delete-expense').forEach(button => button.addEventListener('click', function() { deleteExpense(this.getAttribute('data-id')); }));
}

/**
 * Populates the expense form for editing.
 * @param {string} expenseId The ID of the expense to edit.
 */
function editExpense(expenseId) {
    const expense = getExpenses().find(e => e.id === expenseId);
    if (expense) {
        document.getElementById('expenseId').value = expense.id;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseAmount').value = expense.amount;
        document.getElementById('expenseDate').value = expense.date;
        document.getElementById('expenseDescription').value = expense.description || '';
        document.getElementById('expenseForm').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Deletes an expense after confirmation.
 * @param {string} expenseId The ID of the expense to delete.
 */
function deleteExpense(expenseId) {
    if (confirm('Are you sure you want to delete this expense?')) {
        saveExpenses(getExpenses().filter(e => e.id !== expenseId));
        loadExpenses();
        showToast('Expense deleted successfully', 'success');
    }
}

/**
 * Resets the expense form.
 */
function resetExpenseForm() {
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = '';
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
}

// ===========================
// CUSTOMERS FUNCTIONALITY
// ===========================

/**
 * Loads and displays the list of customers.
 */
function loadCustomers() {
    const customers = getCustomers();
    const customerList = document.getElementById('customerList');

    if (customers.length === 0) {
        customerList.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No customers added yet</td></tr>';
        return;
    }

    customerList.innerHTML = customers.map(customer => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${customer.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.phone || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.email || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.address || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-customer" data-id="${customer.id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 delete-customer" data-id="${customer.id}">Delete</button>
            </td>
        </tr>`).join('');

    document.querySelectorAll('.edit-customer').forEach(button => button.addEventListener('click', function() { editCustomer(this.getAttribute('data-id')); }));
    document.querySelectorAll('.delete-customer').forEach(button => button.addEventListener('click', function() { deleteCustomer(this.getAttribute('data-id')); }));
}

/**
 * Populates the customer form for editing.
 * @param {string} customerId The ID of the customer to edit.
 */
function editCustomer(customerId) {
    const customer = getCustomers().find(c => c.id === customerId);
    if (customer) {
        document.getElementById('customerId').value = customer.id;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerPhone').value = customer.phone || '';
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('customerAddress').value = customer.address || '';
        document.getElementById('customerForm').scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Deletes a customer after confirmation.
 * @param {string} customerId The ID of the customer to delete.
 */
function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        saveCustomers(getCustomers().filter(c => c.id !== customerId));
        loadCustomers();
        showToast('Customer deleted successfully', 'success');
    }
}

/**
 * Resets the customer form.
 */
function resetCustomerForm() {
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
}

// ===========================
// REPORTS FUNCTIONALITY
// ===========================

/**
 * Loads and displays quick stats for the reports view.
 */
function loadReports() {
    const sales = getSales();
    const products = getProducts();
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.date === today).reduce((sum, s) => sum + s.total, 0);
    document.getElementById('todaySales').textContent = formatCurrency(todaySales);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthSales = sales.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).reduce((sum, s) => sum + s.total, 0);
    document.getElementById('monthSales').textContent = formatCurrency(monthSales);

    const monthProfit = sales.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).reduce((sum, s) => sum + s.profit, 0);
    document.getElementById('monthProfit').textContent = formatCurrency(monthProfit);

    const lowStockCount = products.filter(p => p.stock < 10).length;
    document.getElementById('lowStockCount').textContent = lowStockCount;
}

/**
 * Generates a report based on the selected type and date range.
 * @param {string} type The type of report to generate.
 * @param {string} startDate The start date for the report.
 * @param {string} endDate The end date for the report.
 */
function generateReport(type, startDate, endDate) {
    const sales = getSales().filter(s => s.date >= startDate && s.date <= endDate);
    const products = getProducts();
    const expenses = getExpenses().filter(e => e.date >= startDate && e.date <= endDate);

    let reportHTML = '';
    switch (type) {
        case 'sales':
            reportHTML = generateSalesReport(sales, products);
            break;
        case 'inventory':
            reportHTML = generateInventoryReport(products);
            break;
        case 'profit':
            reportHTML = generateProfitReport(sales, products);
            break;
        case 'expenses':
            reportHTML = generateExpensesReport(expenses);
            break;
    }
    document.getElementById('reportResults').innerHTML = reportHTML;
}

/**
 * Generates the HTML for a sales report.
 * @param {Array<Object>} sales - The sales data for the report.
 * @param {Array<Object>} products - The product data for the report.
 * @returns {string} The HTML string for the report.
 */
function generateSalesReport(sales, products) {
    if (sales.length === 0) return '<p class="text-center text-gray-500">No sales data for the selected period</p>';

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    let productSales = {};
    sales.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.productId]) {
                productSales[item.productId] = { quantity: 0, revenue: 0 };
            }
            productSales[item.productId].quantity += item.quantity;
            productSales[item.productId].revenue += item.total;
        });
    });

    const productSalesArray = Object.entries(productSales)
        .map(([productId, data]) => ({ name: (products.find(p => p.id === productId) || { name: 'Unknown' }).name, ...data }))
        .sort((a, b) => b.revenue - a.revenue);

    return `
        <div class="mb-4">
            <h4 class="text-lg font-semibold">Sales Summary</h4>
            <p>Total Sales: <strong>${formatCurrency(totalSales)}</strong></p>
            <p>Total Items Sold: <strong>${totalItems}</strong></p>
            <p>Number of Transactions: <strong>${sales.length}</strong></p>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${productSalesArray.map(item => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.quantity}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(item.revenue)}</td>
                    </tr>`).join('')}
            </tbody>
        </table>`;
}

/**
 * Generates the HTML for an inventory report.
 * @param {Array<Object>} products - The product data for the report.
 * @returns {string} The HTML string for the report.
 */
function generateInventoryReport(products) {
    if (products.length === 0) return '<p class="text-center text-gray-500">No products in inventory</p>';

    const lowStockProducts = products.filter(p => p.stock < 10);
    const outOfStockProducts = products.filter(p => p.stock === 0);
    const totalValue = products.reduce((sum, product) => sum + (product.buyingPrice * product.stock), 0);

    return `
        <div class="mb-4">
            <h4 class="text-lg font-semibold">Inventory Summary</h4>
            <p>Total Products: <strong>${products.length}</strong></p>
            <p>Low Stock Items: <strong>${lowStockProducts.length}</strong></p>
            <p>Out of Stock Items: <strong>${outOfStockProducts.length}</strong></p>
            <p>Total Inventory Value: <strong>${formatCurrency(totalValue)}</strong></p>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buying Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${products.map(product => `
                    <tr class="${product.stock === 0 ? 'bg-red-50' : product.stock < 10 ? 'bg-yellow-50' : ''}">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${product.stock === 0 ? 'text-red-600 font-semibold' : product.stock < 10 ? 'text-yellow-600 font-semibold' : ''}">${product.stock}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(product.buyingPrice)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(product.buyingPrice * product.stock)}</td>
                    </tr>`).join('')}
            </tbody>
        </table>`;
}

/**
 * Generates the HTML for a profit report.
 * @param {Array<Object>} sales - The sales data for the report.
 * @param {Array<Object>} products - The product data for the report.
 * @returns {string} The HTML string for the report.
 */
function generateProfitReport(sales, products) {
    if (sales.length === 0) return '<p class="text-center text-gray-500">No sales data for the selected period</p>';

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalCost = sales.reduce((sum, sale) => {
        const saleCost = sale.items.reduce((itemSum, item) => {
            const product = products.find(p => p.id === item.productId);
            return itemSum + (product ? product.buyingPrice * item.quantity : 0);
        }, 0);
        return sum + saleCost;
    }, 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return `
        <div class="mb-4">
            <h4 class="text-lg font-semibold">Profit Summary</h4>
            <p>Total Revenue: <strong>${formatCurrency(totalRevenue)}</strong></p>
            <p>Total Cost: <strong>${formatCurrency(totalCost)}</strong></p>
            <p>Total Profit: <strong>${formatCurrency(totalProfit)}</strong></p>
            <p>Profit Margin: <strong>${profitMargin.toFixed(2)}%</strong></p>
        </div>`;
}

/**
 * Generates the HTML for an expenses report.
 * @param {Array<Object>} expenses - The expense data for the report.
 * @returns {string} The HTML string for the report.
 */
function generateExpensesReport(expenses) {
    if (expenses.length === 0) return '<p class="text-center text-gray-500">No expenses for the selected period</p>';

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    let categoryExpenses = {};
    expenses.forEach(expense => {
        categoryExpenses[expense.category] = (categoryExpenses[expense.category] || 0) + expense.amount;
    });
    const categoryExpensesArray = Object.entries(categoryExpenses)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

    return `
        <div class="mb-4">
            <h4 class="text-lg font-semibold">Expenses Summary</h4>
            <p>Total Expenses: <strong>${formatCurrency(totalExpenses)}</strong></p>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${categoryExpensesArray.map(item => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.category}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(item.amount)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${((item.amount / totalExpenses) * 100).toFixed(2)}%</td>
                    </tr>`).join('')}
            </tbody>
        </table>`;
}

// ===========================
// SETTINGS FUNCTIONALITY
// ===========================

/**
 * Loads company and system settings into the settings form.
 */
function loadSettings() {
    const companyInfo = getCompanyInfo();
    const systemSettings = getSystemSettings();

    document.getElementById('companyName').value = companyInfo.name || 'Swift POS';
    document.getElementById('companyAddress').value = companyInfo.address || '';
    document.getElementById('companyPhone').value = companyInfo.phone || '';

    document.getElementById('currency').value = systemSettings.currency || 'MMK';
    document.getElementById('taxRate').value = systemSettings.taxRate || 0;
    document.getElementById('enableNotifications').checked = systemSettings.enableNotifications !== false;
    document.getElementById('enableSound').checked = systemSettings.enableSound !== false;

    const storagePref = systemSettings.storagePreference || { type: 'local', path: '' };
    document.querySelector(`input[name="storageType"][value="${storagePref.type}"]`).checked = true;
    document.getElementById('storagePath').value = storagePref.path || '';
}

// ===========================
// EVENT LISTENERS
// ===========================

// Form Submissions
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ... implementation ...
});

document.getElementById('supplierForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ... implementation ...
});

document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ... implementation ...
});

document.getElementById('customerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ... implementation ...
});

document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (!startDate || !endDate) return showToast('Please select both start and end dates', 'error');
    if (new Date(startDate) > new Date(endDate)) return showToast('Start date cannot be after end date', 'error');
    generateReport(reportType, startDate, endDate);
});

document.getElementById('companyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ... implementation ...
});

document.getElementById('systemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ... implementation ...
});

document.getElementById('storageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // ... implementation ...
});

// Button Clicks
document.getElementById('productClearBtn').addEventListener('click', resetProductForm);
document.getElementById('supplierClearBtn').addEventListener('click', resetSupplierForm);
document.getElementById('expenseClearBtn').addEventListener('click', resetExpenseForm);
document.getElementById('customerClearBtn').addEventListener('click', resetCustomerForm);
document.getElementById('clearCartButton').addEventListener('click', clearCart);
document.getElementById('completeSaleButton').addEventListener('click', completeSale);
document.getElementById('printReceiptButton').addEventListener('click', printReceipt);
document.getElementById('exportDataButton').addEventListener('click', () => { /* ... */ });
document.getElementById('importDataButton').addEventListener('click', () => { /* ... */ });
document.getElementById('resetDataButton').addEventListener('click', () => { /* ... */ });
document.getElementById('pickLocalFolderButton').addEventListener('click', () => { /* ... */ });

// Tab and mobile navigation
Object.entries(tabButtons).forEach(([viewName, button]) => button.addEventListener('click', () => showView(viewName)));
mobileNavSelect.addEventListener('change', (e) => showView(e.target.value));
mobileMenuButton.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
});
closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
});
overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
});

// App Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    showView('dashboard');
    // Set default dates
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    document.getElementById('startDate').value = firstDay;
    document.getElementById('endDate').value = lastDay;

    // Online/Offline status
    window.addEventListener('online', () => document.getElementById('offlineIndicator').classList.add('hidden'));
    window.addEventListener('offline', () => document.getElementById('offlineIndicator').classList.remove('hidden'));
    if (!navigator.onLine) document.getElementById('offlineIndicator').classList.remove('hidden');
});