$(document).ready(function(){
  console.log('loaded')

  var constraints = { video: { facingMode: "user"}, audio: false}; //"user" just for easier testing on PC, should be "environment"

  const cameraWindow = document.querySelector("#cam-window"),
        cameraSensor = document.querySelector("#cam-sensor")
  
  function cameraStart() {
    console.log('camera start')
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        track = stream.getTracks()[0];
        cameraWindow.srcObject = stream;
      })
      .catch(function(error){
        console.error('something is broken.',error);
      });
  }

  $("#camera-btn").click(function(){
    $("#home-container").hide();
    $("#camera-container").show();
    cameraStart();
  });
  
  $("#favorite-btn").click(function(){
    $("#home-container").hide();
    $("#favorite-container").show();
  });
  
  $("#history-btn").click(function(){
    $("#home-container").hide();
    $("#history-container").show();
  });

  
  $(".exit-btn").click(function(){
    console.log('exit')
    $("#home-container").show();
    $("#camera-container").hide();
    $("#favorite-container").hide();
    $("#history-container").hide();
  });

  $("#camera-exit").click(function(){
    console.log('camera stop');
    cameraWindow.srcObject.getTracks().forEach(function(track) {
      track.stop();
    });
  });
  
  //check gps signal each 10 sec and show with icon
  let intervalId = window.setInterval(function(){

    // var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    // console.log(wpid);
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
    // if(navigator.geolocation) {
    //   console.log('geolocation is supported');
    //   navigator.geolocation.watchPosition(function(position){
    //     if(position.coords.latitude){
    //       console.log('empty');
    //     }
    //     if(position){
    //     }
    //     else{
    //       console.log('n');
    //       $('#gps-signal').attr('src', '../../static/file/gps-n.png')
    //       console.log(position);
    //     }
    //   }), 
    //   function(error) {
    //     if (error.code == error.PERMISSION_DENIED)
    //       console.log("you denied me :-(");
    //   };
    // }
    // else{

    //   console.log('geolocation is not supported');
    // }
  }, 1000);
})

var geo_options = {
  enableHighAccuracy: true,
  maximumAge        : 10000,
  timeout           : 3000
};

var last_timestamp = 0;
function geo_success(position) {
  if(position.timestamp !== last_timestamp){
    console.log('y');
    $('#gps-signal').attr('src', '../../static/file/gps-y.png')
    last_timestamp = position.timestamp;
    console.log(position);
  }
  else{
    console.log('no new')
  }
};

function geo_error(error) {
  console.log(error.message);
  $('#gps-signal').attr('src', '../../static/file/gps-n.png')
  // console.log(position);
};

if(window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', 
    function(event) {
      var a = document.getElementById('alpha');
      alpha = event.alpha;
      a.innerHTML = Math.round(alpha);
    }, 
  false);
}else{
  document.querySelector('body').innerHTML = '你的瀏覽器不支援喔';
}