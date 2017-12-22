     $.post(".signup",{
             'email':$("#emailsignup").val(),
             'password':$("#passwordsignup").val()
         }, function(data, status, xhr){
            alert("Data: " + data + "\nStatus: " + status);
            
             window.location.href = "http://localhost:3000/users"
    var token = xhr.getResponseHeader('Authorization');
             window.location.href = "http://localhost:3000/todos"
            $.ajax({
                url:"http://localhost:3000/todos",
                type:"GET",
               beforeSend: function(xhr){xhr.setRequestHeader('Authorization', token)},
                success: function(data) { alert('Success!',data)}
           });
            
         });
     });

    alert( "Handler for .click() called." );
        console.log('clicked');
        $.post("http://localhost:3000/users/login",{
        'email':$("#username").val(), 'password':$("#password").val()
        }, function(data, status, xhr){
            alert("Data: " + data + "\nStatus: " + status);
            console.log(xhr.getResponseHeader('Authorization'));
            var token = xhr.getResponseHeader('Authorization');
            // window.location.href = "http://localhost:3000/todos"
            $.ajax({
                url:"http://localhost:3000/todos",
                type:"GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', token)},
                success: function(data) { alert('Success!',data)}
            });
            
        })
        console.log(email, password);
