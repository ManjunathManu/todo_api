

 $(document).ready(function(){
    var ul = jQuery('<ul></ul>').addClass("todosList");
     $("#logoutBtn").on('click',function(){
        var token = window.localStorage.getItem('token');
         $.ajax({
             type:"DELETE",
             url:"/users/me/token",
             beforeSend:function(xhr){xhr.setRequestHeader('Authorization', token)},
             success: function(data) { //alert('Success!',data);
             window.localStorage.clear();
             window.location.assign("index.html");
            }
         });
     });
     $.ajax({
         type:"GET",
         url:"/todos",
         beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
         success:function(todos){
           todos.todos.forEach(function(todo){
            ul.append(jQuery('<li></li>').text(todo.text).append(jQuery('<span></span>').text('\u00D7').addClass('close'))); 
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
             url:"/todos",
             beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
             success:function(todo){
                 //console.log(todo);
                jQuery("#myInput").val("")
                 ul.append(jQuery('<li></li>').text(todo.text).append(jQuery('<span></span>').text('\u00D7').addClass('close')));
                 jQuery("#todos").html(ul);
                }
         })
     });

     $(document).on("click", ".close", function(){
        var text=$(this).parent().clone().children().remove().end().text();
        $(this).parent().hide();
        $.ajax({
            type:"post",
            url:"/todos/findId",
            data:{text:text},
            beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
            success:function(id){
                console.log(text,id);
                $.ajax({
                    type:"delete",
                    url:"/todos/"+id,
                    beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
                    success:function(todo){
                        console.log(todo);
                    }
            
                })
            }
        })
     });

    //  $(document).on('dblclick', 'li', function () {
    //     oriVal = $(this).text();
    //     //$(this).text("");
    //     input = $("<input type='text'>");
    //     input.appendTo($(this)).focus();
    
    // });
    
    // $(document).on('focusout', 'input', function () {
    //     if (input.val() != "") {
    //         newInput = input.val();
    //         $(this).hide();
    //         $($(this).parent()).text(newInput);
    //     } else {
    //         $($(this)).text(oriVal);
    //     }
    
    // });
    $(document).on('click', 'li', function(){
        $(this).toggleClass("checked");
    })
 });
 
 
 
 
 


