const form = document.querySelector(".interface__form");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const msg = document.querySelector(".interface__msg");
const list = document.querySelector(".widgets__list");
const locationButton = document.getElementById('location');
const clearButton = document.getElementById('clear');

const app = async () => {
    addWidgets();
    getGeolocation();
    clearWidgets();
    checkLocalStorage();
}

function addWidgets() {
    form.addEventListener("submit", e => {
        e.preventDefault();
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude.value}&lon=${longitude.value}&appid=f9866436c8b150e8433cff33f655382d&lang=ru&units=metric`)
            .then(response => response.json())
            .then(weather => {
                const lat = latitude.value.replace(/,/, '.');
                const lon = longitude.value.replace(/,/, '.');
                const icon = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
                const map = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=500&center=lonlat:${lon},${lat}&zoom=8&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=7b128cd8393743309d239f6e08f5fa23`;
                addWidget(weather, icon, map)
            })
            .catch(() => {
                msg.textContent = "❗ Некорректные координаты. Попробуйте ещё раз.";
            });
        msg.textContent = "";
        form.reset();
        latitude.focus();
    });
}

function addWidget(data, icon, map) {
    const widget = document.createElement("li");
    widget.classList.add("widgets__widget");
    widget.innerHTML = `
        <h1 class="widgets__coordinates">${data.coord.lat.toFixed(4)}°, ${data.coord.lon.toFixed(4)}°</h1>
        <div class="widgets__weather">
            <img class="widgets__icon" src=${icon} alt="Иконка">
            <h3 class="widgets__description">${capitalize(data.weather[0].description)}</h3>
        </div>
        <div class="widgets__wrapper">
            <h2 class="widgets__temperature">${Math.floor(data.main.temp)}°</h2>
            <div class="widgets__info">
                <p class="widgets__name">Ветер</p>
                <p class="widgets__value">${data.wind.speed.toFixed(0)} м/c</p>
                <p class="widgets__name">Влажность</p>
                <p class="widgets__value">${data.main.humidity}%</p>
            </div>
        </div>
        <div class="widgets__map-wrapper">
        <a href="https://maps.yandex.ru/?ll=${data.coord.lon},${data.coord.lat}&z=10" target="_blank"><img class="widgets__map" src=${map} alt="Карта"></a>
        </div>`;
    list.appendChild(widget);
    localStorage.setItem("list", JSON.stringify(list.innerHTML));
}

function clearWidgets() {
    clearButton.addEventListener("click", e => {
        list.innerHTML = "";
        latitude.value = "";
        longitude.value = "";
        localStorage.clear();
    });
}

function getGeolocation() {
    locationButton.addEventListener("click", e => {
        navigator.geolocation.getCurrentPosition((pos) => {
            latitude.value = pos.coords.latitude
            longitude.value = pos.coords.longitude
        })
    });
}

function checkLocalStorage() {
    if (list.innerHTML == "") {
        list.innerHTML = JSON.parse(localStorage.getItem("list", JSON.stringify(list)));
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app()