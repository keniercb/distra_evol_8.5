/**
 * Created by adrian on 11/11/14.
 */

Ext.define('Controlpanel.view.addRepo', {
    extend: 'Ext.window.Window',
    alias: 'widget.newRepo',

    initComponent: function () {

        this.form = Ext.create('Ext.form.Panel', {

            labelWidth: 100,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            labelAlign: 'top',
            layout:'fit',

            items: [{
                // Fieldset in Column 1 - collapsible via toggle button
                xtype:'fieldset',
                title: Zeolides.etiquetas.titleFielSetAddrepo,
                defaults: {
                    labelAlign: 'top',
                    padding:  '5 0 5 0'

                },

                //collapsible: true,

                items :[{
                    xtype: 'textfield',
                    fieldLabel: 'Denominación',
                    name: 'denominacion',
                    allowBlank: false,
                    blankText: 'Este campo es obligatorio.',
                    id: 'denominacion',
                    anchor:'100%',
                    maxLength: 60,
                    maxLengthText: 'Solo admite hasta 60 caracteres',
                    regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-]*))$/,
                    regexText: "Solo admite caracteres alfanuméricos y los caracteres especiales (-_).",
                    prevTab:'aceptarRepo'


                },{
                    xtype: 'textfield',
                    fieldLabel: 'Dirección URL',
                    name: 'direccion',
                    allowBlank: false,
                    blankText: 'Este campo es obligatorio.',
                    id: 'url',
                    emptyText: 'Dirección URL del nuevo repositorio',
                    anchor:'100%',
                    regex: /^((http)+s?:\/\/)+([a-zA-Z0-9\d\_\.\:\/\-]*)$/,
                    regexText: "El campo debe ser una url válida."


            }]
            }],
            buttons: [{
                text: Zeolides.etiquetas.textCancelar,
                iconCls: 'cancelar',
                id:'cancelarRepo',
                tooltip : Zeolides.etiquetas.tooltipCancelar,
                nextTab: 'aplicarRepo',
                action:'closeWin'
            },{
                text: Zeolides.etiquetas.textAplicar,
                iconCls: 'aplicar',
                name: 'aplicarRepo',
                id: 'aplicarRepo',
                formBind: this.formBind,
                tooltip : Zeolides.etiquetas.tooltipAplicar,
                nextTab:'aceptarRepo',
                prevTab:'cancelarRepo',
                action:'aceptarRepo'
            },{
                text: Zeolides.etiquetas.textAceptar,
                iconCls: 'aceptar',
                name: 'aceptarRepo',
                id: 'aceptarRepo',
                formBind: this.formBind,
                tooltip : Zeolides.etiquetas.tooltipAceptar,
                nextTab:'denominacion',
                prevTab: '',
                action:'aceptarRepo'
            }]
        });
        this.listeners = {
          beforedestroy: function(){
              if(Ext.getCmp('treePack').getSelectionModel().getLastSelected() && !Ext.getCmp('treePack').getSelectionModel().getLastSelected().isRoot()) {
                  Ext.getCmp('elimrepo').setDisabled(false);
                  Ext.getCmp('modrepo').setDisabled(false);
              }
              Ext.getCmp('addrepo').setDisabled(false);
          }
        };
        this.title =  Zeolides.etiquetas.titleWinAddRepo,
        this.layout = 'fit',
        //this.autoShow = true,
        this.height = 230,
        this.width = 350,
        this.modal = true,
        this.resizable = false,
        this.closable = true,
        this.closeAction = 'destroy',
        this.id = 'winAddRepo',
        this.name = 'winAddRepo',
        this.constrain = true,
        //this.layout = 'fit',
        this.items = [this.form]

        this.callParent(arguments);
    }
});