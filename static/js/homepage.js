$(document).ready(function(){
  console.log('loaded')

  //-----------------camera function---------------
  const constraints = { video: { facingMode: "environment"}, audio: false};

  const cameraWindow = document.querySelector("#cam-window"),
        cameraSensor = document.querySelector("#cam-sensor"),
        cameraOutput = document.querySelector("#cam-output")

  function cameraStart() {
    console.log('camera start')
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        //Window.stream = stream;
        cameraWindow.srcObject = stream;
        cameraWindow.play();
        //console.log(Window.stream); //show MediaStream info
      })
      .catch(function(error){
        console.error('something is broken.',error);
      });
      imgCapture(); //capture image and return image base64 code every second
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
    cameraOutput.src = cameraSensor.toDataURL("image/png");
  }

  function imgCapture() {
    console.log('capture')
    window.setInterval(function(){
      cameraSensor.width = cameraWindow.videoWidth;
      cameraSensor.height = cameraWindow.videoHeight;
      cameraSensor.getContext("2d").drawImage(cameraWindow, 0, 0,cameraSensor.width,cameraSensor.height);
      var img = cameraSensor.toDataURL("image/png");
      //console.log(img);
      // --------send base64 to server----------
      //$.ajax({
      //  data : img,
      //  url : '/list',
      //  type : 'post',
      //  dataType : 'json',
      //  success : function(data){
      //    console.log(data);
      //  },
      //  error : function(jqXHR, textStatus, errorThrown){
      //    alert(jqXHR.textStatus);
      //  }
      //});
      //---------------------------------------
    },3000);
  }

  //-----------------page switch---------------
  $("#camera-btn").click(function(){
    //delay for camera ready
    setTimeout(function(){
      $("#home-container").hide();
      $("#camera-container").show();
      $("#shoot-btn").show();
      $("#shoot-again-btn").hide();
      $("#goto-list-btn").hide();
      $("#restaurant-list").hide();
      console.log('hide')
    }, 1000); 
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

  $("#history-sw").click(function(){
    $("#home-container").hide();
    $("#favorite-container").hide();
    $("#history-container").show();
  });

  $("#favorite-sw").click(function(){
    $("#home-container").hide();
    $("#favorite-container").show();
    $("#history-container").hide();
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

  //-----------------cam action---------------
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

  // list 
  $("#goto-list-btn").click(function(){
    $("#goto-list-btn").hide();
    $("#shoot-again-btn").hide();
    $("#cam-output").hide();
    $("#restaurant-list").show();
    var img = { img_64 : document.getElementById("cam-output").getAttribute("src")};
    // send base64 to server
    $.ajax({
      data : img,
      url : '/list',
      type : 'post',
      dataType : 'json',
      success : function(data){
        console.log(data);
      },
      error : function(jqXHR, textStatus, errorThrown){
        alert(jqXHR.textStatus);
      }
    });
  });
  //check gps signal each 10 sec and show with icon
  nonew = 0
  let intervalId = window.setInterval(function(){
    navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
  }, 1000);
})

//-----------------geo function---------------
var geo_options = {
  enableHighAccuracy: true,
  maximumAge        : 5000,
  timeout           : 3000
};

var last_timestamp = 0;
function geo_success(position) {
  if(position.timestamp !== last_timestamp){
    // console.log('y');
    $('#gps-signal').attr('src', '../../static/file/gps-y.png')
    last_timestamp = position.timestamp;
    console.log(position);
    var a = document.getElementById('geoinfo');
    latitude = Number((position.coords.latitude).toFixed(3)).toString();
    longitude = Number((position.coords.longitude).toFixed(3)).toString();
    a.innerHTML = latitude + ', ' + longitude
    nonew = 0
  }
  else{
    console.log('no new geo info')
    // console.log(nonew)
    nonew += 1
    if (nonew > 5){
      $('#gps-signal').attr('src', '../../static/file/gps-weak.png')
      document.getElementById('geoinfo').innerHTML = 'confirming'
    }
  }
};

function geo_error(error) {
  console.log(error.message);
  $('#gps-signal').attr('src', '../../static/file/gps-n.png')
  // console.log(position);
  document.getElementById('geoinfo').innerHTML = 'no permission'
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

  //-----------------favorite action---------------
  function save(elem) {
    console.log(elem.value);
  }