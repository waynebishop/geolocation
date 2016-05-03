var mainMap;

function initMap() {

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

	// Now we're ready to show the store markers
	placeStoreMarkers();
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
			title: locations[i].title	
		});

	}


}



