// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.readyselector
//= require turbolinks
//= require_tree .

$(function() {
  $('form#new_message').on('ajax:complete', function(event, xhr, status, error){
    $('.message-list').append(xhr.responseText);
    $('#message_title').val("");
    $('#message_description').val("");
  });
});

//Javascript that only runs on the homepage view
$('body.sessions.homepage').ready(function() {
  var location;
  var latitude;
  var longitude;
  var infowindow;

  $('#zip-validate').data('clicked', false);

  //Disable's the search button unless the validate button has been clicked
  function disableSearch() {
    if(!$('#zip-validate').data('clicked')) {
      $('.specialty-dropdown').prop('disabled', true);
      $('.insurance-dropdown').prop('disabled', true);
      $('#doc-search :input').prop('disabled', true);
    } else {
      $('.specialty-dropdown').prop('disabled', false);
      $('.insurance-dropdown').prop('disabled', false);
      $('#doc-search :input').prop('disabled', false);
    }
  }

  disableSearch();

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

  function getEnvironment() {
    var insurance = $('select.insurance-dropdown').find('option:selected').val();
    var specialty = $('select.specialty-dropdown').find('option:selected').val();
    var api_key = '9c6f158f207798d47ab9a94c95dfaabc';
    var resource_url = "https://api.betterdoctor.com/2015-01-27/doctors?specialty_uid=" + specialty + "&insurance_uid=" + insurance + "&sort=rating-desc&location=" + location + "%2C100&user_location=" + location + "&skip=0&limit=25&user_key=" + api_key;
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

  function addListener(marker, map, contentstring) {
    var infowindow = new google.maps.InfoWindow({
            content: contentstring,
            position: marker.position
        });

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
      latLngInfo = [];
      var list = data.data
      console.log(list);
      for (var i = 0; i < list.length; i++) {
        var practices = list[i].practices[0];
        var profile = list[i].profile;
        var specialties = list[i].specialties;
        var address = list[i].practices[0].visit_address;
        var specialty = specialties[0].actor;
        var contentstring = box(profile.image_url, profile.first_name,
                                profile.last_name,
                                specialty,
                                address.street,
                                address.city,
                                address.state,
                                address.zip
                            );
        latLngInfo.push (practices);
      }

      console.log(latLngInfo);

      var mapCanvas = document.getElementById('map');

      var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 8,
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
          animation: google.maps.Animation.DROP,
          title: locations[i].name
        });

        // var infowindow = new google.maps.InfoWindow({
        //     content:contentstring,
        //     position: marker.position
        // });

        addListener(marker, map, contentstring);
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
          var stars = ratings.image_url_small;
        }
        profiles += (template(profile.first_name, profile.last_name, phone, address.street, address.city, address.state, address.zip, stars, profile.image_url));
      }
      $('.doc-index').html(profiles);
    });
  }

  //Template for indexing doctors
  function template(first_name, last_name, phone, street, city, state, zip, stars, picture) {
    return ["<tr>",
    "<td>" + first_name + " " + last_name + "</td>",
    "<td><a href='tel:" + phone + "'>" + phone + "</a></td>",
    "<td>" + street + " " + city + ", "+ state + ", " + zip + "</td>",
    "<td><img src=" + stars + "></td>",
    "<td><img src=" + picture + "></td>",
    "</tr>"
    ].join();
  }

   function box(image_url, first_name, last_name, specialty, street, city, state, zip) {
    return [
    "<p><img src=" + image_url + ">" + first_name + " " + last_name + "<br>" + specialty + "<br>" + street + " " + city + ", "+ state + ", " + zip + "</p>"
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
    $(this).data('clicked', true);
    allowSearch();
  });
  google.maps.event.addDomListener(searchButton, 'click', function() {
    populate();
  });

  function allowSearch() {
    if($('#zip-validate').data('clicked')) {
      $('.specialty-dropdown').prop('disabled', false);
      $('.insurance-dropdown').prop('disabled', false);
      $('#doc-search :input').prop('disabled', false);
    } else {
      $('.specialty-dropdown').prop('disabled', true);
      $('.insurance-dropdown').prop('disabled', true);
      $('#doc-search :input').prop('disabled', true);
    }
  }

  //This doc-search button also pulls the profiles
  $('#doc-search').on('click', getDocProfile);
});


