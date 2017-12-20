$(document).ready(function(){
    $(".btn btn-lg btn-primary btn-block").click(function(){
        alert( "Handler for .click() called." );
        // console.log('clicked');
        var email = $("#inputEmail").val();
        var password = $("#inputPassword").val();
        console.log(emial, password);
    });
})
