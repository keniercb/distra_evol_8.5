/**
 * Created by adrian on 11/11/14.
 */

Ext.define('Packed.view.addRepo', {
    extend: 'Ext.window.Window',
    alias: 'widget.newRepo',

    initComponent: function () {

        this.formAddRepo = Ext.create('Ext.form.Panel', {

            frame: true,
            width: 290,
            bodyPadding: 5,
            waitMsgTarget: true,

            fieldDefaults: {
                labelAlign: 'top',
                width: 260
            },

            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: Zeolides.etiquetas.textDirUrlRepo,
                    name: 'dirurlRepo',
                    id: 'dirurlRepo',
                    allowBlank: false,
                    emptyText: Zeolides.etiquetas.emptyTextDirUrl,
                    padding :'5 0 0 0',
                    blankText: Zeolides.etiquetas.blankText,
                    regex : /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i,
                    regexText : Zeolides.etiquetas.urlText,
                    nextTab:'cancelarRepo',
                    prevTab:'aceptarRepo'
                }
            ],

            buttons: [{
                text: Zeolides.etiquetas.textCancelar,
                iconCls: 'cancelar',
                id: 'cancelarRepo',
                tooltip : Zeolides.etiquetas.tooltipCancelarAddRepo,
                action:'closeWin',
                nextTab:'',
                prevTab:'dirurlRepo'
            },{
                text: Zeolides.etiquetas.textAplicar,
                iconCls: 'aplicar',
                name: 'aplicarRepo',
                id: 'aplicarRepo',
                formBind: true,
                tooltip : Zeolides.etiquetas.tooltipAplicarAddRepo,
                action:'comprobarUrl',
                nextTab:'aceptarRepo',
                prevTab:'cancelarRepo'
            },{
                text: Zeolides.etiquetas.textAceptar,
                iconCls: 'aceptar',
                name: 'aceptarRepo',
                id: 'aceptarRepo',
                formBind: true,
                tooltip : Zeolides.etiquetas.tooltipAceptarAddRepo,
                action:'comprobarUrl',
                nextTab:'dirurlRepo',
                prevTab:''
            }]
        });

        this.title =  Zeolides.etiquetas.titleWinAddRepo,
        //this.layout = 'fit',
        //this.autoShow = true,
        this.height = 135,
        this.width = 305,
        this.modal = true,
        this.resizable = false,
        this.closable = true,
        this.closeAction = 'destroy',
        this.id = 'winAddRepo',
        this.name = 'winAddRepo',
        this.items = [this.formAddRepo],
        this.constrain = true,


        this.callParent(arguments);
    }
});