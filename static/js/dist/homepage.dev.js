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
  $("#camera-exit").click(function () {
    $("#home-container").show();
    $("#camera-container").hide();
  });
});