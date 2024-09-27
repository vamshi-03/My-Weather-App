let weather = {
    apiKey: "7e005368a65cea464e260edb850d7ca1", // OpenWeatherMap API key
    imageApiKey: "46216957-8719dbb8db15120c5197a0e8e", // Replace with your Pixabay API key
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
        .then((response) => {
            if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data))
        .catch((error) => console.error("Error fetching weather:", error));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");

        // Fetch the background image from Pixabay
        this.fetchBackgroundImage(name);
    },
    fetchBackgroundImage: function (city) {
        const imageApiURL = `https://pixabay.com/api/?key=${this.imageApiKey}&q=${encodeURIComponent(
            city
        )}&image_type=photo&orientation=horizontal&category=nature&per_page=3`;

        fetch(imageApiURL)
        .then((response) => response.json())
        .then((data) => {
            if (data.hits && data.hits.length > 0) {
                const randomImage =
                    data.hits[Math.floor(Math.random() * data.hits.length)].largeImageURL;
                console.log("Background image:", randomImage);
                document.body.style.backgroundImage = `url('${randomImage}')`;
            } else {
                console.log("No images found for", city);
                document.body.style.backgroundImage = `url('default-background.jpg')`;
            }
        })
        .catch((error) => {
            console.error("Error fetching background image:", error);
        });
    },
    search: function () {
        const city = document.querySelector(".search-bar").value;
        if (city) {
            this.fetchWeather(city);
        } else {
            alert("Please enter a city name.");
        }
    },
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        weather.search();
    }
});

// Do not display any city initially
document.querySelector(".weather").classList.add("loading");
