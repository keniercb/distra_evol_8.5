/**
 * Created by lily on 13/02/15.
 */
Ext.define('Conf.view.gestsist.VentanaImportarSistema', {
    extend: 'Ext.window.Window',
    alias: 'widget.ventanaImportarSistema',

    initComponent: function(){
        this.title = perfil.etiquetas.titlewinImp;//'Importar sistema';
        this.layout = 'fit';
        this.width = 400,
        this.height = 165;
        this.modal = true;
        this.resizable = true;
        this.constrain = true;
        this.closable = true;
        this.closeAction = 'destroy';
        this.id = 'winImpSist';
        var _this = this;

        this.formularioImpSist = Ext.create('Ext.form.Panel', {

            bodyPadding: 10,
            layout: 'fit',
            id: 'formularioImpSist',
            name: 'formularioImpSist',
            frame:true,
            border: false,
            bodyStyle:'padding:5px 5px 2px',
            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 80,
                labelAlign: 'top'
            },
            defaults: { anchor: '99.5%' },

            items: [{
                xtype:'fieldset',
                id: 'fieldsetformImpSist',
                name:'fieldsetformImpSist',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%',
                    style: 'padding: 8px 0 8px 0'
                },
                items :[
                    {
                        xtype: 'filefield',
                        name:'fileUpload',
                        id:'fileUpload',
                        fieldLabel: perfil.etiquetas.fieldLabelImp,//'Seleccione el sistema para importar',
                        labelWidth: 50,
                        msgTarget: 'qtip',
                        allowBlank: false,
                        blankText: perfil.etiquetas.blankText, //'Este campo es obligatorio.',
                        anchor: '100%',
                        //buttonText: 'Buscar...',
                        buttonConfig:{
                            iconCls: 'buscar',
                            name: 'btnBuscarSistema',
                            id: 'btnBuscarSistema',
                            text: perfil.etiquetas.buscar,//'Buscar'
                            nextTab: 'cancelar',
                            prevTab: 'fileUpload'
                        }
                    }
                ]
            }],

            buttons: [{
                iconCls: 'cancelar',
                id: 'cancelar',
                nextTab: 'aceptar',
                prevTab: 'btnBuscarSistema',
                text: perfil.etiquetas.cancelar,//'Cancelar',
                tooltip:perfil.etiquetas.toolTipcancelar,//'Cerrar ventana sin guardar los datos',
                action:'closeWin'
            },{
                iconCls: 'aceptar',
                id:'aceptar',
                nextTab: 'fileUpload',
                prevTab: 'cancelar',
                text: perfil.etiquetas.aceptar,//'Aceptar',
                tooltip: perfil.etiquetas.toolTipaceptar, //'Guardar datos y cerrar ventana',
                action: 'importarSistema'
            }]

        });

        this.items = [this.formularioImpSist];

        this.callParent(arguments);
    }
});
