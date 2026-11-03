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
 * plugin ayuda.
 */
tinymce.PluginManager.add('ayuda', function(editor, url) {
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

	// Adds a menu item to the tools menu

	editor.addMenuItem('ayuda', {
		text: 'Ayuda',
		context: 'tools',
        icon:'xheader',
		onclick: function() {

			// Open window with a specific url
		editor.windowManager.open({
				title       : 'Ayuda v3',
                width : parseInt(editor.getParam("plugin_preview_width", "780"), 10),
                height : parseInt(editor.getParam("plugin_preview_height", "450"), 10),
				url         : local[0]+'help/index.html'

			});

		}
	});
});
