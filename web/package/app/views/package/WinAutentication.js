/**
 * Created by adrian on 3/11/14.
 */
Ext.define("Packed.views.Autentication", {
    extend: 'Ext.window.Window',
    alias : 'widget.autentication',

    initComponent:function(){

        this.formPanel = Ext.create('Ext.form.Panel', {

            frame: true,
            width: 340,
            bodyPadding: 5,
            waitMsgTarget: true,

            fieldDefaults: {

                labelWidth: 85,
                msgTarget: 'side'
            },

            items: [{
                xtype: 'fieldset',
                defaultType: 'textfield',
                defaults: {
                    width: 275
                },
                items: [{
                    fieldLabel:  Zeolides.etiquetas.lbUsuario,
                    emptyText: Zeolides.etiquetas.emptyTextUser,
                    name: 'user',
                    id: 'user',
                    allowBlank: false,
                    padding :'5 0 0 0',
                    blankText:  Zeolides.etiquetas.blankText,
                    maxLength: 30,
                    maxLengthText: Zeolides.etiquetas.maxLengthText,
                    regex:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\@\-]*))$/,
                    regexText: Zeolides.etiquetas.textValidacion,
                    nextTab: 'pass',
                    prevTab: 'aceptar'
                }, {
                    fieldLabel:  Zeolides.etiquetas.lbPass,
                    emptyText: Zeolides.etiquetas.emptyTextPass,
                    inputType: 'password',
                    allowBlank: false,
                    name: 'pass',
                    id: 'pass',
                    blankText: Zeolides.etiquetas.blankText,
                    maxLength: 30,
                    maxLengthText:Zeolides.etiquetas.maxLengthText,
                    nextTab: 'cancelar',
                    prevTab: 'user'
                }
                ]
            }],

            buttons: [{
                text: Zeolides.etiquetas.textCancelar,
                iconCls: 'cancelar',
                id: 'cancelar',
                tooltip : Zeolides.etiquetas.tooltipCancelar,
                action:'closeWin',
                nextTab: 'aceptar',
                prevTab: 'pass'
            },{
                text: Zeolides.etiquetas.textAceptar,
                iconCls: 'aceptar',
                id: 'aceptar',
                formBind: true,
                tooltip : Zeolides.etiquetas.tooltipAceptar,
                action:'submitFormAutentic',
                nextTab: 'user',
                prevTab: 'cancelar'
            }]
        });

        this.title = Zeolides.etiquetas.titleWinAutentication,
        this.id = 'winAutentication',
        this.name = 'winAutentication',
        this.width = 350,
        this.height = 145,
        this.layout = 'fit',
        this.modal = true,
        this.resizable = false,
        this.autoShow = true,
        this.constrain = true,
        this.items = [
            this.formPanel
        ],
        this.callParent(arguments);
    }
});

