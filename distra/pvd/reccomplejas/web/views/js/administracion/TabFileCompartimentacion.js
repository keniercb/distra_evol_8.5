Ext.ns('Ext.reccomplejas');
Ext.reccomplejas.TabFileCompartimentacion = Ext.extend(Ext.Panel, {
    title: 'Editar fichero compartimentación',
    tabTip: 'Editar fichero PHP de compartimentación <b>(Alt+4)</b>',
    layout: 'fit',

    initComponent: function() {
        var self = this;
        var init = false;

        this.btnSave = new Ext.Button({
            iconCls: 'guardar',
            text: 'Guardar',
            tooltip: 'Guardar cambios',
            handler: function () {
                PVD.mostrarMascara('mskfile', 'Por favor espere', 'Cargando datos');
                Ext.Ajax.request({
                    url: 'saveFileCompartimentacion',
                    method: 'POST',
                    params: {
                        idconfiguracion: self.config.get('idconfiguracion'),
                        code: self.editor.getValue()
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mskfile');
                        var responseData = Ext.decode(response.responseText);
                    }
                });
            }
        });

        this.taCode = new Ext.form.TextArea({
            margins : '5 5 5 5',
            name: 'taCode'
        });

        this.bbar = ['->', this.btnSave];
        this.items = [this.taCode];
        Ext.reccomplejas.TabFileCompartimentacion.superclass.initComponent.call(this);

        this.taCode.on('resize', function (cmp, w, h)
        {
            if (!init) {
                init = true;
                this.createCodeEditor(this.taCode);
            }
            var size = this.body.getSize();
            this.editor.setSize(size.width, size.height);
            this.doLayout();
        }, this);

        this.on('render', function(cmp) {
            PVD.mostrarMascara('mskfile', 'Por favor espere', 'Cargando datos');
            Ext.Ajax.request({
                url: 'getFileCompartimentacion',
                method: 'POST',
                params: {
                    idconfiguracion: self.config.get('idconfiguracion')
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('mskfile');
                    var responseData = Ext.decode(response.responseText);
                    self.editor.setValue(responseData.code);
                }
            });
        });
    },
    createCodeEditor: function (textarea)
    {
        this.editor = CodeMirror.fromTextArea(textarea.getEl().dom, {
            lineNumbers: true,
            matchBrackets: true,
            mode: "application/x-httpd-php",
            indentUnit: 4,
            indentWithTabs: true,
            styleActiveLine: true
        });
    }
});
