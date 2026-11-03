Ext.define('ComiteImportacion.view.TinyEditor', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.tinyeditor',
    isEditorInit: false,
    lastHeight: null,
    lastFrameHeight: null,
    errors: new Array(),
    readOnly: false,
    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        me.on('resize', function (elm, width, height) {
            if(me.isEditorInit)
                me.syncEditorHeight(height);
            else
                me.initEditor(height);
        }, me);
    },
    syncEditorHeight: function (height) {
        var me = this;

        me.lastHeight = height;

        if (!me.isEditorInit || !me.rendered) { return; }

        var ed = tinymce.get(me.getInputId());

        if (ed.isHidden()) { return; }

        var edIframe = Ext.get(me.getInputId() + "_ifr");

        var parent = edIframe.up(".mce-edit-area");
        parent = parent.up(".mce-container-body");

        var newHeight = height;

        var edToolbar = parent.down(".mce-toolbar-grp");
        if(edToolbar)
            newHeight -= edToolbar.getHeight();

        var edMenubar = parent.down(".mce-menubar");
        if(edMenubar)
            newHeight -= edMenubar.getHeight();

        var edStatusbar = parent.down(".mce-statusbar");
        if(edStatusbar)
            newHeight -= edStatusbar.getHeight();

        me.lastFrameHeight = newHeight - 3;

        var container = me.findParentBy( function(){return true});
        // console.info(container);
        // console.info(container.getLayout( ) );
        // console.info(container.layout);
        edIframe.setHeight(newHeight - 13);

        return newHeight - 3;
    },
    initEditor: function(height){
        var me = this;

        me.tinyMCEConfig = {
            mode: "exact",
            resize: false,
            elements: me.getInputId(),
            plugins: [ "table textcolor advlist lists hr paste"],//contextmenu
            paste_as_text: true,
            // paste_retain_style_properties: "all",
            // paste_remove_styles_if_webkit: false,
            language: 'es',
            menubar: false,
            statusbar: false,
            extended_valid_elements : 'span[*|idelemento]',
            content_style: me.getElementStyle(),
            init_instance_callback: function(edit){
                if(!Ext.isEmpty(me.value)){
                    edit.setContent(me.value);
                }
            },
            readonly: me.readOnly,
            toolbar: !me.readOnly,
        };

        if(!me.readOnly){
            me.tinyMCEConfig.toolbar1= "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | addElem";
            me.tinyMCEConfig.toolbar2= "cut copy paste | bullist numlist | indent outdent | undo redo | table | hr removeformat | subscript superscript";
            me.tinyMCEConfig.toolbar_items_size= 'small';
        }

        me.tinyMCEConfig.setup = function(editor) {
            editor.on('init', function(e) {
                me.isEditorInit = true;

                if(height){
                    setTimeout(function () { me.syncEditorHeight(height);}, 200);
                }
            });

            editor.on('keyup', me.checkValidEditor.bind(me));
            editor.on('blur', me.checkValidEditor.bind(me));
            editor.on('paste', me.checkValidEditor.bind(me));
            editor.on('contextmenu', me.checkValidEditor.bind(me));
            editor.on('ExecCommand', me.checkValidEditor.bind(me));
        };

        tinymce.init(me.tinyMCEConfig);
    },
    addElement: function(idelemento, nombre, unique) {
        var me = this,
            editor = tinymce.get(me.getInputId()),
            expression = new RegExp("idelemento\=\"" + idelemento + "\"", "g");

        if (!this.getValue().match(expression) || !unique) {
            editor.insertContent('<span class="editor-element" idelemento= ' + idelemento + ' contentEditable="false">' + nombre + '</span>');
        }
    },
    getElementStyle: function(){
        return ".editor-element{" +
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
    },
    setValue: function (value) {
        var me = this;
        if(me.rendered){
            Ext.Function.defer(function(value){
                tinymce.get(me.getInputId()).setContent(value);
            }, 200, me, [value]);
        }
    },
    getValue: function () {
        var me = this;
        if(me.rendered && me.isEditorInit)
            return tinymce.get(me.getInputId()).getContent();
        return '';
    },
    getSubmitValue: function () {
        return this.getValue();
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
            isValid = Ext.isEmpty(errors);

        if (!_this.preventMark) {
            if (isValid) {
                _this.clearInvalid();
            } else {
                _this.markInvalid(errors[0]);
            }
        }

        return isValid;
    },
    getErrors: function () {
        this.errors = [];
        if (this.allowBlank === false) {
            this.isEmpty();
        }
        return this.errors;
    },
    isEmpty: function () {
        var value = this.getValue().trim();

        if (Ext.isEmpty(value) || value === '<br>') {
            this.addError(this.blankText);
        } else {
            this.removeError(this.blankText);
        }
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
    checkValidEditor: function(){
        this.isValid();
    },
    beforeDestroy: function () {
        var me = this;

        var ed = tinymce.get(me.getInputId());

        if(ed) ed.destroy(false);
    },
});
