/* 
 *@Empresa XETID
 *@División Software base y seguridad
 *@Centro Herramientas y Tecnología de Desarrollo
 */
tinymce.PluginManager.add('x_export', function(editor, url) {
    editor.addButton('x_export', {
        icon: 'xexport',
        tooltip:'Export project',
        onclick: function() {
            action();
        }
    });
    editor.addMenuItem('x_export', {
        text: 'Export project',
        context: 'project',
        icon: 'xexport',
        onclick: function() {
            action();
        }
    });

    function action() {
        var editable = (tinymce.activeEditor.getBody().getAttribute('contenteditable')=="true") ? true : false;

        if(tinymce.activeEditor.getNodeSelected() && editable){
            tinymce.activeEditor.setProgressState(true);
            tinymce.activeEditor.setProgressState(true);
            $.ajax({
                data: {
                    "name": projectNombre,
                    "uri": selectUri
                },
                url: 'index.php/Ayuda/exportarProyecto',
                type: 'post',
                success: function(response){
                    tinymce.activeEditor.setProgressState(false);
                    var urlzip = JSON.parse(response).data;
                    console.log(urlzip);
                    tinymce.activeEditor.setProgressState(false);
                    window.open("http://" + urlzip, 'target');
                }
            });
        }else{
            //tinymce.activeEditor.windowManager.alert('You must select the project to export.');
            tinymce.activeEditor.windowManager.MsgFlotante(3,'Debe seleccionar el proyecto a exportar.');
        }

    }
});
