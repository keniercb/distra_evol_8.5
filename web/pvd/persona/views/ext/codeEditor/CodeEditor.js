Ext.ns('Ext.components');

Ext.components.CodeEditor = Ext.extend(Ext.Window, {
    modal: true,
    title: 'Editor de codigo',
    closeAction: 'hide',
    layout: 'border',
    width: 700,
    maximizable: true,
    height: 500,
    autoScroll: false,
    initComponent: function ()
    {
        var self = this;
        var init = false;

        this.language = this.language || "javascript";
        this.languageFolder = "../../views/ext/codeEditor/resources/js/languages/";

        this.textAreaCode = new Ext.form.TextArea({
            name: "textAreaCode"
        });

        this.pCodigo = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            items: [this.textAreaCode]
        })

        this.stCmp = new Ext.data.SimpleStore({
            fields: [
                {name: 'denominacion'},
                {name: 'idproyectoconcepto'},
            ]
        });

        this.gpCmp = new Ext.grid.GridPanel({
            region: 'west',
            width: "30%",
            split: true,
            margins: '5 0 5 5',
            store: this.stCmp,
            columns: [
                {id: 'idcomp' + this.id, header: "Componente", width: 160, sortable: true, dataIndex: 'denominacion'},
                {header: "Id", width: 50, sortable: true, dataIndex: 'idproyectoconcepto'}
            ],
            stripeRows: true,
            autoExpandColumn: 'idcomp' + this.id,
//            title: 'Array Grid'
        });

        /**
         * Boton cerrar ventana del editor de codigo
         * @type {Button}
         */
        this.btnClose = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: 'Cerrar editor de codigo',
            handler: function ()
            {
                this.hide();
            }.createDelegate(this)
        });

        this.on('hide', function ()
        {
            this.fireEvent('save', this.editor, this.editor.getValue());
        }, this);

        this.buttons = [this.btnClose];

        this.a = function (a)
        {
        }

        this.btnSave = new Ext.Button({
            iconCls: 'guardar',
            text: 'Guardar',
            tooltip: 'Guardar codigo',
            handler: function ()
            {
                this.fireEvent('save', this.editor, this.editor.getValue());
            }.createDelegate(this)
        });

        //this.tbar = [this.btnSave];

        this.items = [this.gpCmp, this.pCodigo];

        this.textAreaCode.on('resize', function (cmp, w, h)
        {
            if (!init) {
                init = true;
                this.createCodeEditor(this.textAreaCode);
            }
            var size = this.pCodigo.body.getSize();
            this.editor.setSize(size.width, size.height);
            this.doLayout();
        }, this);
        Ext.components.CodeEditor.superclass.initComponent.call(this);
    },
    createCodeEditor: function (textarea)
    {
        var self = this;
        /* var size = textarea.getSize();

         //CodeMirror.modeURL = this.languageFolder + "%N/%N.js";
         this.editor = CodeMirror.fromTextArea(textarea.getEl().dom, {
         lineNumbers: true,
         extraKeys: {
         "Ctrl-Space": function (cm)"autocomplete"
         {
         CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
         }
         }
         });
         //self.editor.setOption("mode", self.language);
         //CodeMirror.autoLoadMode(self.editor, self.language);
         this.editor.setValue('function a(){}');
         //this.editor.setValue(textarea.getValue());*/
        this.editor = CodeMirror.fromTextArea(textarea.getEl().dom, {
            lineNumbers: true,
            extraKeys: {"Ctrl-Space": "autocomplete"}
        });

    },
    setValue: function (value)
    {
        /*this.value = value;
         this.jsdecoder = new JsDecoder();
         this.jsdecoder.s = value;
         var code = this.jsdecoder.decode();
         this.format = true;
         this.editor.setValue(code);*/
        this.editor.setValue(value);
    },
    getFunctionJs: function ()
    {
        var functions = {};
        var str = "";

        var src = this.editor.getValue();
        var arrayFn = src.split("},");
        Ext.each(arrayFn, function (fnsrc)
        {
            var fn = fnsrc.split(":")
            functions[fn[0]] = fn[1] + "}";
        });
        return functions;

    },
    setCmp: function (data)
    {
        if(data.length > 0)
            this.stCmp.loadData(data);
    }
});
