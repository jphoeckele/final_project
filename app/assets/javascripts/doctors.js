$(function() {
  var location;
  var latitude;
  var longitude;
  function getCoordinates(zipcode) {
    geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': zipcode}, function callbackLat(results, status){

    var lat = results[0].geometry.location.lat();
    var lon = results[0].geometry.location.lng();
    var loc = lat + "%2C" + lon;
    location = loc;
    console.log(location);
    longitude = lon;
    latitude = lat;
    });
  }

  function getZipcode(zipcode){
    getCoordinates(zipcode);
  }

  // $('.zip-validate').on('click', getZipcode($('#zip').val()));
  // $('#doc-search').on('click', function() {
  //   getZipcode($('#zip').val());
  // });

  function getEnvironment() {
    var insurance = $('select.insurance-dropdown').find('option:selected').val();
    var specialty = $('select.specialty-dropdown').find('option:selected').val();
    var api_key = '9c6f158f207798d47ab9a94c95dfaabc';
    var resource_url = "https://api.betterdoctor.com/2015-01-27/doctors?specialty_uid=" + specialty + "&insurance_uid=" + insurance + "&sort=rating-desc&location=" + location + "%2C100&user_location=37.773%2C-122.413&skip=0&limit=25&user_key=" + api_key;
    return {insurance: insurance, specialty: specialty, api_key: api_key, resource_url: resource_url};
  }

  function setEnvironment() {
    var environmentVars = getEnvironment();
    var insurance = environmentVars.insurance;
    var specialty = environmentVars.specialty;
    var api_key = environmentVars.api_key;
    var resource_url = environmentVars.resource_url;
    return {insurance: insurance, specialty: specialty, api_key: api_key, resource_url: resource_url};
  }

  function addListener(marker, infowindow, map) {
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }

  // GOOGLE MAPS API
  function initialize() {
    var mapCanvas = document.getElementById('map');

    var mapOptions = {
      center: new google.maps.LatLng(38.8833, -77.0167),
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(mapCanvas, mapOptions);

    }

  function populate() {
    var environmentVariables = setEnvironment();

    function getLatLng() {
      return $.getJSON(environmentVariables.resource_url, function(data) {
        var latLngInfo = new Object();
        data = latLngInfo;
      });
    }

    var latlng = getLatLng();

    latlng.success(function(data) {
      latLngInfo = new Object();
      var list = data.data
      for (var i = 0; i < list.length; i++) {
        var practices = list[i].practices;
        var profile = list[i].profile;
        var specialties = list[i].specialties;
        var address = list[i].practices[0].visit_address;
        var specialty = specialties[0].actor;
        var contentstring = box(profile.first_name, 
                                profile.last_name, 
                                specialty, 
                                address.street, 
                                address.city, 
                                address.state, 
                                address.zip
                            );
        practices.forEach(function(practice) {
          latLngInfo[practice.name] = {'lat': practice.lat, 'lon': practice.lon};
        });
      }

      var mapCanvas = document.getElementById('map');

      var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      var map = new google.maps.Map(mapCanvas, mapOptions);

      var locations = [];

      for (var practice in latLngInfo) {
        var lat = latLngInfo[practice].lat;
        var lon = latLngInfo[practice].lon;
        locations.push ( {name: practice, latlng: new google.maps.LatLng(lat, lon)});
      }

      for(var i=0; i<locations.length; i++ ) {

        var marker = new google.maps.Marker({
          position: locations[i].latlng, 
          map: map, 
          title: locations[i].name
        }); 

        var infowindow = new google.maps.InfoWindow({
            content:contentstring,
            position: marker.position
        });

        addListener(marker, infowindow, map);
      }
    });
  }
  //Used to get and put doc info list to the screen
  function getDocProfile() {
    var environmentVariables = setEnvironment();

    $.getJSON(environmentVariables.resource_url, function(data) {
      var list = data.data;
      var profiles = "";
      for (var i = 0; i < list.length; i++) {
        var profile = list[i].profile;
        var specialties = list[i].specialties;
        var phone = list[i].practices[0].phones[0].number;
        var address = list[i].practices[0].visit_address;
        //console.log(list);
        var specialty = specialties[0].actor;
        if(!list[i].ratings[0]) {
          var stars = "/assets/rating-not-found.png"
        } else {
          var ratings = list[i].ratings[0];
          var stars = ratings.image_url_small_2x;
        }
        profiles += (template(profile.first_name, profile.last_name, specialty, phone, address.street, address.city, address.state, address.zip, stars, profile.image_url));
      }
      $('.doc-index').html(profiles);
    });
  }

  function IsValidZipCode() {
    var zip = $('#zip').val();
    var isValid = /^[0-9]{5}?$/.test(zip);
    if (isValid){
      alert('We need to convert to lat lon here');
    } else {
      alert('Invalid ZipCode');
    }
  }

  //Template for indexing doctors
  function template(first_name, last_name, specialty, phone, street, city, state, zip, stars, picture) {
    return ["<tr>",
    "<td>" + first_name + " " + last_name + "</td>",
    "<td>" + specialty + "</td>",
    "<td><a href='tel:" + phone + "'>" + phone + "</a></td>",
    "<td>" + street + " " + city + ", "+ state + ", " + zip + "</td>",
    "<td><img src=" + stars + "></td>",
    "<td><img src=" + picture + "></td>",
    "</tr>"
    ].join();
  }

   function box(first_name, last_name, specialty, street, city, state, zip) {
    return [
    "<p>" + first_name + " " + last_name + "<br>" + specialty + "<br>" + street + " " + city + ", "+ state + ", " + zip + "</p>"
    ].join();
  }


  //Sets the search button as a variable to be called by the google maps DomListener
  var searchButton = document.getElementById('doc-search');
  var validateButton = document.getElementById('zip-validate');

  //First we initialize an empty map, then on click of the search button we populate the map
  google.maps.event.addDomListener(window, 'load', initialize);
  google.maps.event.addDomListener(validateButton, 'click', function(e) {
    e.preventDefault();
    getZipcode($('#zip').val());
  });
  google.maps.event.addDomListener(searchButton, 'click', function() {
    populate();
  });

  //This doc-search button also pulls the profiles
  $('#doc-search').on('click', getDocProfile);
  // $('.zip-validate').on('click', IsValidZipCode);
});
