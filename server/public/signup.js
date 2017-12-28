$(document).ready(function(){

    //  history.pushState({ page: 1 }, "Title 1", "#no-back");
    // window.onhashchange = function (event) {
    //   window.location.hash = "no-back";
    // };
    // $(window).on('unload',function(){
    //     if(localStorage.getItem('token')){
    //         alert('Alreadylogged in');
    //         // console.log("hahahahahhaha", token);
    //         window.location.href="todoslist.html"
    //     }else{
    //         alert('Not logged in');
    //         window.location.href="index.html"
    //     } 
    // })
    window.history.pushState('', null,'./');
    $(window).on('popstate',function(){
        location.reload(true);
    });
    var checked=false;
    $('#loginkeeping').on('click',function() {
        if(this.checked){
             checked = true;
        } else{
            checked = false;
        } 
    });
    

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
        $(".signup > input").attr('value','signing up...');
        
        var email = $("#emailsignup").val();
        var password = $("#passwordsignup").val();
        if(validateEmail(email)){
            if(validatePassword(password)){
                $.ajax({
                    type: "POST",
                    url: "/users",
                    data: JSON.stringify({
                        'email':$("#emailsignup").val(),
                        'password':$("#passwordsignup").val()
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType:"json",
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
        if(checked){
            alert('checked');
            $.cookie("test", 1);
        }else{
            alert('not checked');
        }
        
        $(".login > input").attr('value','logging in...');
        
        if(validateEmail($("#username").val())){
            if(validatePassword($("#password").val())){
                $.ajax({
                    type: "POST",
                    url: "/users/login",
                    data: JSON.stringify({
                        'email':$("#username").val(),
                        'password':$("#password").val(),
                        'keepMeLoggedIn':checked
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType:"json",                    
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
