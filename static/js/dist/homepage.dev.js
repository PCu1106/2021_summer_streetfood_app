"use strict";

$(document).ready(function () {
  console.log('loaded');
  $("#camera-btn").click(function () {
    $("#home-container").hide();
    $("#camera-container").show();
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