$(document).ready(function(){
   var loggedOut;
    $(window).on('beforeunload',function(){
            console.log($.cookie("test"));
            if(!($.cookie('test')) && !loggedOut){
               // alert('no keep me');
                $('#logoutBtn').click();

            }
    });
    
    window.history.pushState('', null,'./');
    $(window).on('popstate',function(){
        location.reload(true);
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
        
    var ul = jQuery('<ul></ul>').addClass("todosList");

     $("#logoutBtn").on('click',function(){
        var token = window.localStorage.getItem('token');
        loggedOut=true;
         $.ajax({
             type:"GET",
             url:"/users/logout",
             beforeSend:function(xhr){xhr.setRequestHeader('Authorization', token)},
             success: function(data) {
             window.localStorage.clear();
             window.location.assign("index.html");
             $.removeCookie("test");
            }
         });
         $.removeCookie("test");
     });

     $.ajax({
         type:"GET",
         url:"/todos",
         beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
         success:function(todos){
           todos.todos.forEach(function(todo){
               if(todo.completed === true){
                ul.append(jQuery('<li></li>').toggleClass('checked').append(jQuery('<span></span>').text(todo.text)).append(jQuery('<button>Edit</button>').addClass('edit')).append(jQuery('<span></span>').text('\u00D7').addClass('close'))); 
            
               }else{
                ul.append(jQuery('<li></li>').append(jQuery('<span></span>').text(todo.text)).append(jQuery('<button>Edit</button>').addClass('edit')).append(jQuery('<span></span>').text('\u00D7').addClass('close'))); 
            
               }
            })
             jQuery("#todos").html(ul);
            }
     });

     $(".addBtn").on('click', function(){
         if(jQuery("#myInput").val()===""){
             alert('Title required!!');
         }else{
            $.ajax({
                type:"POST",
                data:JSON.stringify({text:jQuery("#myInput").val()}),
                contentType: "application/json; charset=utf-8",
                dataType:"json",             
                url:"/todos",
                beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
                success:function(todo){
                    //console.log(todo);
                   jQuery("#myInput").val("")
                    ul.append(jQuery('<li></li>').append(jQuery('<span></span>').text(todo.text)).append(jQuery('<button>Edit</button>').addClass('edit')).append(jQuery('<span></span>').text('\u00D7').addClass('close')));
                    jQuery("#todos").html(ul);
                   }
            })
         }
        
     });

     $(document).on("click", ".close", function(event){
         event.stopPropagation();
        var text=$(this).parent().clone().children()[0].innerText;
        $(this).parent().hide();
        findId(text)
        .done(function(id){
            $.ajax({
                type:"delete",
                url:"/todos/"+id,
                beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
                success:function(todo){
                    console.log(todo);
                }
            })
        })
        .catch(function(e){
            console.log(e);
        })
    });

    $(document).on("click", ".edit", function(event){
        event.stopPropagation();
        var enterPressed;
        var onfocus;
       var orValue=$(this).parent().clone().children()[0].innerText;
        $(this).parent().children()[0].innerText='';
        $(this).parent().append(jQuery('<input autofocus></input>').addClass('input').val(orValue));

        $('.input').on('click', function(e) {
            e.stopPropagation();   
            enterPressed = false;         
        })
        
        $('.input').on('focus',function(e){
            e.stopPropagation();
            console.log("focus");
             enterPressed = false;
             //onfocus=true;
            console.log(enterPressed);

            $(this).keypress(function(event){
                event.stopPropagation();
                var keycode = (event.keyCode ? event.keyCode : event.which);
                var newText = $(this).val();
                //enterPressed = true;
                if(keycode == '13'){
                    enterPressed = true;
                    console.log("enter")
                    
                    console.log(enterPressed)
                    event.stopPropagation();
                    $(this).hide();
                    $(this).parent().children()[0].innerText = newText;
                    findId(orValue)
                    .done(function(id){
                        editTodo(newText, false, id);
                    })
                    .fail(function(e){
                        alert(e);
                    })
                }
            }).promise().done(function(){
    
                    $(this).on('focusout',function(e){
                        if(!enterPressed){
                            e.stopPropagation();
                            console.log("focusout")
                            console.log(enterPressed);                    
                            var newText = $(this).val();
                            $(this).hide();
                            $(this).parent().children()[0].innerText = newText;
                            //console.log(enterPressed)
                            findId(orValue)
                            .done(function(id){
                                editTodo(newText, false, id);
                            })
                            .fail(function(e){
                                alert(e);
                            })
                        }
                    });
                
            });
        });
    });

    $(document).on('click', 'li', function(){
        $(this).toggleClass("checked");
        var text = $(this).clone().children()[0].innerText;
        var status = $(this).attr('class');
        if(status === 'checked'){
            findId(text)
            .done(function(id){
                editTodo(text, true, id);
            })
            .fail(function(e){
                console.log(e);
            })
            
        }else{
            findId(text)
            .done(function(id){
                editTodo(text, false, id);
            })
            .fail((e)=>{
                console.log(e);
            })
        
        }
    });
    

    function findId(text){
       return  $.ajax({
            type:"POST",
            url:"/todos/findId",
            data:JSON.stringify({text:text}),
            contentType: "application/json; charset=utf-8",
            beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
           });
        };

    function editTodo(text, completed, id){
        return  $.ajax({
            type:"patch",
            url:"/todos/"+id,
            data:JSON.stringify({"text":text,"completed":completed}),
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))}
        })
    }
    
 });