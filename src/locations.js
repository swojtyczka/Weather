function addLocation() {
	let name = $("#location-name").val();
	settings.locations.push(name);
	fs.writeFileSync("./data/settings.json", JSON.stringify(settings));
	location.reload();
}

function deleteLocation(name) {
	const index = settings.locations.indexOf(name);
	if (index > -1)
		settings.locations.splice(index, 1);
	fs.writeFileSync("./data/settings.json", JSON.stringify(settings));
	location.reload();
}