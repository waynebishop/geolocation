var mainMap;
var allMarkers = [];
var userMarker;
var directionsService;
var directionsDisplay;

function initMap() {

	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;

	// Get a reference to the map container (div)
	var mapContainer = document.querySelector('#map-container');

	// Set some map options
	var options = {
		center: {
			lat: -41.293037, 
			lng: 174.777255
		},
		zoom: 15
	};	


	// Create a new Google Map
	mainMap = new google.maps.Map(mapContainer, options);

	directionsDisplay.setMap(mainMap);


	// Now we're ready to show the store markers
	placeStoreMarkers();

	// Find out if the user wants to share their location
	getUserLocation();

}

function placeStoreMarkers() {

	// Would normlly connect to database and get the locations but hardcoded here today
	var locations = [
		{
			title: "Hataitai Shop",
			lat: -41.304393, 
			lng: 174.793703
		},

		{
			title: "Petone Store",
			lat: -41.224220,
			lng: 174.882146
		},

		{
			title: "Brooklyn",
			lat: -41.305876,
			lng: 174.762667
		}

	];

	// Loop over each location
	for( var i=0; i<locations.length; i++ ) {
		
		// Create a new marker
		var marker = new google.maps.Marker({
			position: {
				lat: locations[i].lat,
				lng: locations[i].lng
				
			},
			map: mainMap,
			title: locations[i].title,
			icon: "http://placehold.it/50x50",
			id: i	
		});

		// Store this marker in the collection
		allMarkers.push(marker);

	}

	// Show the contents of the allMarkers array
	console.log(allMarkers);

	// Populate the store picker
	populateStorePicker(locations);

}

function populateStorePicker(locations) {

	console.log(locations);

	// Find the store picker element
	var storePickerElement = document.querySelector('#store-picker');

	// Create a "Please select... option"
	var optionElement = document.createElement('option');	
	optionElement.innerHTML = "Please select a store...";
	storePickerElement.appendChild(optionElement); 



	// Create all the location options
	for( var i=0; i<locations.length; i++ ) {

		// Create a new option element
		var optionElement = document.createElement('option');

		// Put the name of this store in the option element
		optionElement.innerHTML = locations[i].title;

		// Put this new option element in the select
		storePickerElement.appendChild(optionElement); 		

	}

	// Listen for changes in the slect element
	storePickerElement.onchange = showChosenLocation;

}

function showChosenLocation() {

	// Get he element that triggered this function
	var selectElement = this;

	// Get the index of the option that was chosen
	var selectedOptionIndex = selectElement.selectedIndex;

	// Get the option that was selected
	var optionElement = selectElement[selectedOptionIndex];

	// Grab the text that is inside of this option
	var optionText = optionElement.value;

	// this[this.selectedIndex].value;      THIS WAS THE SHORTER VERSION OF CODE ABOVE 

	//Find the marker that matches the chosen option
	var theChosenMarker; 
	for( var i=0; i<allMarkers.length; i++ ) {

		// Is this this marker
		if( optionText == allMarkers[i].title ) {
			// Found!
			theChosenMarker = allMarkers[i];
			// Make sure the loop finishes by setting i to max number so won't run again
			i = allMarkers.length;
		}

	}

	// Only if we found a marker
	if( theChosenMarker != undefined ) {

		// Make google Maps focus on the marker position
		mainMap.panTo({
			lat: theChosenMarker.getPosition().lat(),
			lng: theChosenMarker.getPosition().lng()
		});

		mainMap.setZoom(15);

	}

}


function getUserLocation() {

	// If geolocation exists as a feature on thi s device 
	if( navigator.geolocation ) {

		// Ask for the user location
		navigator.geolocation.getCurrentPosition(function(position){
			
			// Create a marker for the user
			userMarker = new google.maps.Marker({
				map: mainMap,
				position: {
					lat: position.coords.latitude,
					lng: position.coords.longitude 
				},
				icon: 'http://placehold.it/20x30/f06d06'
			});

			mainMap.panTo ({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			})

			// Work out the closest shop 
			var userLocation = new google.maps.LatLng({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});

			var closestDistance = 99999999999999999999;
			var closestMarker;

			// Loop over all the locations

			for ( var i = 0; i<allMarkers.length; i++ ) {

				// Save a marker in a variable 

				var marker = allMarkers[i];

				var markerLocation = new google.maps.LatLng({
					lat: marker.getPosition().lat(),
					lng: marker.getPosition().lng()
				});

				// Get distance
				var distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, markerLocation);

				// Is this marker closer than the closest one so far?

				if( distance < closestDistance ) {

					// This is the closest store
					closestDistance = distance;
					closestMarker = marker;
				}

			}

			console.log(closestMarker);

			calculateAndDisplayRoute(closestMarker);

		});

	}

} 

function calculateAndDisplayRoute(closestMarker) {

	var destination = new google.maps.LatLng({
		lat: closestMarker.getPosition().lat(),
		lng: closestMarker.getPosition().lng()
	});

	var origin = new google.maps.LatLng({
		lat: userMarker.getPosition().lat(),
		lng: userMarker.getPosition().lng()
	})	

	var options = {
		travelMode: google.maps.TravelMode.DRIVING,
		origin: origin,
		destination: destination
	};

	directionsService.route(options, function(response, status){

		if (status === google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response);
    	} else {
      	  window.alert('Directions request failed due to ' + status);
    	}
	});
}














