Ext.define('Ext.ux.CustomHtmlEditor', {
    extend: 'Ext.form.field.Base',
    alias: 'widget.customhtmleditor',
    fieldSubTpl: ['<div id="{id}" class="{fieldCls}"></div>', {}],
    height: 184,
    errors: new Array(),

    varTooltip: '',

    /*
     * 9  TAB
     * 27 ESC
     * 35 END
     * 36 HOME
     * 37 LEFT
     * 38 UP
     * 39 RIGHT
     * 40 DOWN
     * 17 CTRL
     * 8 BACKSPACE
     * 46 DELETE
     * */
    navigateKeys: [9, 27, 35, 36, 37, 38, 39, 40, 17, 8, 46],

    initComponent: function () {
        var _this = this,
            config = Ext.Object.merge({
                //enableSourceEdit: false,  //TODO asignar true a la propiedad enableSourceEdit
                enableVar: true,
                enableLinks: false,
                enableColors: true,
                labelAlign: 'top',
                allowBlank: _this.allowBlank,
                hideLabel: true,
                disableItems: function (disabled) {
                    var items = this.getToolbar().items.items,
                        i,
                        iLen = items.length,
                        item;

                    for (i = 0; i < iLen; i++) {
                        item = items[i];

                        if (!item.action && item.getItemId() !== 'sourceedit') {
                            item.setDisabled(disabled);
                        }
                    }
                }
            }, _this.initialConfig);

        if (!document.getElementById('style-customhtmleditor')) {
            //agregando los estilos del componente
            var styleLeaf = document.createElement('style');
            styleLeaf.id = 'style-customhtmleditor';

            styleLeaf.innerHTML = ".x-form-invalid-field .x-html-editor-input{" +
            "border-color: #C30;" +
            "border-width: 1px !important;" +
            "background-image: url(\"../../lib/4.2/resources/ext-theme-classic/images/grid/invalid_line.gif\");" +
            "background-repeat: repeat-x;" +
            "background-position: center bottom;" +
            "padding-bottom:3px !important;}" +
            ".x-html-editor-input {border-width: 1px !important;}";

            document.body.appendChild(styleLeaf);
        }

        this.btnAddVar = Ext.create('Ext.Button', {
            iconCls: 'adicionar',
            action: 'addvar',
            tooltip: _this.varTooltip || 'Adicionar elemento',
            editor: _this
        });

        this.editor = Ext.create('Ext.form.field.HtmlEditor', config);

        if (this.editor.enableVar) {
            this.editor.toolbar.add('->', this.btnAddVar);
        }

        this.editor.on({
            scope: _this,
            initialize: function () {
                var win = this.editor.win,
                    document = win.document,
                    body = document.body,
                    style = body.getAttribute('style');

                body.setAttribute('style', style + 'line-height: 25px;');

                win.onblur = this.onBlur.bind(this);
                win.onkeyup = this.onkeyUp.bind(this);
                win.onkeypress = this.onKeyDown.bind(this);
                win.onmouseup = this.onMouseUp.bind(this);
                document.onpaste = this.onPaste.bind(this);
                document.oncontextmenu = this.onContextMenu.bind(this);

                if (!document.getElementById('style-editor-element')) {
                    //agregando los estilos del componente
                    var styleLeaf = document.createElement('style');
                    styleLeaf.id = 'style-editor-element';

                    styleLeaf.innerHTML = ".editor-element{" +
                    "border-radius: 3px;background-clip: padding-box;box-shadow: 0px 0px 2px #FFF inset, 0px 1px 0px rgba(0, 0, 0, 0.05);" +
                    "border: 1px solid #D1D1D1;padding: 3px;margin: 0px 1.2px 0px 1.2px;position: relative;cursor: pointer;list-style: outside none none;" +
                    "background-image: -moz-linear-gradient(center top , #FFF, #F9F9F9 48%, #E2E2E2 52%, #E7E7E7);" +
                    "background-color: #FFF;font-family: tahoma,arial,verdana,sans-serif !important;font-size: 12px !important;" +
                    "font-style: normal !important;}" +
                    ".editor-element:hover{" +
                    "border: 1px solid #B0CCF2;" +
                    "background-color: #E4F3FF;" +
                    "background-image: -moz-linear-gradient(center top , #E4F3FF, #D9EDFF 48%, #C2D8F2 52%, #C6DCF6);" +
                    "}" +
                    ".editor-element-pressed{" +
                    "border: 1px solid #7A9AC4 !important;" +
                    "background-color: #BCCFE5 !important;" +
                    "background-image: -moz-linear-gradient(center top , #BCCFE5, #C5D6E7 48%, #95C4F4 52%, #9FC9F5) !important;" +
                    "}";

                    document.head.appendChild(styleLeaf);
                }
            }
        });
        this.callParent(arguments);
    },
    onRender: function (ct, position) {
        this.callParent(arguments);
        this.editor.render(this.inputEl);
    },
    afterComponentLayout: function (width, height) {
        this.callParent();
        this.editor.setWidth(width);
        this.editor.setHeight(height);
    },
    onBlur: function () {
        this.isValid();
    },
    onKeyDown: function (key, e) {
        var me = this,
            document = this.editor.win.document,
            body = document.body,
            range = document.createRange(),
            sel = this.editor.win.getSelection(),
            anchorNode = sel.anchorNode,
            parentNode = anchorNode.parentNode,
            type = anchorNode.nodeName,
            value = anchorNode.nodeValue,
            typeparent = parentNode.nodeName,
            code = key.keyCode;

        //Si la tecla presionanda es distinta a las teclas especificadas en navigateKeys
        if (this.navigateKeys.indexOf(code) == -1) {
            return this.moveCursor(key);
        } else {
            //Si se presionó backspace o delete
            if (code == 8 || code == 46) {
                var pressed = document.getElementsByClassName('editor-element-pressed');

                if (pressed.length != 0) {
                    for (var i = pressed.length - 1; i >= 0; i--) {
                        body.removeChild(pressed[i]);
                    }
                    return false;
                }

                //si el nodo(DOM object) seleccionando es un span o el objeto body o su nodo padre es un span return false
                /*if (anchorNode.nodeName == 'SPAN' || parentNode.nodeName == 'SPAN' || anchorNode.nodeName == 'BODY' || anchorNode.nodeValue == ' ') {
                 return false;
                 }*/

                /*
                 * Evita que se borre el ultimo o el primer caracter de una cadena usando backspace o delete
                 * */
                /*if ((code == 8 && sel.anchorOffset == 0) || (code == 46 && sel.anchorOffset == anchorNode.length)) {
                 return false;
                 }*/

                /*
                 * Evita que se elimne los espacios que se encuentran inmediatamente antes y despues de un span y
                 * forman parte de una cadena, ejemplo: <span>' cadena '<span>
                 **/
                /*if (type == '#text' && value.indexOf(' ') != -1) {
                 if (code == 8) {
                 if ((sel.anchorOffset == anchorNode.length && value.charAt(value.length - 1) == ' ') || (sel.anchorOffset == 1 && value.charAt(0) == ' ')) {
                 return false;
                 }
                 } else {
                 if ((sel.anchorOffset == 0 && value.charAt(0) == ' ') || (sel.anchorOffset == anchorNode.length - 1 && value.charAt(value.length - 1) == ' ')) {
                 return false;
                 }
                 }
                 }*/
            }
        }
    },
    onMouseUp: function (mouse) {
        var document = this.editor.win.document,
            body = document.body,
            range = document.createRange(),
            sel = this.editor.win.getSelection(),
            focusNode = sel.focusNode,
            anchorNode = sel.anchorNode,
            parentNode = focusNode.parentNode;

        if (anchorNode == focusNode) {
            if (parentNode && parentNode.nodeName == 'SPAN' && parentNode.classList[0] == 'editor-element') {
                if (!mouse.ctrlKey) {
                    var pressed = document.getElementsByClassName('editor-element');
                    if (pressed.length != 0) {
                        for (k in pressed) {
                            if (pressed[k] && pressed[k].classList) {
                                pressed[k].classList.remove('editor-element-pressed');
                            }
                        }
                    }
                }
                if (!parentNode.classList.contains('editor-element-pressed')) {
                    parentNode.classList.add('editor-element-pressed');
                } else {
                    parentNode.classList.remove('editor-element-pressed');
                }
            } else {
                var pressed = document.getElementsByClassName('editor-element');
                if (pressed.length != 0) {
                    for (k in pressed) {
                        if (pressed[k] && pressed[k].classList) {
                            pressed[k].classList.remove('editor-element-pressed');
                        }
                    }
                }
            }
        } else {
            var direction = 'nextSibling';
            if (sel.anchorOffset > sel.focusOffset) {
                direction = 'previousSibling';
            }
            if (parentNode.nodeName == 'SPAN' && parentNode.classList[0] == 'editor-element') {
                focusNode = parentNode;
                focusNode.classList.add('editor-element-pressed');
            }
            while (anchorNode != focusNode) {
                if (anchorNode == null) {
                    break;
                }
                anchorNode = (anchorNode.parentNode.nodeName == 'SPAN' && anchorNode.parentNode.classList[0] == 'editor-element') ? anchorNode.parentNode : anchorNode;
                if (anchorNode.nodeName == 'SPAN' && anchorNode.classList[0] == 'editor-element') {
                    anchorNode.classList.add('editor-element-pressed');
                }
                anchorNode = anchorNode[direction];
            }
        }
    },
    onContextMenu: function (contextmenu) {
        return false;
    },
    onkeyUp: function (key) {
        if (key.keyCode == 27) {
            this.up('window').close();
            return;
        }
        this.isValid();
    },
    onPaste: function (e) {
        var data = '';
        e.preventDefault();
        if (Ext.isIE) {
            data = this.editor.win.clipboardData.getData('Text');
        } else {
            data = e.clipboardData.getData('text/plain');
        }
        this.moveCursor();
        this.editor.insertAtCursor(data);
    },
    moveCursor: function (key) {
        var me = this,
            document = this.editor.win.document,
            range = document.createRange(),
            sel = this.editor.win.getSelection(),
            anchorNode = sel.anchorNode,
            parentNode = anchorNode.parentNode;

        if (parentNode && this.isSpan(parentNode)) {
            var next = parentNode.nextSibling;
            if (!next || next && this.isSpan(next)) {
                parentNode.insertAdjacentHTML('afterend', ' ');
                next = parentNode.nextSibling;
            }
            if (next && !this.isSpan(next)) {
                this.setRange(next);
            }
        }
        this.removeSelections();
    },
    removeSelections: function () {
        var document = this.editor.win.document,
            pressed = document.getElementsByClassName('editor-element');

        if (pressed.length != 0) {
            for (k in pressed) {
                if (pressed[k] && pressed[k].classList) {
                    pressed[k].classList.remove('editor-element-pressed');
                }
            }
        }
    },
    isSpan: function (node) {
        if (node.nodeName == 'SPAN' && node.classList && node.classList.contains('editor-element')) {
            return true;
        }
        return false;
    },
    setRange: function (node) {
        var document = this.editor.win.document,
            range = document.createRange(),
            sel = this.editor.win.getSelection();
        range.setStart(node, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    },
    isEmpty: function () {
        var value = this.getValue().trim();

        if (Ext.isEmpty(value) || value === '<br>') {
            this.addError(this.blankText);
        } else {
            this.removeError(this.blankText);
        }
    },
    setValue: function (value) {
        this.editor.setValue(value);
    },
    getValue: function () {
        var value = this.editor.getValue().replace(/ editor-element-pressed/g, '');
        return value;
    },
    getSubmitValue: function () {
        return this.getValue();
    },
    getErrors: function () {
        this.errors = [];
        if (this.editor.allowBlank === false) {
            this.isEmpty();
        }
        return this.errors;
    },
    addError: function (error) {
        if (this.errors.indexOf(error) == -1) {
            this.errors.push(error);
        }
    },
    removeError: function (error) {
        var pos = this.errors.indexOf(error);
        if (pos != -1) {
            this.errors.splice(pos, 1);
        }
    },
    isValid: function () {
        var _this = this,
            disabled = _this.disabled,
            validate = _this.forceValidation || !disabled;

        return validate ? _this.validateValue() : disabled;
    },
    validateValue: function () {
        var _this = this,
            errors = _this.getErrors(),
            realWidth = _this.editor.initialConfig.width,
            isValid = Ext.isEmpty(errors);

        if (!_this.preventMark) {
            if (isValid) {
                _this.clearInvalid();
                //_this.editor.setWidth(realWidth);
            } else {
                _this.markInvalid(errors[0]);
                //_this.editor.setWidth(realWidth - 20);
            }
        }
        return isValid;
    },
    addVar: function (idelemento, nombre, unique) {
        var expression = new RegExp("idelemento\=\"" + idelemento + "\"", "g");
        this.moveCursor();
        if (!this.getValue().match(expression) || !unique) {
            this.editor.insertAtCursor('<span class = "editor-element" idelemento = ' + idelemento + ' >' + nombre + '</span>');
        }
    }
});
