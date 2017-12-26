$(document).ready(function(){

    $(".signup").submit(function(){
        event.preventDefault();
        var email = $("#emailsignup").val();
        var password = $("#passwordsignup").val();
        $.ajax({
            type: "POST",
            url: "/users",
            data: {
                'email':$("#emailsignup").val(),
                'password':$("#passwordsignup").val()
            },
            success:  function(data, status, xhr){
                var token = xhr.getResponseHeader('Authorization');
                window.localStorage.setItem('token', token);
                window.location.href = "todoslist.html";
                }
            })
          });

  $(".login").submit(function(){
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "/users/login",
            data: {
                'email':$("#username").val(),
                'password':$("#password").val()
            },
            success:  function(data, status, xhr){
               // alert("Data: " + data + "\nStatus: " + status);
                var token = xhr.getResponseHeader('Authorization');
                window.localStorage.setItem('token', token);
                window.location.href = "todoslist.html";
                
            },
           
          });
    });
});
