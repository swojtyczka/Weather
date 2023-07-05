var fs = require('fs');
window.$ = window.jQuery = require('jquery');

var settings;
fs.readFile("./data/settings.json", 'utf-8', (err, data) => {
  if (err) {
    alert("An error ocurred reading the file :" + err.message);
    return;
  }
  settings = JSON.parse(data);

  $("#locations").html(
    settings.locations.map(location => `<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="${location}">
  <div class="card-body">
    <p class="card-text">
    <h4>${location}</h4>
    <hr/>
    Any text
    </p>
  </div>
  </div>`)
    )
});
