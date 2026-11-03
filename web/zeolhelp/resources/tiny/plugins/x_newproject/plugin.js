/* 
 *@Empresa XETID
 *@División Software base y seguridad
 *@Centro Herramientas y Tecnología de Desarrollo
 */

tinymce.PluginManager.add('x_newproject', function(editor, url) {

    /*Multiple creación de proyectos*/

    function normalProyect() {
        onProgress = false;
        editor.windowManager.open({
            title: 'New project',
            width : parseInt(editor.getParam("plugin_preview_width", "450"), 10),
            height : 100,
            closeOnSubmit : false,
            body:[
                {
                    title: 'General',
                    type: 'form',
                    items: [{
                        name: 'nameproject',
                        type: 'textbox',
                        label: 'Name:',
                        maxLength: 150,
                        allowBlank: false,
                        vtype:'nameproyect',
                        placeholder:'Denominación del proyecto',
                        autofocus: true

                    }]
                }
            ],
            onsubmit:function(){

                if(!onProgress){
                    var self = this;
                    var contenido=this.find('#nameproject')[0].value();
                    var idNode = 'xhome'+contenido;
                    if(contenido){
                        var parametro = {
                            "nameproject" : contenido,
                            "type":'workspaces',
                            'uri':'workspaces'
                        };
                        tinymce.activeEditor.setProgressState(true);
                        onProgress = true;
                        $.ajax({
                            data:  parametro,
                            url:   'index.php/Ayuda/nuevoProyecto',
                            type:  'post',
                            success:  function (response) {
                                var data =  JSON.parse(response);
                                onProgress = false;
                                if(data.success){
                                    projectNombre = contenido;
                                    selectUri='workspaces';
                                    tinymce.activeEditor.windowManager.MsgFlotante(data.codMsg, data.mensaje);
                                    self.close();
                                    /*  $('#menuIndice').children().remove();
                                     $('#menuIndice').append( '<li style="cursor: pointer;" class="active xinitProyect" id =' + '"'+idNode+'">'+'<a href="#home_context" uri="workspaces">'+
                                     '<span style="padding-right: 4px;" class="glyphicon glyphicon-folder-close"></span>' +
                                     contenido+'</a></li>' );*/
                                    $.ajax({
                                        data: parametro,
                                        url: 'index.php/Ayuda/cargarProjecto',
                                        type: 'post',
                                        success: function(response) {
                                            tinymce.activeEditor.setProgressState(false);
                                            var resp = JSON.parse(response);

                                            projectNombre = resp.project;
                                            // console.log('response-Main-Cargar',resp);
                                            var prue = resp.menu.replace(/nav/g, " ");
                                            $('#menuIndice').html(prue);

                                            tinymce.activeEditor.setNodeSelected(idNode,"workspaces");
                                            //tinymce.activeEditor.windowManager.alert(data.mensaje);
                                            tinymce.activeEditor.windowManager.MsgFlotante(1,data.mensaje);


                                        }
                                    });

                                    //this.close();
                                }
                                else{
                                    //if(data.codMsg == 6){
                                    // alert(data.mensaje);
                                    //tinymce.activeEditor.windowManager.alert(data.mensaje);
                                    tinymce.activeEditor.setProgressState(false);
                                    tinymce.activeEditor.windowManager.MsgFlotante(3,data.mensaje);
                                    //}
                                }


                            }
                        });

                        editor.setContent('');
                    }
                }

            },
            onpostRender:function(e){
                $('.mce-primary',$('#'+e.control._id)).addClass('mce-disabled');
                $('#'+e.control._id).keydown(function (a){
                    if (a.keyCode != 13) {
                        $('.mce-primary',$('#'+e.control._id)).removeClass('mce-disabled');
                    }
                });

            }

        });

    }

    function zeolidesProyect() {
        var items=[];

        $.ajax({
            url:   'index.php/Ayuda/listarSubsistemas',
            type:  'post',
            success:  function (response) {
                var resp=JSON.parse(response);

                var obj;
                for(obj in resp){
                   // console.log('OBJ',obj);
                    items.push({
                            text:resp[obj].nombre,
                            value:{
                                'name': resp[obj].nombre,
                                'uri': resp[obj].uri
                            }
                        }
                    );
                }
                var selected;

                editor.windowManager.open({
                    title: 'New project Zeolides',
                    id:'neoProyect',
                    width : parseInt(editor.getParam("plugin_preview_width", "450"), 10),
                    height : 100,
                    //file:,
                    body: [ {
                        label:'Subsystems:',
                        type: 'listbox',
                        text: 'Select the subsystem',
                        tooltip:'Denominación del subsistema',
                        values: items,
                        fixedWidth: true,
                        onselect: function(fmt) {
                            if (fmt.control) {
                                selected = fmt.control.value();
                                $('.mce-primary',$('#neoProyect')).removeClass('mce-disabled');
                            }

                        }

                    }
                    ],
                    onsubmit:function(){
                        var idNode = 'xhome'+selected.name;
                        var parametro = {
                            "nameproject" : selected.name,
                            "uri":selected.uri,
                            "type":'framework'
                        };
                        tinymce.activeEditor.setProgressState(true);
                        $.ajax({
                            data:  parametro,
                            url:   'index.php/Ayuda/nuevoProyecto',
                            type:  'post',
                            success:  function (response) {
                                var data =  JSON.parse(response);
                                if(data.success){
                                    projectNombre = selected.name;
                                    tinymce.activeEditor.windowManager.MsgFlotante(data.codMsg, data.mensaje);
                                    /* $('#menuIndice').children().remove();
                                     $('#menuIndice').append( '<li style="cursor: pointer;" class="xinitProyect" id =' + '"'+idNode+'">'+'<a style="color: #1c8b5b;" href="#home_context" uri =' +
                                     '"'+selected.uri+'" >'+
                                     '<span style="padding-right: 4px;" class="glyphicon glyphicon-folder-close"></span>' +
                                     selected.name+'</a></li>' );*/
                                    $.ajax({
                                        data: parametro,
                                        url: 'index.php/Ayuda/cargarProjecto',
                                        type: 'post',
                                        success: function(response) {
                                            tinymce.activeEditor.setProgressState(false);
                                            var resp = JSON.parse(response);
                                            projectNombre = resp.project;
                                            // console.log('response-Main-Cargar',resp);
                                            var prue = resp.menu.replace(/nav/g, " ");
                                            $('#menuIndice').html(prue);
                                            tinymce.activeEditor.setNodeSelected(idNode);
                                            //tinymce.activeEditor.windowManager.alert(data.mensaje);
                                            tinymce.activeEditor.windowManager.MsgFlotante(1,data.mensaje);
                                        }
                                    });



                                    //this.close();
                                }else{
                                    //if(data.codMsg == 6){
                                    //  alert(data.mensaje);
                                    /// tinymce.activeEditor.windowManager.alert(data.mensaje);
                                    tinymce.activeEditor.setProgressState(false);
                                    tinymce.activeEditor.windowManager.MsgFlotante(3,data.mensaje);
                                    // }
                                }


                            }
                        });
                    },
                    onpostRender:function(e){
                        $('.mce-primary',$('#'+e.control._id)).addClass('mce-disabled');

                    }


                });

            }
        });

    }
    var menuItems = [
        {
            text:'Zeolides',
            onclick: function() {
                zeolidesProyect();
            }
        },{
            text:'Local',
            onclick: function() {
                normalProyect();
            }
        }];
    /*END*/


    editor.addMenuItem('x_newproject', {
        text: 'New project',
        context: 'project',
        icon:'xfolder-close',
        menu:menuItems
    });

});