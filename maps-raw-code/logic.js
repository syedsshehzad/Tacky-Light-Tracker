// Google Maps Javascript API
const apiKey = "AIzaSyBkUtokw3tHbQTwMkXpIapkw-us_Ln1RKE"

// Initialize Firebase
const config = {
    apiKey: "AIzaSyAOD57dd2jJshQdrBRFnXyvp2M__Q0MEec",
    authDomain: "tacky-light-tracker.firebaseapp.com",
    databaseURL: "https://tacky-light-tracker.firebaseio.com",
    projectId: "tacky-light-tracker",
    storageBucket: "tacky-light-tracker.appspot.com",
    messagingSenderId: "814831670605"
};
  firebase.initializeApp(config);
  let database = firebase.database();
  let mapDatabase = database.ref('mapData');
  let data = {};
  let map;
  let marker;
  let infowindow;
  let messagewindow;
  let address;
  let geocoder;

function initMap() {
    let richmond = {lat: 37.540, lng: -77.436};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: richmond
    });

    geocoder = new google.maps.Geocoder();
    document.getElementById('geosubmit').addEventListener('click',function () {
      geocodeAddress (geocoder, map);
    });
    
    marker = new google.maps.Marker({
      position: richmond,
      map: map
    });

    infowindow = new google.maps.InfoWindow({
          content: `  
          <div id="form">
          <table>
            <tr><td>Name:</td> <td><input type='text' id='name'/></td></tr>
            <tr><td>Address:</td> <td><input type='text' id='formaddress'/></td></tr>
            <tr><td>Type:</td> <td><select id='type'> +
                 <option value='bar' SELECTED>bar</option>
                 <option value='restaurant'>restaurant</option>
                 </select> </td></tr>
                 <tr><td></td><td><input type='button' value='Save'/></td></tr>
          </table>
          </div>`
        });

    messagewindow = new google.maps.InfoWindow({
      content: `<div id="message">Location saved</div>`
    });

    google.maps.event.addListener(map, 'click', function(event) {
      marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });
    });
};

function geocodeAddress(geocoder, resultsMap) {
        address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
            address = results[0].formatted_address;
            console.log(address)

            google.maps.event.addListener(marker, 'click', function(){
              infowindow.open(map, marker);
              $('#formaddress').attr("value", address);
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
          console.log(results)
          data = {
            address: results[0].formatted_address,
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
          };
          mapDatabase.push({
            locationData: data
          })
        });
};

mapDatabase.on('child_added', function(snapshot){
  let pos = {
    lat: snapshot.val().locationData.lat,
    lng: snapshot.val().locationData.lng
  }
  marker = new google.maps.Marker({
    map: map,
    position: pos
  })

  console.log(snapshot.val().locationData.address)
});
