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
                             'type':'workspaces'
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
                     'type':'framework'
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
                        fixedWidth: true,
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
                            "type":selected.type
                        };
                        tinymce.activeEditor.setProgressState(true);
                        $.ajax({
                            data: parametro,
                            url: 'index.php/Ayuda/cargarProjecto',
                            type: 'post',
                            success: function(response) {
                                tinymce.activeEditor.setProgressState(false);
                                var resp = JSON.parse(response);
                                //console.log('respuesta',resp);
                                projectNombre = resp.project;
                                selectUri = selected.uri;
                                var prue = resp.menu.replace(/nav/g, " ");
                                $('#menuIndice').html(prue);
                                //tinymce.activeEditor.windowManager.alert(resp.mensaje);
                                codMsg = (resp.succes) ? 1 : 3;                             
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
