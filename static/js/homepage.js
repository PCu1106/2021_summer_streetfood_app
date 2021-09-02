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
  
  
  let intervalId = window.setInterval(function(){ // check every 10 seconds
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        console.log('geolocation is supported');
      });}
    else{
      console.log('geolocation is not supported');
    }
  }, 10000);
  
})