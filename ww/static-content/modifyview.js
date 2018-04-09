$(document).ready(function(){

    /* On Document Ready! */
    /* To Hide Everything In Register By Default */
    $(".register").hide();
    $("#reguser").hide();
    $("#regpass").hide();
    $("#registerbutton").hide();
    $("#tologin").hide();
    $('label[for=regusername]').hide();
    $('label[for=regpassword]').hide();
    /* To Hide Everything In Register By Default */

    /* To Hide Everything In Update Profile By Default */
    $(".profile").hide();


    /* To Hide Everything In Update Stage By Default */
    $(".legend").hide();
    $(".stageElements").hide();

    /* Hide temp and temp2 */
    $("#temp").hide();
    $("#temp2").hide();
    /* To Hide Everything In Update Stage By Default */
    // To initialize high-scores.
    retrieveTopTen();


	/* For Login Div */

    // To HIDE:
    $("#toregister").click(function(){
        $(".login").hide();
    });
    $("#toregister").click(function(){
        $("#loguser").hide();

    });
    $("#toregister").click(function(){
        $("#logpass").hide();
    });
    $("#toregister").click(function(){
        $("#loginbutton").hide();

    });
    $("#toregister").click(function(){
        $("#toregister").hide();
    });
    $("#toregister").click(function(){
    	$('label[for=logusername]').hide();
    });
    $("#toregister").click(function(){
    	$('label[for=logpassword]').hide();
    });
    // To SHOW:
    $("#toregister").click(function(){
        $(".register").show();

    });
    $("#toregister").click(function(){
        $("#reguser").show();
    });
    $("#toregister").click(function(){
        $("#regpass").show();
    });
    $("#toregister").click(function(){
        $("#registerbutton").show();
    });
    $("#toregister").click(function(){
        $("#tologin").show();
    });
    $("#toregister").click(function(){
        $('label[for=regusername]').show();
    });
    $("#toregister").click(function(){
        $('label[for=regpassword]').show();
    });


    /* For Register Div */

    // To HIDE:
    $("#tologin").click(function(){
        $(".register").hide();
    });
    $("#tologin").click(function(){
        $("#reguser").hide();
    });
    $("#tologin").click(function(){
        $("#regpass").hide();
    });
    $("#tologin").click(function(){
        $("#registerbutton").hide();
    });
    $("#tologin").click(function(){
        $("#tologin").hide();
    });
    $("#tologin").click(function(){
        $('label[for=regusername]').hide();
    });
    $("#tologin").click(function(){
        $('label[for=regpassword]').hide();
    });

    // To SHOW:
    $("#tologin").click(function(){
        $(".login").show();
    });
    $("#tologin").click(function(){
        $("#loguser").show();
    });
    $("#tologin").click(function(){
        $("#logpass").show();
    });
    $("#tologin").click(function(){
        $("#loginbutton").show();
    });
    $("#tologin").click(function(){
        $("#toregister").show();
    });
    $("#tologin").click(function(){
        $('label[for=logusername]').show();
    });
    $("#tologin").click(function(){
        $('label[for=logpassword]').show();
    });

    // Create User.
	$("#registerbutton").on('click',function(){
        checkExists();
    });

    // Login.
    $("#loginbutton").on('click',function(){
        login();
    });

    // Update Profile.
    $("#profilebutton").on('click',function(){
        updateProfile();
    });
    $("#tostage").on('click',function(){
      $(".profile").hide();
      $(".stageElements").show();
    });
    $(".logout").click(function(){
        location.reload();
    });


});

function createUser() {
    $.ajax({
        url: '/api/makeuser/'+$("#reguser").val(),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: $("#reguser").val(), pass: $("#regpass").val() }),
        success: function(response) {
            console.log(JSON.stringify(response));
        }
    });
}

function checkExists() {
    $.ajax({
        url: '/api/checkuser/'+$("#reguser").val(),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: $("#reguser").val() }),
        success: function(response) {
            console.log(JSON.stringify(response));
            if (response["checkreg"][0].num >= 1) {
                alert("Username Is Taken!");
            } else {
                alert("Successfully Registered");
                createUser();
            }
        }
    });
}

function login() {
    $.ajax({
        url: '/api/login/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: $("#loguser").val(), pass: $("#logpass").val() }),
        success: function(response) {
            console.log(JSON.stringify(response));
            try{
                if ((document.getElementById("logpass").value == response["login"][0].password) && (document.getElementById("loguser").value == response["login"][0].name)) {
                  goToProfile();
                  loadProfile(document.getElementById("loguser").value, document.getElementById("logpass").value, response["login"][0].email, response["login"][0].wins);
              }
          } catch(err){
              if(err){
                alert(err);
              }
          }
        }
    });
}

function createScore() {
    $.ajax({
        url: '/api/score/'+$("#profileuser").val(),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ sid: $("#temp").val(), name: $("#profileuser").val(), score: $("#temp2").val() }),
        success: function(response) {
            console.log(JSON.stringify(response));
        }
    });
}

function incrementWin() {
    $.ajax({
        url: '/api/increment/'+$("#profileuser").val(),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: $("#profileuser").val(), wins: $("#profilewin").val() }),
        success: function(response) {
            console.log(JSON.stringify(response));
        }
    });
}


function getScoreId() {
    $.ajax({
        url: '/api/getsid/',
        method: 'GET',
        contentType: 'application/json',
        async: false,
        success: function(response) {
          console.log(JSON.stringify(response));
          var num = response["getsid"][0].num;
          document.getElementById("temp").value = num;
        }
    });
}

function updateProfile() {
    $.ajax({
        url: '/api/update/',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ name: $("#profileuser").val(), pass: $("#profilepass").val(), email: $("#profileemail").val() }),
        success: function(response) {
            console.log(JSON.stringify(response));
            alert("Update Successful!");
        }
    });
}

function goToProfile() {
  $(".login").hide();
  $("#scoreboard").hide();
  $(".profile").show();
}

function loadProfile(name, pass, email, wins) {
    document.getElementById("profileuser").value = name;
    document.getElementById("profilepass").value = pass;
    document.getElementById("profileemail").value = email;
    document.getElementById("profilewin").value = wins;
}

function retrieveTopTen() {
    $.ajax({
        url: '/api/scores/',
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            console.log(JSON.stringify(response));

            // Set Text Field Values To Row Values.
            for(i=0;i<response["scores"].length;i++) {
                document.getElementById("score"+i).value = response["scores"][i].score;
                document.getElementById("name"+i).value = response["scores"][i].name;
            }
        }
    });
}
