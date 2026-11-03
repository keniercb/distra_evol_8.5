/* 
 *@Empresa XETID
 *@División Software base y seguridad
 *@Centro Herramientas y Tecnología de Desarrollo
 */

tinymce.PluginManager.add('x_openproject', function(editor, url) {
    // Adds a menu item to the tools menu

    editor.addMenuItem('x_openproject', {
        text: 'Open project',
        context: 'project',
        icon: 'xfolder-open',
        onclick: function() {
            var items = [];
            tinymce.activeEditor.setProgressState(true);
            $.ajax({
                url: 'index.php/Ayuda/listarProjecto',
                type: 'post',
                success: function(response) {
                    tinymce.activeEditor.setProgressState(false);
                    var resp = JSON.parse(response);

                    var obj;
                    for(obj in resp.workspaces){

                     items.push({
                     text:resp.workspaces[obj].nombre,
                     value:{
                             'name': resp.workspaces[obj].nombre,
                             'uri':'workspaces',
                             'type':'workspaces',
                             'element':$(resp.workspaces[obj].li)
                     }
                     });
                     }
                     for(obj in resp.framework){
                     // console.log('OBJ',obj);
                     items.push({
                     text:resp.framework[obj].nombre,
                     value:{
                     'name': resp.framework[obj].nombre,
                     'uri': resp.framework[obj].uri,
                     'type':'framework',
                     'element':$(resp.framework[obj].li)
                     }
                     });
                     }

                    showWindowsOpenProyect();

                }
            });

            function showWindowsOpenProyect() {
                var selected;

                editor.windowManager.open({
                    title: 'Abrir  proyecto',
                    width: parseInt(editor.getParam("plugin_preview_width", "450"), 10),
                    height: 100,
                    id:'openProyect',
                    //file:,
                    body: [{
                        label: 'Proyecto:',
                        type: 'listbox',
                        text: 'Seleccione',
                        values: items,
                        //fixedWidth: true,
                        tooltip:'Denominación del proyecto',
                        onselect: function(fmt) {
                            if (fmt.control) {
                                //  selected = fmt.control.text();
                                selected = fmt.control.value();
                                $('.mce-primary',$('#openProyect')).removeClass('mce-disabled');
                            }

                        }

                    }
                    ],
                    onsubmit: function() {
                        var parametro = {
                            "nameproject" : selected.name,
                            "uri":selected.uri,
                            "type":selected.type,
                            "idNodo":selected.element.attr('id')
                        };
                        tinymce.activeEditor.setProgressState(true);
                        $.ajax({
                            data: parametro,
                            url: 'index.php/Ayuda/cargarProjecto',
                            type: 'post',
                            success: function(response) {
                                tinymce.activeEditor.setProgressState(false);
                                var resp = JSON.parse(response);
                                codMsg = (resp.succes) ? 1 : 3;
                                if(resp.succes) {
                                    projectNombre = resp.project;
                                    selectUri = selected.uri;

                                    idNode = parametro.idNodo;
                                    name = parametro.nameproject;
                                    uri = parametro.uri;

                                    var prue = resp.menu.replace(/nav/g, "proyectos sortable-list ui-sortable");
                                    $('#menuIndice').html(prue);
                                    $('.proyectos').find('ul').addClass( "sortable-list ui-sortable" );

                                    $('.proyectos').find('li').css({
                                        'list-style-type': 'none',
                                        'margin-left': '-25px',
                                        'padding': '5px'
                                    });

                                    $('.proyectos').find('a').each(function(){
                                        if($(this).parent().children("ul").length && $(this).parent().children("ul").children().length > 0)
                                        //$(this).prepend('<span class="glyphicon glyphicon-folder-close" style="font-size:85%;padding-right: 4px;"></span>&nbsp;');
                                            $(this).addClass("glyphicon glyphicon-folder-close nodo-tree size85");
                                        else
                                        //$(this).prepend('<span class="glyphicon glyphicon-stop" style="font-size:45%;padding-right: 4px;"></span>');
                                            $(this).addClass("glyphicon glyphicon-stop nodo-tree");
                                        $(this).css( "font-size", "0.97em");
                                    });
                                    $('.proyectos').find('ul').hide();

                                    $('.nodeSelect').removeClass('nodeSelect');
                                    getContenido();
                                    tinymce.activeEditor.setNodeSelected(parametro.idNodo, parametro.uri);
                                }

                                tinymce.activeEditor.windowManager.MsgFlotante(codMsg,resp.mensaje);

                            }
                        });
                    },
                    onpostRender:function(e){
                        $('.mce-primary',$('#'+e.control._id)).addClass('mce-disabled');

                    }

                });
            }

        }
    });
});
