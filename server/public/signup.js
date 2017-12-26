$(document).ready(function(){

     history.pushState({ page: 1 }, "Title 1", "#no-back");
    window.onhashchange = function (event) {
      window.location.hash = "no-back";
    };

    $.ajaxSetup({
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            }else if(jqXHR.status == 401){
                alert('Unauthorized user')
            } else if(jqXHR.status == 400){
               alert('Bad request:User already exists');
            }else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });

    $(".signup").submit(function(){
        event.preventDefault();
        var email = $("#emailsignup").val();
        var password = $("#passwordsignup").val();
        if(validateEmail(email)){
            if(validatePassword(password)){
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
            }else{
                alert('Password should be of minimum 6 characters');
            }
           
        }else{
            alert('Invalid email ID');
        }
       
          });

    $(".login").submit(function(){
        event.preventDefault();
        if(validateEmail($("#username").val())){
            if(validatePassword($("#password").val())){
                $.ajax({
                    type: "POST",
                    url: "/users/login",
                    data: {
                        'email':$("#username").val(),
                        'password':$("#password").val()
                    },
                    success:  function(data, status, xhr){
                        var token = xhr.getResponseHeader('Authorization');
                        window.localStorage.setItem('token', token);
                        window.location.href = "todoslist.html";
                        
                    },
                   
                  });
            }else{
                alert("Password should be of minimum 6 characters")
            }
            
        }else{
            alert("Invalid email Id")
        }
        
    });

    function validateEmail(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if( !emailReg.test( email )) {
            return false;
        } else {
            return true;
        }
    }
    function validatePassword(password){
        if(password.length<6)
            return false;
        else
            return true;
    }
});
