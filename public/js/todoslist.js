$(document).ready(function(){
    getAllTodos();
    var loggedOut;
    var completed=0;
    var yetToComplete=0;

    $(window).on('beforeunload',function(){
            if(!($.cookie('test')) && !loggedOut){
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
                // jQuery('<div class="alert alert-danger" role="alert">Page not found</div>');
                jQuery("#inputText").val("");
                
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            }else if(jqXHR.status == 401){
                // jQuery('<div class="alert alert-danger" role="alert"></div>').text("Unauthorized user.")
                alert('Unauthorized user')
            } else if(jqXHR.status == 400){
               alert('Bad request:Todos title required');
            }else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });
        
    var ul = jQuery('<ul></ul>').addClass("todosList");

    $(".btn.btn-outline-primary").on('click',function(){
        var token = window.localStorage.getItem('token');
        loggedOut=true;
        jQuery(".btn.btn-outline-primary").text("Logging out");
        jQuery(".btn.btn-outline-primary").attr("disabled","disabled");
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

    $("#inputText").keypress(function(e){
        var key = e.which;
        if(key == 13){
            addTodo();
        }
    });

    $("#addBtn").on("click", function(){
        addTodo();
    });

    $(document).on("click", ".btn.btn-outline-danger.btn-sm", function(event){
         event.stopPropagation();
        //var text = getText(this);
        $(this).parent().children().each(function(child){
            if(this.tagName === "SPAN"){
            text = this.innerText;
            return false;
            }
        })

        $(this).parent().hide();
        findId(text)
        .done(function(id){
            $.ajax({
                type:"delete",
                url:"/todos/"+id,
                beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
                success:function(todo){
                    // console.log(todo);
                    if(todo.completed == true){
                        completed--;
                        jQuery(".badge.badge-light").text(completed);
                    }else{
                        yetToComplete--;
                        jQuery(".badge.badge-danger").text(yetToComplete);
                
                    }
                }
            })
        })
        .catch(function(e){
            // console.log(e);
        })
    });

    $(document).on("click", ".btn.btn-outline-success.btn-sm", function(event){
        event.stopPropagation();
        var enterPressed;
        var onfocus;
        var orValue;
        $(this).parent().children().each(function(child){
            if(this.tagName === "SPAN"){
            orValue = this.innerText;
            return false;
            }
           });
           $(this).parent().children().each(function(child){
            if(this.tagName === "SPAN"){
             this.innerText="";
            return false;
            }
           })
       //$(this).parent().children()[0].innerText='';
        $(this).parent().append(jQuery('<input autofocus></input>').addClass('input').val(orValue));

        $('.input').on('click', function(e) {
            e.stopPropagation();   
            enterPressed = false;         
        })
        
        $('.input').on('focus',function(e){
            e.stopPropagation();
            // console.log("focus");
             enterPressed = false;
             //onfocus=true;
            // console.log(enterPressed);

            $(this).keypress(function(event){
                event.stopPropagation();
                var keycode = (event.keyCode ? event.keyCode : event.which);
                var newText = $(this).val();
                //enterPressed = true;
                if(keycode == '13'){
                    enterPressed = true;
                    // console.log("enter")
                    
                    // console.log(enterPressed)
                    event.stopPropagation();
                    $(this).hide();
                    if(newText.trim()){
                        //$(this).parent().children()[0].innerText = newText;
                        $(this).parent().children().each(function(child){
                            if(this.tagName === "SPAN"){
                                this.innerText = newText;
                                return false;
                            }
                        })
                        findId(orValue)
                        .done(function(id){
                            editTodo(newText, false, id);
                        })
                        .fail(function(e){
                            alert(e);
                        })
                    }else{
                        alert("Title required:Cannot edit the todo");
                        $(this).parent().children().each(function(child){
                            if(this.tagName === "SPAN"){
                                this.innerText = orValue;
                                return false;
                            }
                        })
                    }
                    
                }
            }).promise().done(function(){
    
                    $(this).on('focusout',function(e){
                        if(!enterPressed){
                            e.stopPropagation();
                            // console.log("focusout")
                            // console.log(enterPressed);                    
                            var newText = $(this).val();
                            $(this).hide();
                            if(newText.trim()){
                                //$(this).parent().children()[0].innerText = newText;
                                $(this).parent().children().each(function(child){
                                    if(this.tagName === "SPAN"){
                                    this.innerText=newText;
                                    return false;
                                    }
                                   })
                                //console.log(enterPressed)
                                findId(orValue)
                                .done(function(id){
                                    editTodo(newText, false, id);
                                })
                                .fail(function(e){
                                    alert(e);
                                })
                            }else{
                                alert("Title required:Cannot edit the todo");
                                $(this).parent().children().each(function(child){
                                    if(this.tagName === "SPAN"){
                                     this.innerText= orValue;
                                    return false;
                                    }
                                   })
                            }
                            
                        }
                    });
                
            });
        });
    });

    $(document).on('click', 'li', function(){
        //var completed=0;
        var text = null;
        var status = $(this).attr('class');        
        // var text = $(this).clone().children()[0].innerText;
       $(this).children().each(function(child){
        if(this.tagName === "SPAN"){
        text = this.innerText;
        return false;
        }
       })
        if(status === 'list-group-item list-group-item-warning'){
            $(this).attr("class","list-group-item list-group-item-success");  
            $(this).prepend(jQuery('<i class="fa fa-check-square-o" aria-hidden="true"></i>'))
            findId(text)
            .done(function(id){
                editTodo(text, true, id);
                completed++;
                yetToComplete--;
                jQuery(".badge.badge-light").text(completed);
                jQuery(".badge.badge-danger").text(yetToComplete);
                
            })
            .fail(function(e){
                // console.log(e);
            })
            
        }else{
            $(this).attr("class","list-group-item list-group-item-warning");
            $(this).children()[0].style.display = "none";
            findId(text)
            .done(function(id){
                editTodo(text, false, id);
                yetToComplete++;
                completed--;
                jQuery(".badge.badge-danger").text(yetToComplete);
                jQuery(".badge.badge-light").text(completed);
                
            })
            .fail((e)=>{
                // console.log(e);
            })
        
        }
    });
    
    $(document).on('click','#searchBtn', function(event){
        event.preventDefault();
        event.stopPropagation();
        var text = (jQuery("#inputText").val()).trim();
        if(text==="" || !text.trim()){
            alert('Title required!!');
        }else{
            $.ajax({
                type:"POST",
                data:JSON.stringify({text:text}),
                contentType: "application/json; charset=utf-8",
                dataType:"json",             
                url:"/todos/search",
                beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
                success:function(todos){
                jQuery("#inputText").val("")
                jQuery("#todoList").empty();                
                todos.forEach(function(todo){
                    populateTodo(todo.text, todo.completed);
                });
                },
            })
        }
    });
    
    $(document).on('click','#resetBtn', function(event){
        completed=0;
        yetToComplete=0;
        event.preventDefault();
        event.stopPropagation();
        jQuery("#todoList").empty();
        getAllTodos();

    });

    $(document).on('click', '#completedBtn', function(event){
        createReq("GET", "/todos")
        .done(function(todos){
            jQuery("#todoList").empty();
            todos.forEach(function(todo){
                if(todo.completed)
                    populateTodo(todo.text, todo.completed);
            })
        })
    });

    $(document).on('click', '#yetToCompleteBtn', function(event){
        createReq("GET", "/todos")
        .done(function(todos){
            jQuery("#todoList").empty();
            todos.forEach(function(todo){
                if(!todo.completed)
                    populateTodo(todo.text, todo.completed);
            })
        })
    });
    
    function getAllTodos(){
        createReq("GET","/todos")
        .done(function(todos){
            todos.forEach(function(todo){
                populateTodo(todo.text, todo.completed);
                if(todo.completed === true){
                    completed++;
                }else{
                    yetToComplete++;
                }
                jQuery(".badge.badge-light").text(completed);
                jQuery(".badge.badge-danger").text(yetToComplete);
            })
        });
    };

    function findId(text){
        if(!text.trim()){
            alert("Cannot find id of empty todo");
            return false;
        }
       return  $.ajax({
            type:"POST",
            url:"/todos/findId",
            data:JSON.stringify({text:text}),
            contentType: "application/json; charset=utf-8",
            beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
           });
    };

    function editTodo(text, completed, id){
        if(!text.trim()){
            alert("Todo title required");
            return false;
        }
        return  $.ajax({
            type:"patch",
            url:"/todos/"+id,
            data:JSON.stringify({"text":text,"completed":completed}),
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))}
        })
    };

    function createReq(type, url){
        return $.ajax({
            type,
            url,
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))}
        })
    };

    function addTodo(){
        if(jQuery("#inputText").val()==="" || !(jQuery("#inputText").val()).trim()){
            alert('Title required!!');
        }else{
           $.ajax({
               type:"POST",
               data:JSON.stringify({text:jQuery("#inputText").val()}),
               contentType: "application/json; charset=utf-8",
               dataType:"json",             
               url:"/todos",
               beforeSend:function(xhr){xhr.setRequestHeader('Authorization', window.localStorage.getItem('token'))},
               success:function(todo){
                    // jQuery("#resetBtn").click();
                    populateTodo(todo.text,false);
                    jQuery("#inputText").val("")
                    yetToComplete++;
                    jQuery(".badge.badge-danger").text(yetToComplete);
               }
           })
        }
    };

    function populateTodo(text, complete){
        if(complete === true){
            jQuery("#todoList")
            .append(jQuery('<li class="list-group-item list-group-item-success">')
            .append(jQuery('<span ></span>').text(text))
            .prepend(jQuery('<i class="fa fa-check-square-o" aria-hidden="true"></i>'))                    
            .append(jQuery('<button type="button" class="btn btn-outline-danger btn-sm">').append(' <i class="fa fa-trash" aria-hidden="true"></i>'))
            .append(jQuery('<button type="button" class="btn btn-outline-success btn-sm">').append(' <i class="fa fa-pencil" aria-hidden="true"></i>')));
        }else{
            jQuery("#todoList")
            .append(jQuery('<li class="list-group-item list-group-item-warning">')
            .append(jQuery('<span ></span>').text(text))                    
            .append(jQuery('<button type="button" class="btn btn-outline-danger btn-sm">').append(' <i class="fa fa-trash" aria-hidden="true"></i>'))
            .append(jQuery('<button type="button" class="btn btn-outline-success btn-sm">').append(' <i class="fa fa-pencil" aria-hidden="true"></i>')));
        }
        // jQuery(".badge.badge-danger").text(yetToComplete);
    };
    
});