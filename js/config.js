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
config.js - Used for configuring your digital sign
! Must be loaded before core.js
--------------------------------------------------------------------
*/

// Snag a Flickr API key if you want to enable background photos from Flickr (leave empty to use backgroundSource)
var flickrAPIKey = ""

// Choose which method you want to call (flickr.photos.getRecent will get recently uploaded photos from Flickr, flickr.interestingness.getList will pull from Flickr's interestingness pool.)
var flickrMethod = "flickr.interestingness.getList";

// If you want to use your own background photos, point this to a JSON structure. See /js/photos.json for JSON format.
var backgroundSource = "js/photos.json";

// Enter your zip code to get weather information
var weatherZip = 50219;

// If you want announcements point announcementSource to a JSON structure. See js/announcements.json for JSON format.
var announcementSource = "js/announcements.json";

// Set update timings in miliseconds (1 second = 1000 miliseconds)
// announcement panel (15 seconds)
var announcementInterval = 15000;

// backgrounds (67 seconds)
var backgroundInterval = 67000;