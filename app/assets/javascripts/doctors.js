$(function() {
  var api_key = '9c6f158f207798d47ab9a94c95dfaabc';
  var resource_url = 'https://api.betterdoctor.com/2015-01-27/doctors?query=specialty_uid=allergist&location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=50&user_key=' + api_key;

  // Returns an object {Practice Name: {'lat' : 123, 'lng' : 123, } Practice Name.....}
  function getLatLng() {
    return $.getJSON( resource_url, function(data) {
      var latLngInfo = new Object();
      data = latLngInfo;
    });
  }

  var latlng = getLatLng();

  // latlng.success(function(data) {
  //   var latLngInfo = new Object();
  //   var list = data.data
  //   for (var i = 0; i < list.length; i++) {
  //     var practices = list[i].practices;
  //     practices.forEach(function(practice) {
  //       latLngInfo[practice.name] = {'lat': practice.lat, 'lon': practice.lon};
  //     });
  //   }
  //   console.log(latLngInfo);
  // });



  // GOOGLE MAPS API
  function initialize() {

    latlng.success(function(data) {
      var latLngInfo = new Object();
      var list = data.data
      for (var i = 0; i < list.length; i++) {
        var practices = list[i].practices;
        practices.forEach(function(practice) {
          latLngInfo[practice.name] = {'lat': practice.lat, 'lon': practice.lon};
        });
      }
      console.log(latLngInfo);
      for (var i = 0; i < 50; i++ ) {
        var lat = latLngInfo;
        var lon = latLngInfo;
        locations.push ( {name:"BUG", latlng: new google.maps.LatLng(lat, lon)});
      }
    });

    var mapCanvas = document.getElementById('map');

    var mapOptions = {
      center: new google.maps.LatLng(37.773, -122.413),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      }

    var map = new google.maps.Map(mapCanvas, mapOptions)

    var locations = [];

    // for (var i = 0; i < 50; i++ ) {
    //   locations.push ( {name:"BUG", latlng: new google.maps.LatLng(test, test2)})
    // }

    for(var i=0; i<locations.length; i++ ) {
      var marker = new google.maps.Marker({position: locations[i].latlng,map:map, title:locations[i].name});
    }


    // var point = new google.maps.LatLng(25.801579, -80.202176);

    // var marker = new google.maps.Marker({
    //     position:point,
    //     map:map,
    // })


    var contentstring = '<div> Doctor <br> hello <br> sup </div>';
    var infowindow = new google.maps.InfoWindow({
        content:contentstring
        })
    google.maps.event.addListener(marker,'click',function(){
      infowindow.open(map,marker);
    });
  }

  google.maps.event.addDomListener(window, 'load', initialize);

});
