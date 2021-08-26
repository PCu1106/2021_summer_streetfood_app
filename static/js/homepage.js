$(document).ready(function(){
  console.log('loaded')

  $("#camera-btn").click(function(){
    $("#home-container").hide();
    $("#camera-container").show();
  });
  
  $("#camera-container").click(function(){
    $("#home-container").show();
    $("#camera-container").hide();
  });

})