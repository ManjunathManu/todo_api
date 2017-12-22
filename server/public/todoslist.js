 $(document).ready(function(){
    var ul = jQuery('<ul></ul>').addClass("todosList");
    var deleteButton = $('<button />').addClass('deleteButton').text('Delete');
     $("#logoutBtn").on('click',function(){
        var token = window.localStorage.getItem('token');
         $.ajax({
             type:"DELETE",
             url:"http://localhost:3000/users/me/token",
             beforeSend:function(xhr){xhr.setRequestHeader('Authorization', token)},
             success: function(data) { //alert('Success!',data);
             window.localStorage.clear();
             window.location.assign("index.html");
            }
         });
     });
     $.ajax({
         type:"GET",
         url:"http://localhost:3000/todos",
         beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
         success:function(todos){
           todos.todos.forEach(function(todo){
               ul.append(jQuery('<li></li>').text(todo.text).append(jQuery('<button>delete</button>').addClass("delButton")));  
            })
             jQuery("#todos").html(ul);
            }
     });

     $(".addBtn").on('click', function(){
         if(jQuery("#myInput").val()===""){
             alert('Title required!!');
         }
         $.ajax({
             type:"POST",
             data:{text:jQuery("#myInput").val()},
             url:"http://localhost:3000/todos",
             beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
             success:function(todo){
                 //console.log(todo);
                jQuery("#myInput").val("")
                 ul.append(jQuery('<li></li>').text(todo.text));
                 deleteButton.appendTo('ul li');
                 jQuery("#todos").html(ul);
                }
         })
     });

     var myNodelist = document.getElementsByTagName("LI");
     var i;
     for (i = 0; i < myNodelist.length; i++) {
       var span = document.createElement("SPAN");
       var txt = document.createTextNode("\u00D7");
       span.className = "close";
       span.appendChild(txt);
       myNodelist[i].appendChild(span);
     }

 });
 
 
 
 
 


