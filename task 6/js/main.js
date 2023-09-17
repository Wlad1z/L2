// определяем DOM-элементы
const input = document.getElementById('input'),
    range = document.getElementById('range'),
    placeholder = document.getElementById('placeholder'),
    check = document.getElementById('check'),
    restart = document.getElementById('restart'),
    countTrialSpan = document.getElementById('count-trial'),
    limitSpan = document.getElementById('limit');
// первое случайное число при загрузке страницы
let specifiedNumber = Math.floor(range.value * Math.random()),
    count = 0,
    countTrial = 0,
    limit = 100;

//отрисовка подсказки подсказки
function placeholderNumber () {
    if(count >= 3){
        if (specifiedNumber%2 == 0){
            placeholder.innerHTML += " Подсказка: это четное число";
            count = 0;
        } else {
            placeholder.innerHTML += " Подсказка: это нечетное число";
            count = 0;
        }
    }
}
//функция для опредения числа
check.addEventListener('click', ()=>{
    if(!input.value){
        placeholder.innerHTML = "Введите число.";
        input.style.border = "1px solid red"
    } else if (input.value > specifiedNumber){
        placeholder.innerHTML = "Введите число меньше.";
        count ++;
        placeholderNumber ();
        countTrial++;
    } else if (input.value < specifiedNumber){
        placeholder.innerHTML = "Введите число больше.";
        count ++;
        placeholderNumber ();
        countTrial++;
    } else if (input.value == specifiedNumber){
        placeholder.innerHTML = "Вы угадали число.";
        countTrial++;
    }
    countTrialSpan.innerHTML = countTrial;

})
//проверка на валидность числа
function currentCheckInput() {
    const validValue = input.value.match(/^\d+$/);
    if (validValue) {
        if (input.value == 0){
            placeholder.innerHTML = `Введите число от 1 до ${limit}`;
        } else if (input.value > limit){
            placeholder.innerHTML = `Введите число от 1 до ${limit}`;
        }
        } else {
        input.value = 1;
    }
    input.style.border = "1px solid #ccc"
}
//проверка на валидность лимита
function currentCheckInputRange() {
    const validValue = range.value.match(/^\d+$/);
    if (validValue) {
        if (range.value < 10) {
            range.value = 10;
        } else if (range.value > 1000){
            range.value = 1000;
        }
        } else {
            range.value = 1;
    }
}

input.addEventListener("input", currentCheckInput);
range.addEventListener("input", currentCheckInputRange);
//функция рестарт
restart.addEventListener('click', ()=>{
    count = 0;
    countTrial = 0;
    specifiedNumber = Math.floor(range.value * Math.random());
    limit = range.value;
    placeholder.innerHTML = "Вы начали заново";
    input.value = '';
    limitSpan.innerHTML = range.value;
    countTrialSpan.innerHTML = countTrial;
})