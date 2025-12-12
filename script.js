const input = document.getElementById("cityInput");
const button = document.querySelector("button");

const city = document.getElementById("city");
const geoLocal = document.getElementById("gps");
const temperature = document.getElementById("temperature");
const details = document.getElementById("details");

console.log(city);
console.log(geoLocal);
console.log(temperature);
console.log(details);

button.addEventListener("click", () => {
  fetchCoordonates(input.value);

  async function fetchCoordonates(cityInput) {
    const coordonateUrl = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${cityInput}&format=json&addressdetails=1&limit=1`
    );

    try {
      if (!coordonateUrl.ok)
        throw new Error("erreur Appel API des coordonnées ville 😬");
      console.log(
        `Information récupération des données API coordonnées : ${coordonateUrl.status} ${coordonateUrl.statusText}`
      );
      const cordonatesResponse = await coordonateUrl.json();

      if (cordonatesResponse == "") {
        city.textContent =
          "Aucune ville ou correspondance d'abbréviation trouvée";
        geoLocal.textContent = "--, --";
        temperature.textContent = "--";
        details.textContent =
          "Veuillez rentrer un nom ou une abbréviation de ville cohérente";
      } else {
             city.textContent = cordonatesResponse[0].name;
      geoLocal.textContent =
        " Coordonnées GPS : " +
        cordonatesResponse[0].lat +
        ", " +
        cordonatesResponse[0].lon;
      details.textContent = "Temperature actuelle"; 
      }


      async function fetchWeather(lat, lon) {
        const weatherUrl = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m`
        );
        try {
          if (!weatherUrl.ok)
            throw new Error("erreur Appel API de température 😬");
          console.log(
            `Information récupération des données API température : ${weatherUrl.status} ${weatherUrl.statusText}`
          );

          const weatherResponse = await weatherUrl.json();

          console.log(weatherResponse);

          temperature.textContent =
            weatherResponse.current.temperature_2m + " °C";
        } catch {
          console.log(
            `Erreur récupération des données API température : ${weatherUrl.status} ${weatherUrl.statusText}`
          );
        }
      }

      fetchWeather(cordonatesResponse[0].lat, cordonatesResponse[0].lon);
    } catch {

      console.log(
        `Erreur récupération des données API coordonnées : ${coordonateUrl.status} ${coordonateUrl.statusText}`
      );
    }
  }
});
