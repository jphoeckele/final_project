$(function() {
  function environment() {
    var insurance = $('select.insurance-dropdown').find('option:selected').val();
    var specialty = $('select.specialty-dropdown').find('option:selected').val();
    var api_key = '9c6f158f207798d47ab9a94c95dfaabc';
    var resource_url = "https://api.betterdoctor.com/2015-01-27/doctors?specialty_uid=" + specialty + "&insurance_uid=" + insurance + "&sort=best-match-desc&location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=25&user_key=" + api_key;
    return {insurance: insurance, specialty: specialty, api_key: api_key, resource_url: resource_url};
  }


  function setEnvironment() {
    var environmentvars = environment();
    var insurance = environmentvars.insurance;
    var specialty = environmentvars.specialty;
    var api_key = environmentvars.api_key;
    var resource_url = environmentvars.resource_url; 
    return {insurance: insurance, specialty: specialty, api_key: api_key, resource_url: resource_url};
  }
  // I put this function inside of the Google Maps Initiliaze function so that
  // the latLngInfo variable is in scope.
  // latlng.success(function(data) {
  //   var latLngInfo = new Object();
  //   var list = data.data
  //   for (var i = 0; i < list.length; i++) {
  //     var practices = list[i].practices;
  //     practices.forEach(function(practice) {
  //       latLngInfo[practice.name] = {'lat': practice.lat, 'lon': practice.lon};
  //     });
  //   }
  // });

  // GOOGLE MAPS API
  function initialize() {
      var mapCanvas = document.getElementById('map');

      var mapOptions = {
        center: new google.maps.LatLng(37.773, -122.413),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      var map = new google.maps.Map(mapCanvas, mapOptions);

      var contentstring = '<div> Doctor <br> hello <br> sup </div>';

      var infowindow = new google.maps.InfoWindow({
        content:contentstring
      })
    }

  var searchButton = document.getElementById('doc-search');
  google.maps.event.addDomListener(window, 'load', initialize);
  google.maps.event.addDomListener(searchButton, 'click', populate);

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
        practices.forEach(function(practice) {
          latLngInfo[practice.name] = {'lat': practice.lat, 'lon': practice.lon};
        });
      }

      var mapCanvas = document.getElementById('map');

      var mapOptions = {
        center: new google.maps.LatLng(37.773, -122.413),
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
        var marker = new google.maps.Marker({position: locations[i].latlng, map:map, title:locations[i].name});
      }

      // google.maps.event.addListener(marker,'click',function(){
      //   infowindow.open(map,marker);
      // });
    });
  }

  // $( ".specialty-dropdown" ).change(initialize);
  // $( ".insurance-dropdown" ).change(initialize);

  $('#doc-search').on('click', getDocProfile);
  $('.zip-validate').on('click', IsValidZipCode);

  //Used to get and put doc info list to the screen
  function getDocProfile() {
    var environmentVariables = setEnvironment();

    $.getJSON(environmentVariables.resource_url, function(data) {
      var list = data.data;
      var profiles = "";
      for (var i = 0; i < list.length; i++) {
        var profile = list[i].profile;
        var specialties = list[i].specialties;
        var specialty = specialties[0].actor;
        if(!list[i].ratings[0]) {
          var stars = "https://asset2.betterdoctor.com/assets/consumer/stars/stars-small-4.5.png"
        } else {
          var ratings = list[i].ratings[0];
          var stars = ratings.image_url_small_2x;
        }
        profiles += (template(profile.first_name, profile.last_name, specialty, stars, profile.image_url));
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
  function template(first_name, last_name, specialty, stars, picture) {
    return ["<tr>",
    "<td>" + first_name + " " + last_name + "</td>",
    "<td>" + specialty + "</td>",
    "<td><img src=" + stars + "></td>",
    "<td><img src=" + picture + "></td>",
    "</tr>"
    ].join();
  }
});

// Example of how to grab profile info and append to pages
// $.getJSON( resource_url, function(data) {
//   var list = data.data;
//   var profile = list[0];
//   console.log(list);
//   $('.doc-index').append(template(profile.profile.first_name, profile.profile.title, profile.profile.image_url));
// });
// function template(name, data, picture) {
//   return ["<tr>",
//             "<td>" + name + "</td>",
//             "<td>" + data + "</td>",
//             "<td>" + picture + "</td>",
//         "</tr>"
//         ].join();
// }
