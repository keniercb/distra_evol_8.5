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

tinymce.PluginManager.add('advlist', function(editor) {
	var olMenuItems, ulMenuItems, lastStyles = {};

	function buildMenuItems(listName, styleValues) {
		var items = [];

		tinymce.each(styleValues.split(/[ ,]/), function(styleValue) {
			items.push({
				text: styleValue.replace(/\-/g, ' ').replace(/\b\w/g, function(chr) {
					return chr.toUpperCase();
				}),
				data: styleValue == 'default' ? '' : styleValue
			});
		});
		
		return items;
	}

	olMenuItems = buildMenuItems('OL', editor.getParam(
		"advlist_number_styles",
		"default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman"
	));

	ulMenuItems = buildMenuItems('UL', editor.getParam("advlist_bullet_styles", "default,circle,disc,square"));

	function applyListFormat(listName, styleValue) {
		var list, dom = editor.dom, sel = editor.selection;

		// Check for existing list element
		list = dom.getParent(sel.getNode(), 'ol,ul');

		// Switch/add list type if needed
		if (!list || list.nodeName != listName || styleValue === false) {
			editor.execCommand(listName == 'UL' ? 'InsertUnorderedList' : 'InsertOrderedList');
		}

		// Set style
		styleValue = styleValue === false ? lastStyles[listName] : styleValue;
		lastStyles[listName] = styleValue;

		list = dom.getParent(sel.getNode(), 'ol,ul');
		if (list && styleValue) {
			dom.setStyle(list, 'listStyleType', styleValue);
			list.removeAttribute('data-mce-style');
		}

		editor.focus();
	}

	function updateSelection(e) {
		var listStyleType = editor.dom.getStyle(editor.dom.getParent(editor.selection.getNode(), 'ol,ul'), 'listStyleType') || '';

		e.control.items().each(function(ctrl) {
			ctrl.active(ctrl.settings.data === listStyleType);
		});
	}

    function statesButtons() {

        var _self = this;
		
        editor.on('init', function() {
            var editable = (tinymce.activeEditor.getBody().getAttribute('contenteditable')=="true") ? true : false;

            if(/*tinymce.activeEditor.getNodeSelected() && */editable){
                _self.disabled(false);
            }else{
                _self.disabled(true);
            }

        });
    }

	editor.addButton('numlist', {
		type: 'splitbutton',
		tooltip: 'Numbered list',
		menu: olMenuItems,
        disabled:true,
		onshow: updateSelection,
		onselect: function(e) {
			applyListFormat('OL', e.control.settings.data);
		},
		onclick: function() {
			applyListFormat('OL', false);
		},
        onPostRender: statesButtons
	});

	editor.addButton('bullist', {
		type: 'splitbutton',
		tooltip: 'Bullet list',
		menu: ulMenuItems,
        disabled:true,
		onshow: updateSelection,
		onselect: function(e) {
			applyListFormat('UL', e.control.settings.data);
		},
		onclick: function() {
			applyListFormat('UL', false);
		},
        onPostRender: statesButtons
	});
});