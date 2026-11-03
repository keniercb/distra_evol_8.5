/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

tinymce.PluginManager.add('save', function(editor) {

    dirty = false;
    function save() {

        //var formObj;
        var self = this;
        var btnSave = $('.mce-i-save').parents()[1];
        btnSave = $(btnSave);

        if(!btnSave.hasClass('mce-disabled')){
            tinymce.activeEditor.setProgressState(true);
            $.ajax({
                type: "POST",
                url: "index.php/Ayuda/guardar",
                data: {
                    idNodo: editor.getNodeSelected().idnode,
                    uri: selectUri,
                    contens: editor.getContent(),
                    name : projectNombre
                },
                success : function(data,textstatus){
                    //Por si se quiere manejar las respuesta
                    var data =  JSON.parse(data);
                    tinymce.activeEditor.setProgressState(false);
                    if(data.succes){
                        //tinymce.activeEditor.windowManager.alert(data.mensaje);
                        tinymce.activeEditor.windowManager.MsgFlotante(1,data.mensaje);
                        onDisabledSave();

                    }else{
                        tinymce.activeEditor.windowManager.MsgFlotante(3,data.mensaje);
                    }
                }
            });
        }else{
            dirty = false;
        }

    }

    function onDisabledSave() {

        editor.isNotDirty = true;
        editor.getParam("save_enablewhendirty", null);
        mySelf.disabled(editor.getParam("save_enablewhendirty", true) && !editor.isDirty());
    }

    function stateToggle() {

        mySelf = this;
        editor.on('nodeChange', function(a) {
            mySelf.disabled(editor.getParam("save_enablewhendirty", true) && !editor.isDirty());
          /*  if(dirty){
                console.log('1');
                mySelf.disabled(editor.getParam("save_enablewhendirty", true) && !editor.isDirty());
            }else{
                console.log('2');
                mySelf.disabled(true);
                dirty = true;
            }*/
        });
    }

    editor.addCommand('mceSave', save);
    editor.addCommand('mceDisabledSave', onDisabledSave);

    editor.addButton('save', {
        icon: 'save',
        text: 'Save',
        cmd: 'mceSave',
        disabled: true,
        tooltip: 'Save contents (Ctrl+S)',
        onPostRender: stateToggle
    });



    editor.addShortcut('ctrl+s', '', 'mceSave');

});
