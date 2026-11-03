/**
 * Created by lily on 19/01/16.
 */

Ext.define('Traces.view.VentanaTiempoReal', {
    extend: 'Ext.window.Window',
    alias: 'widget.ventanaTiempoReal',

    initComponent: function () {
        this.title = perfil.etiquetas.ventanaTimeReal.title,//'Tiempo Real';
        this.layout = 'fit';
        this.height = 160;
        this.width = 300;
        this.modal = true;
        this.constrain = true,
        this.resizable = true;
        this.closable = true;
        this.closeAction = 'destroy';
        this.id = 'winTiempoReal';
        var _this = this;

        this.formularioTiempoReal = Ext.create('Ext.form.Panel', {
            frame:true,
            border: false,
            layout:'fit',
            bodyStyle:'padding:10px 9px 0 4px',

            fieldDefaults: {
                msgTarget: 'qtip',
                labelWidth: 75,
                labelAlign: 'top'
            },

            defaultType: 'textfield',

            items: [{
                xtype:'fieldset',
                id: 'fieldsetformTimeReal',
                name:'fieldsetformTimeReal',
                //collapsible: false,
                defaultType: 'numberfield',
                //layout: 'form',
                defaults: {
                    anchor: '100%',
                    style: 'padding: 8px 0 0 0'
                },
                items :[
                    {
                        fieldLabel: perfil.etiquetas.ventanaTimeReal.timerecarga, //'Tiempo de recarga <b>(en segundos)</b>',
                        name:'tiempoRecarga',
                        id: 'tiempoRecarga',
                        prevTab: 'aceptar',
                        allowBlank: false,
                        blankText: perfil.etiquetas.general.blankText,//'Este campo es obligatorio.',
                        minValue: 3,
                        minText: perfil.etiquetas.ventanaTimeReal.minText,//"El valor mínimo de recarga es de {0} segundos",
                        maxValue: 60,
                        maxValueText: perfil.etiquetas.ventanaTimeReal.maxValueText//'El valor máximo de recarga es de {0} segundos'
                    }
                ]
            }],

            buttons: [
                {
                    iconCls: 'cancelar',
                    id: 'cancelar',
                    nextTab: 'aceptar',
                    prevTab: 'tiempoRecarga',
                    text: perfil.etiquetas.general.textCancelar,//'Cancelar',
                    tooltip: perfil.etiquetas.general.tooltipCancelar,//'Cancelar <b>(Alt+X)</b>',
                    action:'closeWin'
                },{
                    iconCls: 'aceptar',
                    id:'aceptar',
                    disabled: true,
                    nextTab: 'tiempoRecarga',
                    prevTab: 'cancelar',
                    text: perfil.etiquetas.general.textAceptar,//'Aceptar',
                    tooltip: perfil.etiquetas.general.tooltipAceptar,//'Aceptar <b>(Enter)</b>',
                    action: 'agregarTiempoRecarga'
                }
            ],

            listeners:{
                fieldvaliditychange: function(field, label, isValid, eOpts ){
                    if(isValid)
                        Ext.getCmp('aceptar').enable();
                    else
                        Ext.getCmp('aceptar').disable();
                }

            }


        });

        this.items = [this.formularioTiempoReal];

        this.callParent(arguments);
    }
});