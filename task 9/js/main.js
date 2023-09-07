const productNameInput = document.getElementById('product-name');
const productCaloriesInput = document.getElementById('product-calories');
const productSizeInput = document.getElementById('product-size');
const dailyGoalInput = document.getElementById('daily-goal');
const totalCaloriesDiv = document.getElementById('total-calories');
const intentCaloriesSizes = document.getElementById('intent-calories-sizes');
const intentCaloriesAlert = document.getElementById('intent-calories-alert');
const productList = document.getElementById('product-list');
const chart = document.getElementById('chart');



let totalCalories = 0;

function loadProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}
function loadDailyGoal() {
    return JSON.parse(localStorage.getItem('dailyGoal')) || 0;
}

let products = loadProducts();

let dailyGoal = loadDailyGoal();

function saveProduct(product) {
    
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

function addProduct() {
    const name = productNameInput.value;
    const calories = parseInt(productCaloriesInput.value);
    const size = parseInt(productSizeInput.value);
    const getCalories = calories * size / 100
    let id = products.length === 0 ? 0 : products[products.length - 1].id + 1;
    saveProduct({ id, name, calories,size, getCalories });
    renderProducts();
}



function setDailyGoal() {
    let newDailyGoal = parseInt(dailyGoalInput.value);
    localStorage.setItem('dailyGoal', newDailyGoal);
    addIntentCalloriesSizes(newDailyGoal);
}

function addIntentCalloriesSizes(dailyGoal) {
    intentCaloriesSizes.innerHTML = `Ваша дневная цель ${dailyGoal} ккал`;
    checkGoal();
}



function checkGoal() {
    let dailyGoal = loadDailyGoal()
    if (totalCalories > dailyGoal) {
        intentCaloriesAlert.innerHTML = "Вы превысили свою дневную норму калорий!";
    } else {
        intentCaloriesAlert.innerHTML = "";
    }
}

function renderProducts() {
    
    productList.innerHTML = '';
    totalCalories = 0;
    chart.innerHTML = '';
    let maxSize = 0;
    let count = 0;

    products.forEach(product => {
        totalCalories += product.getCalories;
        const li = document.createElement('li');
        li.innerHTML = `${product.name}: ${product.getCalories} калорий <button class="delete" onclick="deleteProduct(${product.id})">Удалить</button>`;
        productList.appendChild(li);
        if (product.getCalories> maxSize){
            maxSize = product.getCalories;
        }
    });
    products.forEach(product => {
        const height = 100 / (maxSize / product.getCalories);
        const div = document.createElement('div');
    
        div.style.height = height + "%";
        div.classList.add('bar');
        div.innerHTML = product.getCalories + " ккал.";
        chart.appendChild(div);
        const hiddenDiv = document.createElement('div');
        hiddenDiv.innerHTML = product.name + "<br>"+ product.getCalories + " ккал.";
        if (count > 15){
            hiddenDiv.style.right = 0;
        }
        hiddenDiv.classList.add('hidden', 'placeholder');
        div.appendChild(hiddenDiv);
    
        // Добавить обработчик события для наведения мыши
        div.addEventListener('mouseenter', () => {
            hiddenDiv.classList.remove('hidden');
        });
    
        // Добавить обработчик события для убирания мыши
        div.addEventListener('mouseleave', () => {
            hiddenDiv.classList.add('hidden');
        });
        count ++;
    });

    totalCaloriesDiv.textContent = `Суммарно: ${totalCalories} калорий`;

    checkGoal();
}

document.getElementById('filter-name').addEventListener('change', (event) => {
    if (event.target.checked) {
        products.sort((a, b) => a.name.localeCompare(b.name));
        renderProducts();
    }
});

document.getElementById('filter-calories').addEventListener('change', (event)=>{
    if (event.target.checked){
        products.sort((a, b) => b.getCalories - a.getCalories);
        renderProducts();
    }
})

function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
}

document.getElementById('clear').addEventListener('click', ()=>{
    products = [];
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
})

renderProducts();
addIntentCalloriesSizes (dailyGoal);