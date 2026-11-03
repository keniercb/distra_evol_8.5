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

	function save() {
		
		//var formObj;
        var self = this;
        tinymce.activeEditor.setProgressState(true);
        $.ajax({
            type: "POST",
            url: "updateContenido",
            data: { 
				//idNodo: editor.getNodeSelected().idnode,
				// name : projectNombre
                uri: selectUri,
				idplantilla: idplantilla,
                contens: editor.getContent()
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

	}

    function onDisabledSave() {
		
        editor.isNotDirty = true;
        editor.getParam("save_enablewhendirty", null);
        mySelf.disabled(editor.getParam("save_enablewhendirty", true) && !editor.isDirty());
    }

	function stateToggle() {
		mySelf = this;
		
		editor.on('nodeChange', function() {			
            mySelf.disabled(editor.getParam("save_enablewhendirty", true) && !editor.isDirty());
		});
	}

	editor.addCommand('mceSave', save);
	editor.addCommand('mceDisabledSave', onDisabledSave);

	editor.addButton('save', {
		icon: 'save',
		text: 'Save',
		cmd: 'mceSave',
		disabled: true,
		onPostRender: stateToggle
	});
	editor.addShortcut('ctrl+s', '', 'mceSave');	
});
