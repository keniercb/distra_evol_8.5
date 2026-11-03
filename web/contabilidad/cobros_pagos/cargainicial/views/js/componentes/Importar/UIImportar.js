Ext.namespace('Ext.UIImportar');

Ext.UIImportar = Ext.extend(Ext.Window, {
    constructor: function(scope)
    {
        scope.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            text: scope.etiquetas.lbCancelar,
            tooltip: scope.etiquetas.lbCancelar,
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: scope.etiquetas.lbBtnAceptar,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this
        });

        /*scope.tfAddNumeroDocumento = new Ext.form.FileUploadField({
         fieldLabel: scope.etiquetas.lbFieldImport,
         name: 'fileUpload',
         id: 'fileUpload',
         allowBlank: false,
         blankText: scope.etiquetas.lbBlankText,
         enableKeyEvents: true,
         anchor: '100%'
         })*/

        scope.fpImportar = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            fileUpload: true,
            bodyStyle: 'padding:5px 5px 0',
            items: new Ext.form.FileUploadField({
                fieldLabel: scope.etiquetas.lbFieldImport,
                name: 'fileUpload',
                id: 'fileUpload',
                allowBlank: false,
                blankText: scope.etiquetas.lbBlankText,
                anchor: '100%'
            })
        });

        Ext.apply(this, {
            modal: false,
            //bodyStyle: 'padding:5px 5px 0',
            //border: false,
            //closable: true,
            //resizable: true,
            closeAction: 'hide',
            layout: 'fit',
            title: scope.titulo,
            width: 400,
            height: 150,
            items: scope.fpImportar,
            buttons: [scope.btnCancelar, scope.btnAceptar]
        });

        return Ext.UIImportar.superclass.constructor.call(this);
    }
});