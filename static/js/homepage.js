$(document).ready(function(){
  console.log('loaded')

  const constraints = { video: { facingMode: "environment"}, audio: false};

  const cameraWindow = document.querySelector("#cam-window"),
        cameraSensor = document.querySelector("#cam-sensor"),
        cameraOutput = document.querySelector("#cam-output")
  
  function cameraStart() {
    console.log('camera start')
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        Window.stream = stream;
        cameraWindow.srcObject = stream;
        cameraWindow.play();
        console.log(Window.stream); //show MediaStream info
      })
      .catch(function(error){
        console.error('something is broken.',error);
      });
  }

  function cameraStop() {
    if(cameraWindow.srcObject != null){
      console.log('camera stop')
      var videoStream = cameraWindow.srcObject.getTracks();
      if(videoStream != null){
          videoStream.forEach(stream => {
          stream.stop();
        });
        cameraWindow.srcObject = null;
      }
    } 
  }

  function cameraSnapshot() {
    console.log('take picture')
    cameraOutput.style.display = "block";
    cameraSensor.width = cameraWindow.videoWidth;
    cameraSensor.height = cameraWindow.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraWindow, 0, 0,cameraSensor.width,cameraSensor.height);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
  }

  $("#camera-btn").click(function(){
    $("#home-container").hide();
    $("#camera-container").show();
    $("#shoot-btn").show();
    $("#shoot-again-btn").hide();
    $("#goto-list-btn").hide();
    cameraOutput.style.display = "none";
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
    cameraStop();
  });

  $("#shoot-btn").click(function(){
    cameraSnapshot();
    cameraStop();
    $("#shoot-btn").hide();
    $("#shoot-again-btn").show();
    $("#goto-list-btn").show();
  });
  
  $("#shoot-again-btn").click(function(){
    $("#camera-container").show();
    $("#shoot-btn").show();
    $("#shoot-again-btn").hide();
    $("#goto-list-btn").hide();
    cameraOutput.style.display = "none";
    cameraStart();
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