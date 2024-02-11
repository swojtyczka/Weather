const fs = require('fs');
const https = require('https');
window.$ = window.jQuery = require('jquery');

var settings;

fs.readFile("./data/settings.json", 'utf-8', (err, data) => {
  if (err) {
    alert("An error ocurred reading the file :" + err.message);
    return;
  }
  settings = JSON.parse(data);

  let count = 0;

  settings.locations.forEach(location => {
    let url = `https://api.weatherapi.com/v1/forecast.json?q=${location.replace(" ", "+")}&key=772a0b56f48149caa8b154043230507&days=3`;
    https.get(url, (res) => {
      let tmp = [];

      res.on('data', chunk => {
        tmp.push(chunk);
      });

      res.on('end', () => {
        let weather_data = JSON.parse(Buffer.concat(tmp).toString());

        let card = weather_data.error ?
          `<div class="col-3">
            <div class="card text-center weather-card">
              <img src="https://cdn3.iconfinder.com/data/icons/smileys-people-smiley-essential/48/v-51-512.png" class="weather-icon card-img-top" alt=":(">
                <div class="card-body">
                  <h5 class="card-title">${location}</h5>
                  <hr/>
                  <p class="card-text">This location is not currently supported.</p>

                  <a onclick="deleteLocation('${location}');" class="btn btn-danger">&times;</a>
                </div>
            </div>
          </div>`
          :
          `<div class="col-3">
            <div class="card text-center weather-card">
              <div class="container-fluid">
                <img src="https:${weather_data.current.condition.icon}" class="f-l weather-icon card-img-top" alt="${location}">
              </div>
              <div class="card-body">
                <h2 class="card-title">${weather_data.current.temp_c}°C</h2>
                <h4 class="card-title">${location}</h4>
                <p class="card-text">${weather_data.location.country}</p>
                <ul class="list-group list-group-flush" id="days-${count}">
                </ul>

                <a onclick="deleteLocation('${location}');" class="btn btn-danger">&times;</a>

                <p class="card-text"><small class="text-muted">Updated ${weather_data.current.last_updated}</small></p>
              </div>
            </div>
          </div>`;

        $(`#locations`).prepend(card);

        const DAYS = 3;
        for (i = 0; i < DAYS; i++) {
          let current = weather_data.forecast.forecastday[i];
          let day =
            `<li class="list-group-item">
              <div class="media">
                <img class="mr-3" src="https:${current.day.condition.icon}" alt=":(">
                <div class="media-body">
                  <h5 class="mt-0">${current.day.mintemp_c}°C - ${current.day.maxtemp_c}°C</h5>
                  ${new Date(current.date).toLocaleString('en-us', { weekday: 'long' })}
                </div>
              </div>
            </li>`;
          $(`#days-${count}`).append(day);
        }

        count++;
      });

    })
  });
});