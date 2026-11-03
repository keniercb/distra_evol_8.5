/**
 * Created by lily on 5/02/15.
 */


Ext.define('Conf.view.gestsist.VentanaAddAccion', {
    extend: 'Ext.window.Window',
    alias: 'widget.ventanaAddAccion',

    initComponent: function(){
        this.title = perfil.etiquetas.titleWinAccion;//'Adicionar acción';
        this.layout = 'fit';
        this.height = 300;
        this.width = 350;
        this.modal = true;
        this.constrain = true,
        this.resizable = true;
        this.closable = true;
        this.closeAction = 'destroy';
        this.id = 'winAddAction';
        var _this = this;

        this.formularioAction = Ext.create('Ext.form.Panel', {
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
                id: 'fieldsetformAccion',
                name:'fieldsetformAccion',
                //collapsible: false,
                defaultType: 'textfield',
                //layout: 'form',
                defaults: {
                    anchor: '100%',
                    style: 'padding: 8px 0 0 0'
                },
                items :[
                   {
                        fieldLabel: perfil.etiquetas.fieldLabelDenominacion,//'Denominación',
                        name:'denominacionacc',
                        id: 'denominacionacc',
                        allowBlank: false,
                        blankText: 'Este campo es obligatorio.',
                        regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-]*))$/,
                        prevTab: 'aceptar',
                        regexText: "Solo admite caracteres alfanuméricos y los caracteres especiales (-_).",
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(texfield, eventObject){
                                //console.log(texfield.isValid())
                                if(texfield.getValue() != "" && texfield.isValid()){
                                    Ext.getCmp('aplicar').enable();
                                    Ext.getCmp('aceptar').enable();
                                }
                                else{
                                    Ext.getCmp('aplicar').disable();
                                    Ext.getCmp('aceptar').disable();
                                }
                            },
                            keydown: function (textField,eventObject){
                                //console.log(eventObject);
                                var ok = textField.getValue().length < 60;
                                var key = eventObject.getKey();
                                //console.log(key);
                                if(key == 8 || key == 46 || key == 37 || key == 39 || key == 35 || key == 36){
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                                else if(!ok){
                                    eventObject.stopEvent();
                                    return ;
                                }
                            }
                        }

                    }, {
                        xtype: 'textarea',
                        fieldLabel: perfil.etiquetas.fieldLabelDescripcion,//'Descripción',
                        defaultType: 'textarea',
                        name: 'descripcionacc',
                        maxLength: 250,
                        maxLengthText: perfil.etiquetas.textMaximoCaracteres,
                        height : '84%',
                        enableKeyEvents: true,
                        listeners: {
                            keydown: function (textField,eventObject){
                                //console.log(eventObject);
                                var ok = textField.getValue().length < 250;
                                var key = eventObject.getKey();
                                //console.log(key);
                                if(key == 8 || key == 46 || key == 37 || key == 39){
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                                else if(!ok){
                                    eventObject.stopEvent();
                                    return ;
                                }
                            }
                        }
                    }
                ]
            }],

            buttons: [
                {
                iconCls: 'cancelar',
                id: 'cancelar',
                nextTab: 'aplicar',
                text: perfil.etiquetas.cancelar,//'Cancelar',
                tooltip: perfil.etiquetas.toolTipcancelar,//'Cerrar ventana sin guardar los datos',
                action:'closeWin'
            },{
                iconCls: 'aplicar',
                id: 'aplicar',
                disabled: true,
                nextTab: 'aceptar',
                prevTab: 'cancelar',
                text: perfil.etiquetas.aplicar,//'Aplicar',
                tooltip: perfil.etiquetas.toolTipaplicar,//'Guardar datos y limpiar los campos',
                action: 'agregarAccion'
            },{
                iconCls: 'aceptar',
                id:'aceptar',
                disabled: true,
                nextTab: 'denominacionacc',
                prevTab: 'aplicar',
                text: perfil.etiquetas.aceptar,//'Aceptar',
                tooltip: perfil.etiquetas.toolTipaceptar,//'Guardar datos y cerrar ventana',
                action: 'agregarAccion'
            }]


        });

        this.items = [this.formularioAction];

        this.callParent(arguments);
    }
});


