var directionDisplay,
	directionsService = new google.maps.DirectionsService(),
	geocoder = new google.maps.Geocoder(),
	map,
	style = STYLE;




function initialize() {
	//"use strict";
	directionsDisplay = new google.maps.DirectionsRenderer();
	var nyc = new google.maps.LatLng(40.761297, -73.980379),
		myOptions = {
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: nyc,
			styles: style,
			disableDefaultUI: true,
			draggable: false,
			zoomControl: false,
			scrollwheel: false,
			disableDoubleClickZoom: true
		};

	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("panel"));

}

function calcRoute() {
	//"use strict";
	var start = document.getElementById("pickup").value,
		end = document.getElementById("dropoff").value,
		distanceInput = document.getElementById("distance"),
		timeInput = document.getElementById("time"),
		outsideNYC = document.getElementById("check"),
		nyc = new google.maps.LatLng(40.761297, -73.980379),
		m2m = document.getElementById("m2m"),
		request = {},
		shortIndex;

	if (outsideNYC.checked) {
		request = {
			origin: nyc,
			destination: end,
			waypoints: [
				{
					location: start,
					stopover: false
                }],
			travelMode: google.maps.DirectionsTravelMode.DRIVING,
			durationInTraffic: true,
			provideRouteAlternatives: true
		};
	} else if (m2m.checked) {
		request = {
			avoidHighways: true,
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING,
			durationInTraffic: true,
			provideRouteAlternatives: true
		};
	} else {
		request = {
			avoidHighways: false,
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING,
			durationInTraffic: true,
			provideRouteAlternatives: true
		};
	}

	directionsService.route(request, function (response, status) {


		if (status == google.maps.DirectionsStatus.OK) {
			shortIndex = findShortestRoute(response);
			// alert('route index is: ' + shortIndex + '');

			directionsDisplay.setDirections(response);
			directionsDisplay.setOptions({
				draggable: false,
				routeIndex: shortIndex,
				polylineOptions: {
					strokeColor: '#ff9933',
					strokeWeight: 5,
					strokeOpacity: 0.75
				}
			});
			// alert('value of route display: ' + directionsDisplay.getRouteIndex() + '');
			var miles = (response.routes[shortIndex].legs[0].distance.value / 1000) * 0.62137,
				time = response.routes[shortIndex].legs[0].duration.text;

			distanceInput.innerHTML = response.routes[shortIndex].legs[0].distance.text;

			timeInput.innerHTML = time;
			calcQuote(miles, time);


		}
	});
}

function calcQuote(d, t) {
	//"use strict";

	var quote = document.getElementById("quote_holder"),
		afterHours = document.getElementById("afterHours"),
		baseFare = document.getElementById("baseFare"),
		tip = document.getElementById("tip"),
		tolls = document.getElementById("tolls"),
		totalFare = document.getElementById("totalFare"),
		expression = 0,
		tipJS = 0,
		tollsJS = 0,
		totalJS = 0;

	if (d < 12) {
		expression = 5 * (Math.floor(Math.abs((40 + (((d) * 10) * 0.5)) / 5)));
		tollsJS = 0;
		if (d <= 1) {
			expression = 40;
			tollsJS = 0;
		}
	} else
	if (d >= 12 && d < 25) {

		expression = (d * 3.75) + 60;
		tollsJS = (expression * 1.2) * 0.05;



	} else if (d >= 25 && d < 50) {
		expression = (d * 4) + 30;
		tollsJS = (expression * 1.2) * 0.05;
	} else if (d >= 50 && d < 100) {
		expression = (d * 3.50);
		tollsJS = (expression * 1.2) * 0.05;

	} else if (d >= 100 && d < 1000) {
		expression = (d * 2.05);
		tollsJS = (expression * 1.2) * 0.05;
	} else if (d > 1000) {
		expression = (d * 1.75);
		tollsJS = (expression * 1.2) * 0.05;
	}

	if (afterHours.checked) {
		expression = expression * 1.25;
	}
	expression = expression.toFixed(2);
	expression = Math.round(expression);
	tipJS = expression * 0.2;
	tollsJs = tollsJS.toFixed(2);
	totalJS = (expression + tipJS + tollsJS);
	totalJS = totalJS.toFixed(2);


	//quote.innerHTML = ('$' + expression + '');
	baseFare.innerHTML = ('$' + expression + '');
	tip.innerHTML = ('$' + tipJS.toFixed(2) + '');
	tolls.innerHTML = ('$' + tollsJS.toFixed(2) + '');
	totalFare.innerHTML = ('$' + totalJS + '');



	/*  
	if (d >= '0' && d < '1') {
	    quote.innerHTML = '40';
	} else if (d >= '1' && d < '2') {
	    quote.innerHTML = '45';
	} else if (d >= '2' && d < '3') {
	    quote.innerHTML = '50';
	} else if (d >= '3' && d < '4') {
	    quote.innerHTML = '55';
	} else if (d >= '4' && d < '5') {
	    quote.innerHTML = '60';
	} else if (d >= '5' && d < '6') {
	    quote.innerHTML = '65';
	} else if (d >= '6' && d < '7') {
	    quote.innerHTML = '70';
	} else if (d >= '7' && d < '8') {
	    quote.innerHTML = '75';
	} else if (d >= '8' && d < '9') {
	    quote.innerHTML = '80';
	} else if (d >= '9' && d < '10') {
	    quote.innerHTML = '85';
	} else if (d >= '10' && d < '11') {
	    quote.innerHTML = '90';
	} else if (d >= '11' && d < '12') {
	    quote.innerHTML = '95';
	} else if (d >= '12' && d < '13') {
	    quote.innerHTML = '100';
	} else {
	    quote.innerHTML = 'call';
	}
    
	*/

}

function secondsToTime(s) {
	var time = s;
	return time;
}

function findShortestRoute(responseObject) {
	// "use strict";
	var value = responseObject.routes[0].legs[0].distance.value,
		i,
		index,
		distanceArray = [];

	for (i = 0; i < responseObject.routes.length; i++) {
		distanceArray[i] = responseObject.routes[i].legs[0].distance.value;
	}

	value = Math.min.apply(null, distanceArray);


	index = distanceArray.indexOf(value);
	//alert('route distances are: ' + distanceArray[0] + ', ' + distanceArray[1] + ', ' + distanceArray[2] + ', index is: ' + index + ', value is: ' + value + '');
	return index;

}