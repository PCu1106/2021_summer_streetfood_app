$(document).ready(function(){
  console.log('loaded')

  $("#camera-btn").click(function(){
    $("#home-container").hide();
    $("#camera-container").show();
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

})