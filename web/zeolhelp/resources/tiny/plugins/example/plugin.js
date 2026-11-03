/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*jshint unused:false */
/*global tinymce:true */

/**
 * Example plugin that adds a toolbar button and menu item.
 */
tinymce.PluginManager.add('example', function(editor, url) {
    var local = url.split('resources');
	// Add a button that opens a window
	/*editor.addMenuItem('example', {
		text: 'My button',
		icon: false,
        context: 'tools',
		onclick: function() {
			// Open window
			editor.windowManager.open({
				title: 'Example plugin',
				body: [
					{type: 'textbox', name: 'title', label: 'Title'}
				],
				onsubmit: function(e) {
					// Insert content when the window form is submitted
					editor.insertContent('Title: ' + e.data.title);
				}
			});
		}
	});*/

    editor.addButton('example', {
        icon:'xfolder-open',
        tooltip:'Contenido de ayudas',
        onclick: function() {

         editor.windowManager.open({
                title       : 'Contenido',
                id          : 'winContenido',
                url         : local[0]+'/view.html',
                fullScreen  :true

            });


        }
    });

	// Adds a menu item to the tools menu

	editor.addMenuItem('example', {
		text: 'Contenido',
		context: 'tools',
        icon:'xfolder-open',
		onclick: function() {

			// Open window with a specific url
		editor.windowManager.open({
				title       : 'Contenido',
                id          : 'winContenido',
				url         : local[0]+'/view.html',
                fullScreen  :true


			});

		}
	});
});
