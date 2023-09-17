// определяем DOM-элементы
const productNameInput = document.getElementById('product-name');
const productCaloriesInput = document.getElementById('product-calories');
const productSizeInput = document.getElementById('product-size');
const dailyGoalInput = document.getElementById('daily-goal');
const totalCaloriesDiv = document.getElementById('total-calories');
const intentCaloriesSizes = document.getElementById('intent-calories-sizes');
const intentCaloriesAlert = document.getElementById('intent-calories-alert');
const productList = document.getElementById('product-list');
const chart = document.getElementById('chart');


let totalCalories = 0; // переменная для дневной нормы

// загружаем данные из локального хранилища
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
//функция добавления продукта
function addProduct() {
    const name = productNameInput.value;
    const calories = parseInt(productCaloriesInput.value);
    const size = parseInt(productSizeInput.value);
    const getCalories = calories * size / 100
    let id = products.length === 0 ? 0 : products[products.length - 1].id + 1;
    saveProduct({ id, name, calories,size, getCalories });
    renderProducts();
}


//функция изменения дневной нормы
function setDailyGoal() {
    let newDailyGoal = parseInt(dailyGoalInput.value);
    localStorage.setItem('dailyGoal', newDailyGoal);
    addIntentCalloriesSizes(newDailyGoal);
}
//отрисовка дневной нормы
function addIntentCalloriesSizes(dailyGoal) {
    intentCaloriesSizes.innerHTML = `Ваша дневная цель ${dailyGoal} ккал`;
    checkGoal();
}
//проверка дневной нормы
function checkGoal() {
    let dailyGoal = loadDailyGoal()
    if (totalCalories > dailyGoal) {
        intentCaloriesAlert.innerHTML = "Вы превысили свою дневную норму калорий!";
    } else {
        intentCaloriesAlert.innerHTML = "";
    }
}
//отрисовка продуктов
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
        div.addEventListener('mouseenter', () => {
            hiddenDiv.classList.remove('hidden');
        });
        div.addEventListener('mouseleave', () => {
            hiddenDiv.classList.add('hidden');
        });
        count ++;
    });

    totalCaloriesDiv.textContent = `Суммарно: ${totalCalories} калорий`;

    checkGoal();
}
//сортировка по продуктам
document.getElementById('filter-name').addEventListener('change', (event) => {
    if (event.target.checked) {
        products.sort((a, b) => a.name.localeCompare(b.name));
        renderProducts();
    }
});
//сортировка по калориям
document.getElementById('filter-calories').addEventListener('change', (event)=>{
    if (event.target.checked){
        products.sort((a, b) => b.getCalories - a.getCalories);
        renderProducts();
    }
})
//удаления продукта
function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
}
//очистка всего массива продуктов
document.getElementById('clear').addEventListener('click', ()=>{
    products = [];
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
})

renderProducts();
addIntentCalloriesSizes (dailyGoal);