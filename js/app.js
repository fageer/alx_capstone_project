// Elements
const body = document.querySelector('body');
const dark = document.querySelector('#dark');
const form = document.querySelector('form');
const title = document.querySelector('#title');
const price = document.querySelector('#price');
const taxes = document.querySelector('#taxes');
const ads = document.querySelector('#ads');
const discount = document.querySelector('#discount');
const count = document.querySelector('#count');
const category = document.querySelector('#category');
const submitBtn = document.querySelector('#submit');
const tbody = document.querySelector('#tbody');
const total = document.querySelector('#total');
const inputs = document.querySelectorAll('form input');
const deleteAllBtn = document.querySelector('.delete');
const search = document.querySelector('#search');
const searchByTitleBtn = document.querySelector('#searchTitle');
const searchByCategoryBtn = document.querySelector('#searchCategory');
const spanError = document.querySelector('#spanError');
let products = [];
let btnMood = "Create";



// Get data from local storage if exists
function getDataFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        displayProducts();
    }
};
getDataFromLocalStorage();


// Toggle dark mode
dark.addEventListener('click', () => {
    body.classList.toggle('dark');
    dark.classList.toggle('fa-toggle-off');
    dark.classList.toggle('fa-toggle-on');
});


// Get the total value  
function getTotal() {
    if (price.value != "") {
        let result = Number(price.value) + Number(taxes.value) + Number(ads.value) - Number(discount.value);
        total.textContent = `$${result}`;
    }
};


// Start the total function
inputs.forEach(input => {
    input.addEventListener('keyup', () => {
        getTotal();
    })
});


// Delete all products from local storage
deleteAllBtn.addEventListener('click', () => {
    const deleteConfirm = window.confirm('Are you sure you want to delete all products?');
    if (deleteConfirm) {
        localStorage.clear();
        location.reload();
    }
});


// Display products function
function displayProducts() {
    tbody.innerHTML = "";
    let output = "";
    for (let i = 0; i < products.length; i++) {
        output += `
            <tr>
            <td>${i + 1}</td>
            <td>${products[i].title}</td>
            <td>$${products[i].price}</td>
            <td>$${products[i].taxes}</td>
            <td>$${products[i].ads}</td>
            <td style="text-decoration: line-through;">$${products[i].discount}</td>
            <td>${products[i].total}</td>
            <td>${products[i].category}</td>
            <td><button onclick="updateProduct(${i})">Update</button></td>
            <td><button onclick="deleteProduct(${i})" class="del">Delete</button></td>
            </tr>
        `;
    }
    tbody.innerHTML = output;

    if (products.length > 0) {
        deleteAllBtn.style.display = 'block';
        deleteAllBtn.innerHTML = `Delete All (${products.length})`
    } else {
        deleteAllBtn.style.display = 'none';
    }
};


// Create product when you click create button
function createProduct() {
    const productTitle = title.value.toLowerCase().trim();
    const productPrice = price.value;
    const productTaxes = taxes.value;
    const productAds = ads.value;
    const productDiscount = discount.value;
    const productTotal = total.textContent;
    const productCategory = category.value.toLowerCase().trim();

    if (Number(count.value) > 1) {
        for (let i = 0; i < Number(count.value); i++) {
            const newPro = {
                title: productTitle,
                price: productPrice,
                taxes: productTaxes,
                ads: productAds,
                discount: productDiscount,
                total: productTotal,
                category: productCategory
            };
            products.push(newPro);
        }
    } else {
        const newPro = {
            title: productTitle,
            price: productPrice,
            taxes: productTaxes,
            ads: productAds,
            discount: productDiscount,
            total: productTotal,
            category: productCategory
        };
        products.push(newPro);
    }

    displayProducts();
    localStorage.setItem('products', JSON.stringify(products));
};


// submit button for creating new product
submitBtn.addEventListener('click', () => {
    if (btnMood == 'Update') {
        btnMood = "Create";
        submitBtn.innerHTML = btnMood;
    }
    if (title.value !== "" && price.value !== "" && taxes.value !== "" && ads.value !== "" && discount.value !== "" && category.value !== "") {
        createProduct();
        reset();
    } else {
        inputs.forEach(input => {
            input.style.border = "2px solid red";
        });
        spanError.style.display = "block";
        setTimeout(() => {
            spanError.style.display = "none";
            inputs.forEach(input => {
                input.style.border = "none";
            });
        }, 5000);
    }
});


// reset all inputs fields
function reset() {
    inputs.forEach(input => {
        input.value = "";
        input.style.border = "none";
    });
    total.textContent = "$0";
    spanError.style.display = "none";
};


// Update product function
function updateProduct(index) {
    btnMood = "Update";
    submitBtn.innerHTML = btnMood;

    const productToUpdate = products[index];
    title.value = productToUpdate.title;
    price.value = productToUpdate.price;
    taxes.value = productToUpdate.taxes;
    ads.value = productToUpdate.ads;
    discount.value = productToUpdate.discount;
    total.textContent = productToUpdate.total;
    category.value = productToUpdate.category;

    products.splice(index, 1);
    displayProducts();
    localStorage.setItem('products', JSON.stringify(products));
};


// Delete product function
function deleteProduct(index) {
    const deleteConfirm = window.confirm('Are you sure you want to delete this product?');
    if (deleteConfirm) {
        products.splice(index, 1);
        displayProducts();
        localStorage.setItem('products', JSON.stringify(products));
    }
};


// to define the search method
let searchMood = "Title";
function getSearchMood(id) {
    if (id === "searchTitle") {
        searchMood = "Title";
    } else {
        searchMood = "Category";
    }
    search.setAttribute('placeholder', `Search By ${searchMood}`);
    search.focus();
    search.value = "";
    displayProducts();
};
// serch by the search mood
function searchProducts(value) {
    let output = "";
    if (searchMood === "Title") {
        for (let i = 0; i < products.length; i++) {
            if (products[i].title.toLowerCase().includes(value.toLowerCase())) {
                output += `
                    <tr>
                    <td>${i + 1}</td>
                    <td>${products[i].title}</td>
                    <td>${products[i].price}</td>
                    <td>${products[i].taxes}</td>
                    <td>${products[i].ads}</td>
                    <td>${products[i].discount}</td>
                    <td>${products[i].total}</td>
                    <td>${products[i].category}</td>
                    <td><button onclick="updateProduct(${i})">Update</button></td>
                    <td><button onclick="deleteProduct(${i})" class="del">Delete</button></td>
                    </tr>
                `;
            }
        }
    }else {
        for (let i = 0; i < products.length; i++) {
            if (products[i].category.toLowerCase().includes(value.toLowerCase())) {
                output += `
                    <tr>
                    <td>${i + 1}</td>
                    <td>${products[i].title}</td>
                    <td>${products[i].price}</td>
                    <td>${products[i].taxes}</td>
                    <td>${products[i].ads}</td>
                    <td>${products[i].discount}</td>
                    <td>${products[i].total}</td>
                    <td>${products[i].category}</td>
                    <td><button onclick="updateProduct(${i})">Update</button></td>
                    <td><button onclick="deleteProduct(${i})" class="del">Delete</button></td>
                    </tr>
                `;
            }
        }
    }
    tbody.innerHTML = output;
}


searchByTitleBtn.addEventListener('click', () => {
    getSearchMood(searchByTitleBtn.id);
});
searchByCategoryBtn.addEventListener('click', () => {
    getSearchMood(searchByCategoryBtn.id);
});
search.addEventListener('keyup', () => {
    searchProducts(search.value);
});
