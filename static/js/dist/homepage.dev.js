"use strict";

$(document).ready(function () {
  console.log('loaded');
  var constraints = {
    video: {
      facingMode: "user"
    },
    audio: false
  }; //"user" just for easier testing on PC, should be "environment"

  var cameraWindow = document.querySelector("#cam-window"),
      cameraSensor = document.querySelector("#cam-sensor");

  function cameraStart() {
    console.log('camera start');
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      track = stream.getTracks()[0];
      cameraWindow.srcObject = stream;
    })["catch"](function (error) {
      console.error('something is broken.', error);
    });
  }

  function cameraStop(stream) {
    stream.getTracks().forEach(function (track) {
      if (track.readyState == 'live' && track.kind === 'video') {
        track.stop();
      }
    });
  }

  $("#camera-btn").click(function () {
    $("#home-container").hide();
    $("#camera-container").show();
    cameraStart();
  });
  $("#favorite-btn").click(function () {
    $("#home-container").hide();
    $("#favorite-container").show();
  });
  $("#history-btn").click(function () {
    $("#home-container").hide();
    $("#history-container").show();
  });
  $(".exit-btn").click(function () {
    console.log('exit');
    $("#home-container").show();
    $("#camera-container").hide();
    $("#favorite-container").hide();
    $("#history-container").hide();
  });
  var intervalId = window.setInterval(function () {
    // check every 10 seconds
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position);
        console.log('geolocation is supported');
      });
    } else {
      console.log('geolocation is not supported');
    }
  }, 10000);
});