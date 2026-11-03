Ext.define('ConfContratacion.view.TabFileConfiguracion', {
    extend: 'Ext.Panel',
    region: 'center',
    frame:true,
    autoScroll: true,
    layout: 'fit',
    initComponent: function() {
        var init = false;
        var me=this;

        this.btnSave = new Ext.Button({
            iconCls: 'guardar',
            text: 'Guardar',
            tooltip: 'Guardar cambios',
            handler: function () {
                // PVD.mostrarMascara('mskfile', 'Por favor espere', 'Cargando datos');
                Ext.MessageBox.show({
                    msg: 'Guardando',
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });
                Ext.Ajax.request({
                    // url: 'saveFileCompartimentacion',
                    url: UtilsFn.buildUrl({action: 'saveFileConfiguracion'}, ModuleMgr.get('ConfContratacion')),
                    method: 'POST',
                    params: {
                        code: me.tarea.getValue()
                    },
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        // PVD.ocultarMascara('mskfile');
                        var responseData = Ext.decode(response.responseText);
                        mostrarMensaje(1, 'La configuraci&oacute;n ha sido guardada satisfactoriamente.');
                        me.loadConf();
                    }
                });
            }
        });

        this.tarea = Ext.create('Ext.form.field.TextArea',{
            margins : '7 7 7 7',
            // width:1300,
            // height:600,
            name: 'taCode'

        });


        this.bbar = ['->', this.btnSave];
        this.items = [this.tarea];
        this.callParent();
        me.loadConf();
        // this.tarea.on('resize', function (cmp, w, h)
        // {
        //     if (!init) {
        //         init = true;
        //         this.createCodeEditor(this.tarea);
        //     }
        //     var size = this.body.getSize();
        //     this.editor.setSize(size.width, size.height);
        //     this.doLayout();
        // }, this);

        this.on('render', function(cmp) {
            // PVD.mostrarMascara('mskfile', 'Por favor espere', 'Cargando datos');
            // Ext.Ajax.request({
            //     url: UtilsFn.buildUrl({action: 'getFileConfiguracion'}, ModuleMgr.get('ConfContratacion')),
            //     method: 'POST',
            //     params: {
            //     },
            //     callback: function (options, success, response) {
            //         var responseData = Ext.decode(response.responseText);
            //         console.log(responseData)
            //         this.taCode.setValue(responseData.code);
            //     }
            // });
        });
    },
    loadConf: function(){
        var me=this;
        Ext.MessageBox.show({
            msg: 'Cargando',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getFileConfiguracion'}, ModuleMgr.get('ConfContratacion')),
            method: 'POST',
            params: {
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                Ext.MessageBox.hide();
                console.log(responseData)
                console.log(me.tarea)

                me.tarea.setValue(responseData.code);
            }
        });
    },
    createCodeEditor: function (textarea)
    {
        this.editor = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            matchBrackets: true,
            mode: "application/x-httpd-php",
            indentUnit: 4,
            indentWithTabs: true,
            styleActiveLine: true
        });
    }
});
