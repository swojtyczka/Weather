const fs = require('fs');
const https = require('https');
window.$ = window.jQuery = require('jquery');


fs.readFile("./data/settings.json", 'utf-8', (err, data) => {
  if (err) {
    alert("An error ocurred reading the file :" + err.message);
    return;
  }
  var settings = JSON.parse(data);

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
          `<div class="card">
            <img src="https://cdn3.iconfinder.com/data/icons/smileys-people-smiley-essential/48/v-51-512.png" class="weather-icon card-img-top" alt=":(">
              <div class="card-body">
                <h5 class="card-title">${location}</h5>
                <hr/>
                <p class="card-text">This location is not currently supported.</p>
              </div>
          </div>`
          :
          `<div class="card">
            <div class="container-fluid">
              <img src="https:${weather_data.current.condition.icon}" class="f-l weather-icon card-img-top" alt="${location}">
              <p class="temp-text">${weather_data.current.temp_c}°C</p>
            </div>
            <div class="card-body">
              <h4 class="card-title">${location}</h4>
              <hr/>
              <p class="card-text">${weather_data.location.country}</p>
              <ul class="list-group list-group-flush" id="days-${count}">
              </ul>
              <p class="card-text"><small class="text-muted">Updated ${weather_data.current.last_updated}</small></p>
            </div>
          </div>`;

        $(`#locations`).append(card);

        $(`#days-${count}`).append();

        count++;
      });

    })
  });
});

