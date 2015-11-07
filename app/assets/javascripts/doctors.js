$(document).ready(function() {
  var api_key = '9c6f158f207798d47ab9a94c95dfaabc';

  var resource_url = 'https://api.betterdoctor.com/2015-01-27/doctors?query=Allergy&specialty_uid=allergist&skip=0&limit=10&user_key=' + api_key;

  $.getJSON( resource_url, function(data) {
    var latLngInfo = new Object();
    var list = data.data
    for (var i = 0; i < list.length; i++) {
      var practices = list[i].practices;
      practices.forEach(function(practice) {
        latLngInfo[practice.name] = {'lat': practice.lat, 'lng': practice.lon};
      });
    }
    console.log(latLngInfo);
    return latLngInfo;
  });
});





// $.getJSON( resource_url, function(data) {
//   var list = data.data;
//   var profile = list[0];
//   console.log(list[0].practices[0].lat);
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

// $.ajax({
//   dataType: "json",
//   url: resource_url,
//   data: data,
//   success: success
// });
