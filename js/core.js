/*
--------------------------------------------------------------------
 ______      _ _     _  _    ___  
|  ____|    (_) |   | || |  / _ \ 
| |__  __  ___| |_  | || |_| | | |
|  __| \ \/ / | __| |__   _| | | |
| |____ >  <| | |_     | | | |_| |
|______/_/\_\_|\__|    |_|  \___/ 

Digital Signage
--------------------------------------------------------------------
core.js - Core javascript to implement digital signage.
! Must be loaded after config.js !
--------------------------------------------------------------------
*/

// Global variables
var currentBackgroundSlide = 0;
var backgroundCount = 0;
var currentAnnouncement = 0;
var announcementCount = 0;
var theWindow = $(window);
var timeout;

// Get weather from Yahoo!
function checkWeather(){
	$.ajax({
		url: "http://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20location%3D%22" + weatherZip + "%22&format=json"
	}).done(function(data){
		$('#weather').html(data.query.results.channel.item.condition.temp + "&deg; " + data.query.results.channel.item.condition.text);
	});
}

//Get announcements
function getAnnouncements(){
	$.getJSON(announcementSource, function(data){
		$('#announce').fadeOut( function(){
			if(announcementCount == 0){
				for(property in data.announcements){
					announcementCount ++;
				}
			}
			$('#announce').html(
				'<h1>' + data.announcements[currentAnnouncement].title + "</h1>"
				+ "<p>" + data.announcements[currentAnnouncement].message + "</p>"
				+ "<p><img src='"+ data.announcements[currentAnnouncement].photo + "'>").fadeIn();
			if(currentAnnouncement < announcementCount-1){
				currentAnnouncement ++;
			}else{
				currentAnnouncement = 0;
			}
		});
	})
}

function moveBackgroundSlide(){
	if(currentBackgroundSlide < backgroundCount-1){
		currentBackgroundSlide ++;
	}else{
		currentBackgroundSlide = 0;
	}
}

//Get background photos from Flickr
function getFlickrPhotos(){
	$.getJSON("http://api.flickr.com/services/rest/?method=" + flickrMethod + "&api_key=" + flickrAPIKey + "&per_page=10&format=json&nojsoncallback=1", function(data){
			if(backgroundCount == 0){
				for(property in data.photos.photo){
					backgroundCount ++;
				}
			}
			var photoURL = "http://farm" + data.photos.photo[currentBackgroundSlide].farm + ".static.flickr.com/" + data.photos.photo[currentBackgroundSlide].server + "/" + data.photos.photo[currentBackgroundSlide].id + "_" + data.photos.photo[currentBackgroundSlide].secret + "_b.jpg";
			$('#background').html('<img id="bg" src="' + photoURL + '" alt="Background Photo"/>');
			// Get image dimmensions
			var img = new Image();
			img.src = photoURL;
			var aspectRatio = img.width / img.height;
			if ( (theWindow.width() / theWindow.height()) < aspectRatio ) {
				$('#bg').css("width", "");
				$('#bg').css("height", "100%");
			} else {
				$('#bg').css("height", "");
				$('#bg').css("width", "100%");
			}
			moveBackgroundSlide();
		}
	);
}

//Get backgrounds for different source
function loadBackground(){
	$.getJSON(backgroundSource, function(data){
		if(backgroundCount == 0){
			for(property in data.Photos){
				backgroundCount ++;
			}
		}
		$('#background').html('<img id="bg" src="http:' + data.Photos[currentBackgroundSlide].photoURL + '" alt="Background Photo"/>')
			var aspectRatio = data.Photos[currentBackgroundSlide].imgWidth / data.Photos[currentBackgroundSlide].imgHeight;
		if ( (theWindow.width() / theWindow.height()) < aspectRatio ) {
			$('#bg').css("width", "");
			$('#bg').css("height", "100%");
		} else {
			$('#bg').css("height", "");
			$('#bg').css("width", "100%");
		}
		moveBackgroundSlide();
	});
}

// Clock functionality
function updateClock()
{
  var currentTime = new Date();
  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  var currentSeconds = currentTime.getSeconds();

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Set "AM" or "PM"
  var timeOfDay = ( currentHours < 12 ) ? "A" : "P";

  // Convert the hours component to 12-hour format if needed
  currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  // Convert an hours component of "0" to "12"
  currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes //+ " " + timeOfDay;

  // Update the time display
  $("#clock").html(currentTimeString);
}		

//Execute these functions on page load
$(document).ready(function() {
	//For testing functions
	$('html').click(function(){
		if(flickrAPIKey.length  > 0){
		getFlickrPhotos();
		}else{
			loadBackground();
		}
	});
	// Load backgrounds
	if(flickrAPIKey.length  > 0){
		getFlickrPhotos();
	}else{
		loadBackground();
	}
	updateClock();
	getAnnouncements()
	checkWeather();
	
	//Start the clock feature
});

//Update the clock every second
window.setInterval(function(){
	updateClock();
},1000);
//Check weather every 15 minutes
window.setInterval(function(){
	checkWeather();
},900000);

//User configured updates
window.setInterval(function(){
	getAnnouncements();
},announcementInterval)
window.setInterval(function(){
	if(flickrAPIKey.length  > 0){
		getFlickrPhotos();
	}else{
		loadBackground();
	}
},backgroundInterval);