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
      //imgCapture(); //capture image and return image base64 code every 3-second
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
      // console.log('hide')
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
    // navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
    console.log(latitude_return, longitude_return)
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
    //清空restaurant-list
    var restaurant_list = document.querySelector("#restaurant-list");
    deleteChild(restaurant_list);
    //create "商家資訊" title
    shopinfo_title();
    $("#restaurant-list").show();
    var img = { img_64 : document.getElementById("cam-output").getAttribute("src")};
    // send base64 to server
    //console.log('list');
    $.ajax({
      data : img,
      //data : { 'img': img, 'latitude': latitude_return, 'longitude': longitude_return },
      url : '/list',
      type : 'post',
      dataType : 'json',
      success : function(result){
        // if received data correctly
        // result : [ ]
        console.log(result)
        var length = getJsonLength(result);
        console.log('length: '+length)
        if (length == 0) {
          console.log('查無商家資訊')
        }
        else {
          for (var i=0; i<length; i++) {
            var obj = JSON.parse(result[i]); //一間店的所有資訊
            showList(obj,i);
            $("#shop_save_"+i.toString()).click(function(){
              //return obj name to server.js
              saveListToFav(obj.name);
            });
          }
        }
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
var latitude_return, longitude_return;
function geo_success(position) {
  if(position.timestamp !== last_timestamp){
    // console.log('y');
    $('#gps-signal').attr('src', '../../static/file/gps-y.png')
    last_timestamp = position.timestamp;
    // console.log(position);
    latitude_return = position.coords.latitude; //this variable store for returning to server.js by ajax
    longitude_return = position.coords.longitude; //this variable store for returning to server.js by ajax
    latitude = Number((position.coords.latitude).toFixed(6)).toString();
    longitude = Number((position.coords.longitude).toFixed(6)).toString();
    $('#position').html('定位' + latitude + ', ' + longitude)
    nonew = 0
  }
  else{
    // console.log('no new geo info')
    // console.log(nonew)
    nonew += 1
    if (nonew > 5){
      $('#gps-signal').attr('src', '../../static/file/gps-weak.png')
      $('#position').html('confirming')
    }
  }
};

function geo_error(error) {
  console.log(error.message);
  $('#gps-signal').attr('src', '../../static/file/gps-n.png')
  // console.log(position);
  $('#position').html('no permission')
};

if(window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', 
    function(event) {
      // var a = document.getElementById('alpha');
      // alpha = event.alpha;
      // a.innerHTML = Math.round(alpha);
      $('#direction').html('方向' + Math.round(event.alpha))
    }, 
  false);
}else{
  document.querySelector('body').innerHTML = '你的瀏覽器不支援喔';
}

//-----------------favorite action---------------
function save(elem) {
  console.log(elem.value);
  $.post('/save', {
    id: elem.value
  }, (data) => {
      console.log('return: ' + data);
  })
}
//save(從restaurant-list按下"儲存"button後將店家名稱存進我的最愛)
function saveListToFav(shop_name) {
  console.log(shop_name);
  var name = {name: shop_name};
  $.ajax({
    data : name,
    url : '/saveToFav',
    type : 'post',
    dataType : 'json',
    success : function(){
      console.log('success')
    },
    error : function(jqXHR, textStatus, errorThrown){
      alert(jqXHR.textStatus);
    }
  });
}

//get json length
function getJsonLength(jsonData) {
  var jsonLength = 0;
  for(var item in jsonData){
    jsonLength++;
  }
  return jsonLength;
}

//create "商家資訊" title
function shopinfo_title(){
  //<h1 class="title" align="center"><b>商家資訊</b></h1>
  var title = document.createElement('h1');
  title.setAttribute('class','title');
  title.setAttribute('id','shopinfo');
  title.setAttribute('align','center');
  document.querySelector("#restaurant-list").appendChild(title);
  var txt = document.createElement('b');
  txt.textContent = "商家資訊";
  document.querySelector("#shopinfo").appendChild(txt);
}

//dynamic show shop-list in homepage.html
function showList(object,num) {
  //create new shop-item DOM under $("restaurant-list")
  //<div class="shop-item" id="shop"+num></div>
  var shop = document.createElement('div');
  shop.setAttribute('class','shop-item');
  shop.setAttribute('id','shop' + num.toString());
  document.querySelector("#restaurant-list").appendChild(shop);
  //create new DOMs under shop-item
  var shop_item = document.querySelector("#shop"+num.toString());
  //<p class="shop-name" align="center">name</p>
  var shop_name = document.createElement('p');
  shop_name.textContent = object.name;
  shop_name.setAttribute('class','shop-name');
  shop_name.setAttribute('align','center');
  shop_item.appendChild(shop_name);
  //<p class="score">4.4</p>
  var shop_score = document.createElement('p');
  shop_score.textContent = object.score;
  shop_score.setAttribute('class','score');
  shop_item.appendChild(shop_score);
  //<div class="ratings"><div class="empty_star">★★★★★</div><div class="full_star">★★★★★</div></div>
  var shop_ratings = document.createElement('div');
  shop_ratings.setAttribute('class','ratings');
  shop_item.appendChild(shop_ratings);
  var empty_star = document.createElement('div');
  empty_star.textContent = "★★★★★";
  empty_star.setAttribute('class','empty_star');
  shop_ratings.appendChild(empty_star);
  var full_start = document.createElement('div');
  full_start.textContent = "★★★★★";
  full_start.setAttribute('class','full_star')
  shop_ratings.appendChild(full_start);
  //<p class="command">1825則評論</p>
  var shop_command = document.createElement('p');
  shop_command.textContent = object.command;
  shop_command.setAttribute('class','command');
  shop_item.appendChild(shop_command);
  //<p class="phone-number">電話:06-2365768</p>
  var shop_phone = document.createElement('p');
  shop_phone.textContent = object.phone;
  shop_phone.setAttribute('class','phone-number');
  shop_item.appendChild(shop_phone);
  //<p class="business-hours">營業時間:11:00-21:00</p>
  var shop_time = document.createElement('p');
  shop_time.textContent = object.time;
  shop_time.setAttribute('class','business-hours');
  shop_item.appendChild(shop_time);
  //<div class="control_btn"><div class="small-block">電話</div><div class="small-block">網站</div></div>
  var control_btn = document.createElement('div')
  control_btn.setAttribute('id','control_btn');
  control_btn.setAttribute('class','control_btn');
  shop_item.appendChild(control_btn);

  var phone = document.createElement('div');
  phone.textContent = "電話";
  phone.setAttribute('class','small-block');
  control_btn.appendChild(phone);

  var web = document.createElement('div');
  web.textContent = "網站";
  web.setAttribute('class','small-block');
  control_btn.appendChild(web);
  //<button class="save-btn">儲存</button>
  var shop_save = document.createElement('button');
  shop_save.textContent = "儲存";
  shop_save.setAttribute('class','save-btn');
  shop_save.setAttribute('id','shop_save_'+num.toString());
  control_btn.appendChild(shop_save);
}

//刪除子元素
function deleteChild(parent) { 
  var child = parent.lastElementChild;  
  while (child) { 
      parent.removeChild(child); 
      child = parent.lastElementChild; 
  } 
}