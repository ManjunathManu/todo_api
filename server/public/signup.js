$(document).ready(function(){

    $(".signup").submit(function(){
        event.preventDefault();
        var email = $("#emailsignup").val();
        var password = $("#passwordsignup").val();
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/users",
            data: {
                'email':$("#emailsignup").val(),
                'password':$("#passwordsignup").val()
            },
            success:  function(data, status, xhr){
                // alert("Data: " + data + "\nStatus: " + status);
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
            url: "http://localhost:3000/users/login",
            data: {
                'email':$("#username").val(),
                'password':$("#password").val()
            },
            success:  function(data, status, xhr){
               // alert("Data: " + data + "\nStatus: " + status);
                var token = xhr.getResponseHeader('Authorization');
                window.localStorage.setItem('token', token);
                window.location.href = "todoslist.html";
                // $.ajax({
                //     url:"http://localhost:3000/todoslist",
                //     type:"GET",
                //     beforeSend: function(xhr){xhr.setRequestHeader('Authorization', token)},
                //     success: function(data) { alert('Success!',data);
                //                                 console.log(data);
                //                             }
                // });
                
            },
           
          });
    });

    // function loadTodos(todos){
    //     // window.location.assign("todoslist.html");
    //     var arr = $.map(todos, function(value, index){
    //         return [value];
    //     });
    
    //     var ol = jQuery('<ol></ol>');
        
    //         arr.forEach((arr)=>{
    //             ol.append(jQuery('<li></li>').text('hi'));
    //         })
    //         jQuery('#todoList').html(ol);
    //  }
});
